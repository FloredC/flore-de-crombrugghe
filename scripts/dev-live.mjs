// Dev server that pulls by itself, so a review session needs no terminal.
//
// WHY THIS EXISTS
//
// When Claude is editing the content and Flore is reading the result, the loop
// is: Claude pushes, Flore runs `git pull`, Vite reloads. That middle step is
// the whole friction -- it is invisible (nothing tells you a change landed),
// it is easy to forget, and forgetting it looks exactly like the change not
// having been made. That cost a round on 2026-09-18: four commits were on the
// branch and the page on screen was three behind.
//
// So this runs the normal dev server and, alongside it, checks the remote every
// few seconds and fast-forwards when there is something new. Vite's own HMR
// does the rest; the browser updates without being touched.
//
// WHAT IT WILL NOT DO
//
// It never touches uncommitted work. If the working tree is dirty it says so
// and skips the pull -- your edit wins over the remote's, every time, and you
// find out on the next tick rather than afterwards. It only ever fast-forwards
// (`--ff-only`), so it cannot create a merge commit or leave a conflict behind:
// if the branches have diverged it stops and tells you, which is the point at
// which a person should be deciding rather than a script.
//
// It also stays on whatever branch you started it on. A `git pull` that
// silently followed a branch switch would be a much worse surprise than the
// one this is fixing.
//
// Usage:
//
//   npm run dev:live                  check every 15s
//   npm run dev:live -- --every=60    check every 60s
//   npm run dev:live -- --host        extra args go to Vite, as with `npm run dev`
//
// `npm run dev` is unchanged and stays the default for solo work.

import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const argv = process.argv.slice(2)
const everyArg = argv.find((a) => a.startsWith('--every='))
const intervalMs = Math.max(5, Number(everyArg?.split('=')[1] ?? 15)) * 1000
const viteArgs = argv.filter((a) => !a.startsWith('--every='))

const git = (...args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' })
const out = (...args) => git(...args).stdout.trim()

const branch = out('rev-parse', '--abbrev-ref', 'HEAD')
if (!branch || branch === 'HEAD') {
  console.error('dev:live — not on a branch (detached HEAD). Use `npm run dev`.')
  process.exit(1)
}

const upstream = out('rev-parse', '--abbrev-ref', `${branch}@{upstream}`)
if (!upstream) {
  console.error(`dev:live — ${branch} has no upstream. Push it once with:\n`)
  console.error(`    git push -u origin ${branch}\n`)
  process.exit(1)
}

console.log(`dev:live — watching ${upstream} every ${intervalMs / 1000}s, pulling into ${branch}`)
console.log('dev:live — uncommitted changes always win; nothing is pulled over them\n')

// The dev server is the existing wrapper, not raw Vite, so the Tailwind-config
// restart behaviour it exists for still applies here.
const server = spawn(process.execPath, [path.join(root, 'scripts', 'dev.mjs'), ...viteArgs], {
  cwd: root,
  stdio: 'inherit',
})

let warnedDirty = false
let warnedDiverged = false
let checking = false

async function check() {
  if (checking) return
  checking = true
  try {
    if (git('fetch', 'origin', branch, '--quiet').status !== 0) return

    const local = out('rev-parse', 'HEAD')
    const remote = out('rev-parse', `${upstream}`)
    if (!local || !remote || local === remote) return

    // Behind and fast-forwardable? `merge-base --is-ancestor` answers exactly
    // that, and distinguishes "behind" from "diverged" without parsing counts.
    if (git('merge-base', '--is-ancestor', local, remote).status !== 0) {
      if (!warnedDiverged) {
        console.log(`\ndev:live — ${branch} and ${upstream} have diverged. Not pulling; sort it out by hand.\n`)
        warnedDiverged = true
      }
      return
    }
    warnedDiverged = false

    if (out('status', '--porcelain')) {
      if (!warnedDirty) {
        console.log('\ndev:live — new commits upstream, but you have uncommitted changes. Skipping.')
        console.log('dev:live — commit or stash them and it will pull on the next check.\n')
        warnedDirty = true
      }
      return
    }
    warnedDirty = false

    const res = git('pull', '--ff-only', 'origin', branch)
    if (res.status !== 0) {
      console.log(`\ndev:live — pull failed:\n${res.stderr.trim()}\n`)
      return
    }
    const subject = out('log', '-1', '--format=%h %s')
    console.log(`\ndev:live — pulled: ${subject}`)
    console.log('dev:live — the browser should reload on its own\n')
  } finally {
    checking = false
  }
}

const timer = setInterval(check, intervalMs)
check()

function stop(code) {
  clearInterval(timer)
  if (!server.killed) server.kill('SIGTERM')
  process.exit(code ?? 0)
}
server.on('exit', (code) => stop(code ?? 0))
process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
