// Mimics GitHub Pages project-site semantics so the deploy config can be tested
// locally: everything is served under /flore-de-crombrugghe/, existing files are
// returned as-is, and ANY missing path falls back to 404.html with a real 404
// status. That fallback is the exact behaviour the SPA shim depends on.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = new URL('../dist', import.meta.url).pathname
const BASE = '/flore-de-crombrugghe'
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
