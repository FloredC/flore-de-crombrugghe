#!/usr/bin/env node
/**
 * Move base64-inlined images out of the process-log HTML documents into real
 * files beside them, and rewrite the documents to reference those files.
 *
 * WHY
 * Flore's process logs are exported as single self-contained HTML files with
 * every image inlined as a `data:` URI. That is a fine thing to hand someone as
 * a file, and a bad thing to serve: base64 is ~33% larger than the bytes it
 * encodes, the browser must parse the whole document before it can paint any of
 * it, and nothing is cacheable independently. Six documents came to 42 MB, one
 * of them 26 MB on its own.
 *
 * Externalised, the same content is ~12 MB of HTML plus image files the browser
 * fetches in parallel, caches, and can lazy-load.
 *
 * WHY A SCRIPT AND NOT A MANUAL PASS
 * The obvious alternative — export the images by hand and drop them in a folder
 * — was tried first and does not work. It produced 143 files of which 46 were
 * in none of the documents and 40 document images had no file at all, and the
 * documents went on ignoring the folder because their `src` attributes still
 * pointed at the inlined data. Matching images to documents by hand is exactly
 * the kind of job that should not be done by hand.
 *
 * This also answers the objection against hand-editing generated files (see
 * ProcessLogPage.jsx, and the note on `public/language-river.html`): nobody
 * edits anything. Drop a fresh export in and re-run.
 *
 * USAGE
 *   node scripts/externalize-doc-images.mjs            # dry run, changes nothing
 *   node scripts/externalize-doc-images.mjs --write    # do it
 *   node scripts/externalize-doc-images.mjs --write --prune
 *
 * `--prune` also deletes files in each `img/` folder that this script did not
 * write — leftovers from the manual upload, which are duplicates under
 * different names once the script has run.
 *
 * IDEMPOTENT. A document with no `data:` URIs left is reported and skipped, so
 * re-running is safe and a partially-converted folder converges.
 *
 * FILENAMES are the first 12 hex of the image's SHA-256 plus its real
 * extension. Content-addressed, so the same picture used in three documents is
 * written once and referenced three times, and re-running never churns names.
 * The hash is of the DECODED bytes, not the base64, so a re-export that changes
 * whitespace or encoding still lands on the same filename.
 *
 * PATHS written into the HTML are relative (`./img/ab12….png`). Root-absolute
 * would resolve against the domain root — correct on localhost and 404 under
 * the deployed /flore-de-crombrugghe/ base, a failure `npm run dev` cannot show
 * you. This repo has been bitten by that twice.
 */

import { readdir, readFile, writeFile, mkdir, stat, unlink } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS_ROOT = path.join(ROOT, 'public', 'process')

const WRITE = process.argv.includes('--write')
const PRUNE = process.argv.includes('--prune')

// Matches a data URI wherever it appears — `src="data:…"`, `srcset`, or a CSS
// `url(data:…)` inside a <style> block. Only the URI itself is replaced, so the
// surrounding attribute or function is left exactly as it was.
//
// The character class excludes quotes and parens so a malformed or truncated
// URI stops at its delimiter instead of swallowing the rest of the document.
const DATA_URI = /data:image\/([a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+?)(?=["')\s])/g

// `image/jpeg` -> `.jpg`, and anything with a `+xml` suffix -> its base type.
const EXT = { jpeg: 'jpg', 'svg+xml': 'svg', 'x-icon': 'ico' }
const extFor = (mime) => EXT[mime.toLowerCase()] ?? mime.toLowerCase()

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`

// Finds `./img/<file>` references already present in a document. Used to
// account for the images an ALREADY-EXTERNALISED document depends on.
const EXISTING_REF = /\.\/img\/([A-Za-z0-9._-]+)/g

async function externalise(docPath, imgDir, written) {
  const before = await readFile(docPath)
  let doc = before.toString('utf8')

  const matches = [...doc.matchAll(DATA_URI)]
  if (matches.length === 0) {
    // ALREADY EXTERNALISED — but its images still count as accounted for.
    //
    // This is the bug that made the second run delete all 137 images: a skipped
    // document contributed nothing to `written`, so on a re-run every file in
    // img/ looked like an orphan and --prune removed the lot. The document was
    // left pointing at files that no longer existed.
    //
    // Registering the references a skipped document already carries is what
    // makes "orphan" mean "referenced by nothing" rather than "not written by
    // this particular run".
    for (const ref of doc.matchAll(EXISTING_REF)) {
      if (!written.has(ref[1])) written.set(ref[1], 0)
    }
    return { name: path.basename(docPath), skipped: true, before: before.length }
  }

  const replacements = new Map()
  let unique = 0

  for (const match of matches) {
    const [uri, mime, b64] = match
    if (replacements.has(uri)) continue

    // Whitespace is legal inside base64 in an attribute and breaks decoding.
    const bytes = Buffer.from(b64.replace(/\s+/g, ''), 'base64')
    if (bytes.length === 0) continue

    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12)
    const file = `${hash}.${extFor(mime)}`
    replacements.set(uri, `./img/${file}`)

    if (!written.has(file)) {
      written.set(file, bytes.length)
      unique += 1
      if (WRITE) {
        const target = path.join(imgDir, file)
        // Content-addressed, so an existing file with this name is already
        // byte-identical — skip the write rather than rewrite 20 MB each run.
        const exists = await stat(target).then(() => true, () => false)
        if (!exists) await writeFile(target, bytes)
      }
    }
  }

  for (const [uri, rel] of replacements) doc = doc.split(uri).join(rel)

  const after = Buffer.byteLength(doc, 'utf8')
  if (WRITE) await writeFile(docPath, doc, 'utf8')

  return {
    name: path.basename(docPath),
    refs: matches.length,
    unique,
    before: before.length,
    after,
  }
}

async function run() {
  const projects = await readdir(DOCS_ROOT, { withFileTypes: true })
  let grandBefore = 0
  let grandAfter = 0

  for (const project of projects.filter((entry) => entry.isDirectory())) {
    const dir = path.join(DOCS_ROOT, project.name)
    const imgDir = path.join(dir, 'img')
    const docs = (await readdir(dir)).filter((f) => f.endsWith('.html')).sort()
    if (docs.length === 0) continue

    console.log(`\n${project.name}/  (${docs.length} documents)`)
    if (WRITE) await mkdir(imgDir, { recursive: true })

    // Shared across the project's documents so an image used in two of them is
    // written once — which is the whole point of content-addressing.
    const written = new Map()

    for (const doc of docs) {
      const r = await externalise(path.join(dir, doc), imgDir, written)
      grandBefore += r.before
      if (r.skipped) {
        console.log(`  ${r.name.padEnd(30)} already externalised — skipped`)
        grandAfter += r.before
        continue
      }
      grandAfter += r.after
      const saved = ((1 - r.after / r.before) * 100).toFixed(0)
      console.log(
        `  ${r.name.padEnd(30)} ${String(r.refs).padStart(3)} refs, ` +
          `${String(r.unique).padStart(3)} new images   ` +
          `${mb(r.before).padStart(8)} -> ${mb(r.after).padStart(8)}  (-${saved}%)`,
      )
    }

    const imgBytes = [...written.values()].reduce((a, b) => a + b, 0)
    console.log(`  ${'images written'.padEnd(30)} ${written.size} files, ${mb(imgBytes)}`)

    // Anything in img/ this run did not account for is a leftover.
    const existing = await readdir(imgDir).catch(() => [])
    const orphans = existing.filter((f) => !f.startsWith('.') && !written.has(f))

    // SECOND GUARD, deliberately redundant with the fix above. If a parsing
    // change ever made `written` come back empty for a folder that clearly has
    // documents, pruning would delete every image in it. Refusing to prune
    // everything costs nothing and turns a data-loss bug into a printed
    // warning. Learned the hard way.
    const wouldDeleteEverything = orphans.length > 0 && orphans.length === existing.filter((f) => !f.startsWith('.')).length
    if (wouldDeleteEverything && PRUNE && WRITE) {
      console.log(`  ${'orphans in img/'.padEnd(30)} REFUSING to prune: that would delete all ${orphans.length} files.`)
      console.log(`  ${''.padEnd(30)} Nothing referenced them, which usually means a parse failure, not garbage.`)
      continue
    }
    if (orphans.length) {
      let orphanBytes = 0
      for (const f of orphans) orphanBytes += (await stat(path.join(imgDir, f))).size
      console.log(`  ${'orphans in img/'.padEnd(30)} ${orphans.length} files, ${mb(orphanBytes)}` +
        (PRUNE && WRITE ? ' — deleting' : ' — re-run with --prune to delete'))
      if (PRUNE && WRITE) {
        for (const f of orphans) await unlink(path.join(imgDir, f))
      }
    }
  }

  console.log(
    `\nTOTAL  ${mb(grandBefore)} -> ${mb(grandAfter)} of HTML` +
      `  (-${((1 - grandAfter / grandBefore) * 100).toFixed(0)}%)`,
  )
  if (!WRITE) console.log('\nDRY RUN — nothing changed. Re-run with --write.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
