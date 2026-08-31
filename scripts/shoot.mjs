// Screenshot harness: shoots the homepage across the desktop viewport range and
// builds a contact sheet, so anything that depends on "what fits above the fold"
// can be judged by looking at all of them at once instead of by resizing a
// window six times and trying to remember the last one.
//
// Each shot is exactly one viewport tall -- see the CDP note below, which is the
// whole reason this is not three lines of `chrome --screenshot`.
//
// Usage (dev server must already be running):
//
//   npm run shoot
//   npm run shoot -- --port=5174
//
// Built for the 2026-08-31 map-sizing pass, where it compared five candidate
// layouts. That dimension is gone with the decision; if another round needs it,
// the shape to restore is a list of URL variants looped outside VIEWPORTS.
//
// Output lands in `screenshots/` (gitignored) with `index.html` as the sheet.
//
// WHY CDP AND NOT `--screenshot`
//
// This started as `chrome --headless --screenshot --window-size=W,H`, which is
// simpler and wrong in a way that is very easy to miss. `--window-size` sizes
// the WINDOW: at 1512x856 the page lays out in an 856-87=769px viewport, so
// every shot was of a shorter screen than its own caption claimed. Compensating
// (ask for 943, get 856) fixes the layout but not the capture, which is still
// the full 943 -- so each image showed 87px of page that the real viewport
// would have cut off. For a pass whose entire question is "what is visible
// above the fold", a screenshot that includes below-the-fold content is not a
// small inaccuracy, it is the measurement inverted.
//
// Emulation.setDeviceMetricsOverride sets the layout viewport directly and
// Page.captureScreenshot returns exactly that, so the two cannot disagree. CDP
// also means the metrics come back from Runtime.evaluate rather than being
// scraped out of --dump-dom's HTML.
//
// No dependency: Chrome speaks CDP over a WebSocket and Node has had a global
// WebSocket since 22. Playwright would be the right call the moment this needs
// to drive the page (open a popover, hover a marker); until then it is a 150MB
// download for a socket and six commands.
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'screenshots')

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Chosen to bracket the band this pass is about, not to enumerate devices.
// 1366x670 is the worst case that matters -- a short 13" laptop, where height
// binds hardest -- and 1728x1080 is the far end where the map caps at native
// and the reserve stops mattering at all. 1600x900 sits deliberately just above
// the `2xl` boundary, which is where the Work grid's featured card changes span.
const VIEWPORTS = [
  [1280, 800],
  [1366, 670],
  [1440, 790],
  [1512, 856],
  [1600, 900],
  [1728, 1080],
]

// 2x so the sheet stays crisp when each shot is displayed at half size, which is
// the only way six viewports fit side by side on one screen.
const DPR = 2

function arg(name, fallback) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=')[1] : fallback
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// --- Chrome + CDP ----------------------------------------------------------

// Port 0 lets the OS pick, and Chrome writes what it picked into
// DevToolsActivePort under the profile dir. Polling that file is the documented
// way to find it, and it avoids a fixed port colliding with a Chrome the user
// already has open for debugging.
async function launchChrome() {
  const userDataDir = await mkdtemp(path.join(os.tmpdir(), 'hero-shoot-'))
  const child = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-debugging-port=0',
      `--user-data-dir=${userDataDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  )

  const portFile = path.join(userDataDir, 'DevToolsActivePort')
  for (let i = 0; i < 100; i += 1) {
    try {
      const [port] = (await readFile(portFile, 'utf8')).split('\n')
      if (port) {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`)
        return { child, userDataDir, wsUrl: (await res.json()).webSocketDebuggerUrl }
      }
    } catch {
      // Not up yet.
    }
    await sleep(100)
  }
  throw new Error('Chrome did not expose a debugging port within 10s')
}

// Minimal CDP client: request/response by id, plus one-shot event waiting.
// `sessionId` rides on every message so the same socket can drive the page
// target ("flat" mode) rather than tunnelling through Target.sendMessageToTarget.
function connect(wsUrl) {
  const ws = new WebSocket(wsUrl)
  const pending = new Map()
  const waiters = []
  let nextId = 1

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) reject(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data)})`))
      else resolve(msg.result)
      return
    }
    for (let i = waiters.length - 1; i >= 0; i -= 1) {
      if (waiters[i].method === msg.method) waiters.splice(i, 1)[0].resolve(msg.params)
    }
  })

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })

  return {
    ready,
    close: () => ws.close(),
    send(method, params = {}, sessionId) {
      const id = nextId
      nextId += 1
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
      })
    },
    once(method, timeoutMs = 20000) {
      return new Promise((resolve, reject) => {
        const waiter = { method, resolve }
        waiters.push(waiter)
        setTimeout(() => {
          const i = waiters.indexOf(waiter)
          if (i !== -1) {
            waiters.splice(i, 1)
            reject(new Error(`Timed out waiting for ${method}`))
          }
        }, timeoutMs)
      })
    },
  }
}

// --- the shot ---------------------------------------------------------------

// Measured by the page, on demand, AFTER the settle below -- so the numbers
// describe the exact frame being captured rather than whatever the last render
// happened to publish. See useHeroMetrics in Hero.jsx for why that distinction
// earned its own mechanism.
const READ_METRICS = `window.__heroMetrics ? window.__heroMetrics() : null`

async function shoot(cdp, session, { url, file, width, height }) {
  await cdp.send(
    'Emulation.setDeviceMetricsOverride',
    { width, height, deviceScaleFactor: DPR, mobile: false },
    session,
  )
  const loaded = cdp.once('Page.loadEventFired')
  await cdp.send('Page.navigate', { url }, session)
  await loaded

  // Fonts are local and the map is one inline SVG, so there is nothing slow to
  // wait on -- but the metrics are published from an effect, so this waits for
  // the frame after paint rather than for the network.
  await cdp.send(
    'Runtime.evaluate',
    {
      expression: `new Promise(r => { document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(r))) })`,
      awaitPromise: true,
    },
    session,
  )

  const { result } = await cdp.send(
    'Runtime.evaluate',
    { expression: READ_METRICS, returnByValue: true },
    session,
  )
  const shot = await cdp.send('Page.captureScreenshot', { format: 'png' }, session)
  await writeFile(file, Buffer.from(shot.data, 'base64'))
  return result.value
}

// --- run --------------------------------------------------------------------

const port = arg('port', '5173')
await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const { child, userDataDir, wsUrl } = await launchChrome()
const cdp = connect(wsUrl)
await cdp.ready

const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
await cdp.send('Page.enable', {}, sessionId)

const cells = []
try {
  for (const [width, height] of VIEWPORTS) {
    const name = `${width}x${height}.png`
    process.stdout.write(`  ${name} ... `)
    const metrics = await shoot(cdp, sessionId, {
      url: `http://localhost:${port}/?readout=0`,
      file: path.join(outDir, name),
      width,
      height,
    })
    // The page reports the viewport it actually laid out in. If that ever
    // disagrees with what was asked for, the caption would be a lie about the
    // image above it -- so say so loudly rather than writing it into the sheet.
    const ok = metrics?.viewport === `${width}x${height}`
    console.log(
      metrics
        ? `${ok ? '' : `MISMATCH ${metrics.viewport} — `}map ${metrics.mapW}px, scale ${metrics.scale}`
        : 'no metrics',
    )
    cells.push({ name, width, height, metrics, ok })
  }
} finally {
  cdp.close()
  child.kill()
  await rm(userDataDir, { recursive: true, force: true })
}

// The sheet is a plain local file rather than an Artifact: it is 24 PNGs at 2x,
// far past what is reasonable to inline as data URIs.
const html = `<!doctype html>
<meta charset="utf-8">
<title>Homepage — first screen across viewports</title>
<style>
  body { margin: 0; padding: 32px; font: 14px/1.5 -apple-system, system-ui, sans-serif;
         background: #14161a; color: #e8eaed; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .sub { color: #9aa0a6; margin: 0 0 28px; max-width: 90ch; }
  .row { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; }
  figure { margin: 0; flex: 0 0 auto; width: 440px; }
  img { width: 100%; display: block; border: 1px solid #3c4043; border-radius: 6px; background: #fff; }
  figcaption { font: 12px/1.45 ui-monospace, SFMono-Regular, monospace; color: #9aa0a6; padding-top: 6px; }
  figcaption b { color: #e8eaed; font-weight: 600; }
  .bad { color: #f28b82; }
</style>
<h1>Homepage — first screen across viewports</h1>
<p class="sub">Each shot is exactly one viewport-height: what a cold visitor sees before scrolling, nothing more.
Captions are measured from the page itself, not typed in.
<b>artGap</b> = white space between the island and the Work heading ·
<b>clearance</b> = space left below the Work heading ·
<b>guideOverArt</b> = how far the avatar block reaches past the island's left edge (negative = clears it).</p>
<div class="row">
${cells
  .map(
    (c) => `  <figure>
    <img src="${c.name}" alt="homepage at ${c.width}x${c.height}">
    <figcaption>${c.ok ? '' : '<span class="bad">VIEWPORT MISMATCH</span> '}${c.width}×${c.height}${
      c.metrics
        ? ` · map <b>${c.metrics.mapW}px</b> (scale ${c.metrics.scale})<br>artGap ${c.metrics.artGap} · clearance ${c.metrics.clearance} · guideOverArt ${c.metrics.guideOverArt}`
        : ''
    }</figcaption>
  </figure>`,
  )
  .join('\n')}
</div>
`

await writeFile(path.join(outDir, 'index.html'), html)
// Emitted alongside the sheet so the same run can feed something else -- a
// shareable page, a diff against the last round -- without re-scraping numbers
// back out of the HTML that was generated from them.
await writeFile(path.join(outDir, 'metrics.json'), `${JSON.stringify(cells, null, 2)}\n`)
console.log(`\nContact sheet: ${path.join(outDir, 'index.html')}`)
