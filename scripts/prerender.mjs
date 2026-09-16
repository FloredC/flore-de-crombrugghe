// Writes one real HTML file per case-study route, each with its own link-preview
// tags. Runs after `vite build`, over the built dist/.
//
// WHY THIS EXISTS
//
// The site is a client-side SPA: every /work/:slug route is assembled by React
// after the JS loads. Link-preview crawlers -- LinkedIn, Slack, WhatsApp,
// iMessage, X -- do not run JS. They fetch the URL, read the <head> of whatever
// HTML comes back, and stop. So og:* tags set from inside React are never seen
// by the only readers they exist for.
//
// Before this script, every shared case-study link unfurled with the HOMEPAGE's
// title, description and map image, because that is what the single index.html
// said. That is the exact failure the eleven exported previews were made to fix,
// and no amount of React-side <head> management can fix it.
//
// The fix is to make each route a file that physically exists. GitHub Pages
// serves files, so dist/work/artifakt/index.html is returned directly for
// /work/artifakt. The crawler reads Artifakt's tags; a human's browser boots the
// same app bundle and React Router takes over from there, identically to before.
//
// SECOND, UNADVERTISED BENEFIT: these routes stop going through public/404.html.
// That shim exists because Pages 404s on paths with no file, and it costs a
// redirect plus a history.replaceState on every deep link. A route with a real
// file skips it entirely and loads a frame faster. The shim still covers
// everything not prerendered here (process logs, the renamed-slug redirect, and
// genuine typos), so it stays.
//
// CONTENT COMES FROM THE .mdx FRONTMATTER, never from a list in this file. Titles
// and descriptions live in src/content/projects/*.mdx and are already rendered on
// the cards; a second copy here would be a second thing to update, and would drift
// silently because nothing renders it visibly. Adding a project means adding its
// .mdx and its preview image -- this script needs no edit.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const PROJECTS = join(ROOT, 'src/content/projects')

// The live origin. Absolute URLs are not a style choice here: crawlers do not
// resolve relative paths, so an og:image of "/images/..." is simply dropped.
// Moves alongside BASE in vite.config.js and public/CNAME -- see the note in
// index.html listing all the places an origin change touches.
const ORIGIN = 'https://floredecrombrugghe.com'

// --- frontmatter ------------------------------------------------------------
//
// A deliberately small reader rather than a YAML dependency. The frontmatter
// this consumes is three flat `key: "value"` lines out of a block the rest of
// the site already parses properly at build time via remark-mdx-frontmatter.
// Pulling gray-matter into the build to re-read three strings would be a
// dependency for no added correctness -- but it is also why this throws loudly
// below rather than coercing: if the shape ever stops being flat, this must
// fail the build, not quietly emit a page with no title.
function frontmatter(mdx) {
  const block = mdx.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!block) return null
  const out = {}
  for (const line of block[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/)
    if (!kv) continue
    let value = kv[2].trim()
    // Only unwrap a quoted scalar. Anything else (nested YAML, arrays, null)
    // is left as the raw string and simply never asked for by this script.
    const quoted = value.match(/^"([\s\S]*)"$/) || value.match(/^'([\s\S]*)'$/)
    if (quoted) value = quoted[1]
    out[kv[1]] = value
  }
  return out
}

// Escapes for an HTML *attribute*. The descriptions contain em dashes and
// ampersands and are written by hand, so this is not theoretical: an unescaped
// `"` would end the content attribute early and silently truncate the preview.
const attr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Replaces the content="" of one existing tag, matched on its identifying
// attribute. Returns null when the tag is absent so the caller can fail the
// build -- a silent no-op here would ship pages whose tags all still say
// "homepage", which is indistinguishable from this script not running at all.
function setContent(html, matcher, value) {
  const re = new RegExp(`(<meta\\s+${matcher}\\s+content=")[^"]*(")`)
  if (!re.test(html)) return null
  return html.replace(re, `$1${attr(value)}$2`)
}

function setTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${attr(value)}</title>`)
}

// --- build ------------------------------------------------------------------

const template = readFileSync(join(DIST, 'index.html'), 'utf8')

const projects = readdirSync(PROJECTS)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => frontmatter(readFileSync(join(PROJECTS, f), 'utf8')))
  .filter((fm) => fm?.slug && fm?.title && fm?.description)

if (projects.length === 0) {
  throw new Error('prerender: no project frontmatter found — refusing to emit a site with no previews')
}

const written = []
const fallbacks = []

for (const { slug, title, description } of projects) {
  // The preview image, if one was exported for this route. A missing file falls
  // back to the homepage map rather than emitting a 404 image URL, which most
  // crawlers render as a broken card and some treat as no image at all.
  const rel = `/images/link-previews/${slug}.png`
  const hasOwn = existsSync(join(DIST, rel.slice(1)))
  if (!hasOwn) fallbacks.push(slug)
  const image = `${ORIGIN}${hasOwn ? rel : '/images/link-previews/home.png'}`
  const url = `${ORIGIN}/work/${slug}`

  let html = template

  // <title> carries her name because it is the browser tab and the Google
  // result line. og:title does not: og:site_name already says "Flore de
  // Crombrugghe" and every platform renders it beside the title, so repeating
  // it there only eats the ~100 characters LinkedIn will show.
  html = setTitle(html, `${title} · Flore de Crombrugghe`)

  const edits = [
    ['name="description"', description],
    ['property="og:title"', title],
    ['property="og:description"', description],
    ['property="og:url"', url],
    ['property="og:image"', image],
    ['property="og:image:alt"', `Preview of the ${title} page.`],
    ['name="twitter:title"', title],
    ['name="twitter:description"', description],
    ['name="twitter:image"', image],
  ]

  for (const [matcher, value] of edits) {
    const next = setContent(html, matcher, value)
    if (next === null) {
      throw new Error(
        `prerender: index.html has no <meta ${matcher}> to rewrite. ` +
          `The template and this script have drifted — fix index.html rather than ` +
          `dropping the tag here, or ${slug} ships with the homepage's preview.`
      )
    }
    html = next
  }

  // og:type on a case study is "article", not the homepage's "website". Minor,
  // but it is what makes LinkedIn treat the card as a piece of writing.
  html = html.replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="article" />')

  const dir = join(DIST, 'work', slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  written.push(slug)
}

console.log(`prerender: wrote ${written.length} route(s) — ${written.join(', ')}`)
if (fallbacks.length) {
  console.warn(`prerender: NO preview image for ${fallbacks.join(', ')} — using the homepage image`)
}
