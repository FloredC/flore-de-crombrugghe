// Dev server wrapper that restarts Vite when tailwind.config.js changes.
//
// Why this exists: Tailwind 3's PostCSS plugin resolves the config once and
// holds it for the life of the Node process. The config is ESM, so it can't be
// uncached, and Vite's own in-process `server.restart()` does NOT clear it --
// that was tried as a Vite plugin and measured: it logged a restart and kept
// serving the previous CSS. A browser reload doesn't help either, because the
// stale CSS is generated server-side.
//
// The practical symptom is nasty: the page renders and looks plausible, but
// it's painting the previous type scale. It cost several rounds of "is this
// live?" during the type pass before anyone read the served CSS rule directly.
//
// Killing and respawning the process is the only thing that works, so that's
// what this does. Every other file (components, CSS, content) hot-reloads
// normally and is untouched by this.
//
// Usage is unchanged: `npm run dev`, `npm run dev -- --host`, etc. Extra args
// are forwarded to Vite as-is.

import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const viteBin = path.join(root, 'node_modules', '.bin', 'vite')
const watched = path.join(root, 'tailwind.config.js')
const args = process.argv.slice(2)

let child = null
let restarting = false

function start() {
  child = spawn(viteBin, args, { cwd: root, stdio: 'inherit' })
  child.on('exit', (code) => {
    // A restart kills the child on purpose -- don't take the whole wrapper
    // down with it, or the watcher dies and we're back to manual restarts.
    if (!restarting) process.exit(code ?? 0)
  })
}

function restart() {
  if (restarting || !child) return
  restarting = true
  console.log('\n\x1b[36m[dev]\x1b[0m tailwind.config.js changed — restarting Vite')
  console.log('\x1b[2m      (token changes need a new process; an in-place reload keeps the old CSS)\x1b[0m\n')
  child.once('exit', () => {
    restarting = false
    start()
  })
  child.kill('SIGTERM')
}

// Watch the DIRECTORY, not the file.
//
// `watch(configPath)` binds to the file's inode, and most editors save by
// writing a temp file and renaming it over the original -- so after the very
// first save the watcher is holding a handle to an inode nothing points at,
// and every later change is silently missed. That failed exactly that way when
// tested: the first edit restarted, the second did nothing. Watching the
// directory and filtering by name survives replace-on-save.
//
// Editors also fire several events per save, so debounce -- otherwise one
// save restarts the server three times.
let pending = null
watch(root, (_event, filename) => {
  if (filename !== path.basename(watched)) return
  clearTimeout(pending)
  pending = setTimeout(restart, 120)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    restarting = true // suppress the exit handler so we control the exit code
    child?.kill(signal)
    process.exit(0)
  })
}

start()
