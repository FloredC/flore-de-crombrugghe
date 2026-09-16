// Mimics GitHub Pages serving semantics so the deploy config can be tested
// locally: existing files are returned as-is, and ANY missing path falls back to
// 404.html with a real 404 status. That fallback is the exact behaviour the SPA
// shim depends on, and `npm run dev` cannot reproduce it.
//
// Since the custom-domain move (2026-09-01) the site is served from the root, so
// BASE is empty and this is a plain static server -- but it still earns its
// place, because it is the only local setup where the PRERENDERED route files
// (dist/work/<slug>/index.html) are served the way Pages serves them: as a real
// file for /work/artifakt rather than through the 404 shim. Getting that wrong
// looks identical in dev and fails only in production.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = new URL('../dist', import.meta.url).pathname
// Read back out of vite.config.js rather than restated, so this server and the
// build cannot disagree about where the site root is -- the failure that would
// cause is a local preview that works while production 404s, or vice versa.
const BASE = (
  await readFile(new URL('../vite.config.js', import.meta.url), 'utf8')
).match(/^const BASE = '([^']*)'/m)[1].replace(/\/$/, '')
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  let p = url.pathname

  if (!p.startsWith(BASE)) {
    res.writeHead(404, { 'content-type': 'text/plain' })
    return res.end('outside site root')
  }
  let rel = p.slice(BASE.length) || '/'
  if (rel.endsWith('/')) rel += 'index.html'

  // DIRECTORY-INDEX REDIRECT, the behaviour that makes the prerendered routes
  // work. Pages does not serve /work/artifakt from work/artifakt/index.html
  // directly -- it answers 301 to /work/artifakt/ and serves the index from
  // there. Every link on the site points at the slash-less form, so without
  // this the simulator 404s ten routes that are fine in production, which is
  // exactly the false signal this script exists to avoid giving.
  if (!rel.endsWith('/')) {
    try {
      if ((await stat(join(ROOT, rel))).isDirectory()) {
        res.writeHead(301, { location: p + '/' + url.search })
        return res.end()
      }
    } catch {
      // Not a directory (or absent) -- fall through to the normal file lookup.
    }
  }

  const file = join(ROOT, rel)
  try {
    const s = await stat(file)
    if (!s.isFile()) throw new Error('dir')
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    // The Pages behaviour that makes the whole thing work.
    const body = await readFile(join(ROOT, '404.html'))
    res.writeHead(404, { 'content-type': 'text/html' })
    res.end(body)
  }
}).listen(4180, () => console.log('pages-sim on http://localhost:4180' + BASE + '/'))
