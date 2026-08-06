// Downscale the committed PNGs to 2x their real rendered width.
//
// Everything was exported from Figma at 4x (5x for the About images), which is
// why the homepage shipped ~14MB of raster. Retina tops out at 2x -- beyond
// that the extra pixels are invisible on every display, and cost is quadratic:
// going 4x -> 2x is 4x fewer pixels, 5x -> 2x is 6.25x fewer.
//
// Targets are 2 x the width each image ACTUALLY renders at, measured in the
// browser rather than guessed (see the overshoot table in the session notes).
// If a card's layout width changes materially, re-measure and re-run -- but
// re-exporting from Figma is never needed, since downscaling only ever
// discards pixels.
//
// Uses `sips`, which ships with macOS, so there's no image dependency to add.
// Originals stay recoverable from git history and from Figma.
import { execFileSync } from 'node:child_process'
import { statSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('../public/images', import.meta.url).pathname

// filename pattern -> target width (2 x rendered CSS width)
const TARGETS = [
  [/^artifakt-thumbnail/, 1760], // renders 880 in the large card
  [/^(welcome-to-my-city|pitchpivot|rega|sbb|myride|trail-app)-thumbnail/, 1062], // renders 531
  [/^(sinomocene|teamchatviz|roche)-thumbnail/, 640], // renders 320 in the 3-up
  [/^img-relocation-vs-sense-of-belonging/, 960], // the wide aside card, renders 480
  [/^img-/, 640], // every other aside/media image renders 320
]

const targetFor = (name) => TARGETS.find(([re]) => re.test(name))?.[1]
const width = (f) =>
  +execFileSync('sips', ['-g', 'pixelWidth', f], { encoding: 'utf8' }).match(/pixelWidth:\s*(\d+)/)[1]

let before = 0
let after = 0
const rows = []

for (const dir of ['projects', 'about']) {
  for (const name of readdirSync(join(ROOT, dir))) {
    if (!name.endsWith('.png')) continue
    const file = join(ROOT, dir, name)
    const target = targetFor(name)
    const w0 = width(file)
    const s0 = statSync(file).size
    before += s0

    if (!target || w0 <= target) {
      after += s0
      rows.push(`  skip   ${name} (${w0}px, already <= target)`)
      continue
    }

    // --resampleWidth preserves aspect ratio and uses a proper downsampling
    // filter; no separate height needed.
    execFileSync('sips', ['--resampleWidth', String(target), file, '--out', file], { stdio: 'ignore' })

    const s1 = statSync(file).size
    after += s1
    rows.push(
      `  ${((1 - s1 / s0) * 100).toFixed(0).padStart(3)}%   ${name}  ${w0}->${target}px  ` +
        `${(s0 / 1048576).toFixed(2)}MB -> ${(s1 / 1048576).toFixed(2)}MB`
    )
  }
}

console.log(rows.join('\n'))
console.log(
  `\ntotal: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB ` +
    `(${((1 - after / before) * 100).toFixed(0)}% smaller)`
)
