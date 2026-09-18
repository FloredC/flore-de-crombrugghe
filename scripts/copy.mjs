// Copy extractor: prints everything a VISITOR reads on a case-study page, and
// nothing else.
//
// WHY THIS EXISTS
//
// `src/content/case-studies/artifakt.js` is 1020 lines, of which roughly half
// are comments -- Figma node ids, re-pull dates, bug post-mortems -- wrapped
// around about 1000 words of actual prose. That commentary earns its place for
// whoever edits the file next, and it makes the file unreadable for the person
// who only wants to review the writing. A copy review should be a diff of
// sentences, not a scroll through provenance notes.
//
// So this does not reformat, lint or judge anything. It reads the real module
// and prints the strings a reader would see, in the order they meet them.
//
// WHY IT IMPORTS THE MODULE RATHER THAN PARSING THE FILE
//
// The ten case studies do not share a shape: `artifakt` and
// `welcome-to-my-island` have `body`, the NDA pages have `columns`, `roche`
// and friends have `views`, and `pitchpivot` has seven named sections of its
// own. A regex over the source would need to know all of that and would go
// stale the first time an eleventh shape appeared. Importing the module and
// walking the resulting object needs to know only two things: which keys hold
// prose, and which hold configuration.
//
// The module imports `../../lib/caseStudyLayout` without a file extension,
// which plain Node will not resolve, so esbuild bundles it to a temp file
// first. esbuild is already present as a Vite dependency; this adds nothing.
//
// THE PATH COMMENTS ARE LOad-BEARING
//
// Every block is emitted under an HTML comment naming its location in the
// module, e.g. `<!-- body[4].prose[2] -->`. Two reasons, and the second is the
// point: it tells a reviewer exactly which block to quote back, and it is the
// join key if these files ever become the source of truth rather than a view
// of it. A round trip needs a stable address per block; this is it.
//
// Usage:
//
//   npm run copy artifakt          one page  -> copy/artifakt.md
//   npm run copy all               every page
//   npm run copy artifakt --stdout print instead of writing
//   npm run copy artifakt --alt    include image alt text
//
// Output lands in `copy/` (gitignored) -- it is a view, not a source.

import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'src', 'content', 'case-studies')
const outDir = path.join(root, 'copy')
const esbuild = path.join(root, 'node_modules', '.bin', 'esbuild')

// Keys whose string values a visitor reads. Anything not listed here is
// treated as configuration and skipped, so a new config key added to a module
// stays out of the copy by default -- the safe direction for this to fail.
const PROSE_KEYS = new Set([
  'category', 'title', 'oneLiner', 'role', 'date', 'liveLabel',
  'heading', 'note', 'text', 'caption', 'legend', 'eyebrow',
  'value', 'unit', 'quote', 'attribution', 'body', 'description',
])

// `label` means two different things: a visitor-facing link ("The 14 phases
// behind this pipeline") and a dev placeholder on media ("[ hero.webp -- 545x1185
// ... ]"). Only the first is copy, so it is allowed solely under `link`.
const LABEL_OK_UNDER = new Set(['link', 'cta', 'onward', 'contact'])

// Never copy, whatever they contain.
const DENY = new Set([
  'src', 'poster', 'href', 'slug', 'zone', 'subsection', 'stage', 'tint',
  'radius', 'layout', 'kind', 'placeholderAspect', 'maxWidth', 'mediaClassName',
  'className', 'avatar', 'id', 'aspect', 'viewAspect', 'viewChrome', 'plain',
  'file', 'thumb', 'liveUrl', 'externalLink', 'order', 'featured', 'width',
  'height', 'poster', 'name',
])

const args = process.argv.slice(2)
const flags = new Set(args.filter((a) => a.startsWith('--')))
const targets = args.filter((a) => !a.startsWith('--'))
const withAlt = flags.has('--alt')
const toStdout = flags.has('--stdout')

async function loadModule(slug) {
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'copy-'))
  const bundled = path.join(tmp, `${slug}.mjs`)
  const res = spawnSync(esbuild, [
    path.join(srcDir, `${slug}.js`),
    '--bundle', '--format=esm', '--platform=node', `--outfile=${bundled}`,
    '--log-level=error',
  ], { encoding: 'utf8' })
  if (res.status !== 0) throw new Error(`esbuild failed for ${slug}:\n${res.stderr}`)
  const mod = await import(`file://${bundled}`)
  await rm(tmp, { recursive: true, force: true })
  return mod.default ?? Object.values(mod)[0]
}

// Markdown for one typed prose block. The four types in use across all ten
// pages are p / list / quote / aside; anything else is emitted as a paragraph
// with its type named, so a new block type shows up in the output rather than
// vanishing from it.
function renderBlock(node) {
  if (typeof node === 'string') return node
  switch (node.type) {
    case 'p': return node.text
    case 'list': return (node.items ?? []).map((i) => `- ${i}`).join('\n')
    case 'quote': return `> ${node.text}`
    case 'aside': return `*${node.text}*`
    default:
      if (node.text) return `${node.text}${node.type ? `  <!-- type: ${node.type} -->` : ''}`
      return null
  }
}

function walk(node, out, trail = [], parentKey = null) {
  if (node == null) return
  const here = trail.join('')

  if (Array.isArray(node)) {
    node.forEach((child, i) => walk(child, out, [...trail, `[${i}]`], parentKey))
    return
  }

  if (typeof node === 'object') {
    // A typed prose block renders as a unit rather than key by key, so a list's
    // items stay one block instead of becoming N stray strings.
    if (node.type && (node.text || node.items)) {
      const md = renderBlock(node)
      if (md) out.push({ path: here, md })
      return
    }
    for (const [key, value] of Object.entries(node)) {
      if (DENY.has(key)) continue
      if (key === 'alt' && !withAlt) continue
      if (key === 'label' && !LABEL_OK_UNDER.has(parentKey)) continue
      walk(value, out, [...trail, trail.length ? `.${key}` : key], key)
    }
    return
  }

  if (typeof node !== 'string') return
  const text = node.trim()
  if (!text) return
  if (parentKey === 'alt') { out.push({ path: here, md: `*Alt: ${text}*` }); return }
  if (parentKey === 'caption') { out.push({ path: here, md: `*Caption: ${text}*` }); return }
  if (parentKey === 'note') { out.push({ path: here, md: `> **Guide:** ${text}` }); return }
  if (parentKey === 'title' || parentKey === 'heading') {
    out.push({ path: here, md: `## ${text}`, heading: true }); return
  }
  if (PROSE_KEYS.has(parentKey) || parentKey === 'label') { out.push({ path: here, md: text }); return }
}

function toMarkdown(slug, data) {
  const out = []
  walk(data, out)

  const lines = [
    `# ${data.frame?.title ?? slug}`,
    '',
    `<!-- Extracted from src/content/case-studies/${slug}.js by scripts/copy.mjs.`,
    `     A VIEW, not a source: edit the .js, then re-run \`npm run copy ${slug}\`.`,
    `     Path comments name each block's location in that module. -->`,
    '',
  ]

  // The first heading is the page title, already used above.
  let first = true
  for (const { path: p, md, heading } of out) {
    if (heading && first) { first = false; continue }
    lines.push(`<!-- ${p} -->`, md, '')
  }

  const words = out.reduce((n, b) => n + b.md.split(/\s+/).length, 0)
  lines.push('---', '', `<!-- ${out.length} blocks, ~${words} words -->`)
  return lines.join('\n')
}

const slugs = targets.length === 0 || targets[0] === 'all'
  ? (await readdir(srcDir)).filter((f) => f.endsWith('.js')).map((f) => f.replace(/\.js$/, ''))
  : targets

if (!toStdout) await mkdir(outDir, { recursive: true })

for (const slug of slugs) {
  const data = await loadModule(slug)
  const md = toMarkdown(slug, data)
  if (toStdout) {
    process.stdout.write(md + '\n')
  } else {
    const dest = path.join(outDir, `${slug}.md`)
    await writeFile(dest, md + '\n')
    console.log(`copy/${slug}.md  ${md.split('\n').length} lines`)
  }
}
