/**
 * Generates the helicopter rotor keyframes in src/styles/globals.css.
 *
 * Run:  node scripts/rotor-keyframes.mjs
 * then paste the output over the block between the ROTOR KEYFRAMES markers.
 *
 * Committed rather than hand-written for the same reason scripts/type-scale.mjs
 * is: the numbers are DERIVED, and a hand-edited stop silently moves a value
 * that geometry owns. See the projection note in src/components/Helicopter.jsx
 * for why this is scaleX/scaleY rather than a rotation.
 *
 * The two flattening ratios are read off the discs in the Figma export:
 *   main   ry/rx = 53.4146 / 280.077
 *   tail   rx/ry = 20.8779 / 42.0044
 */
const STEPS = 48
const MAIN_K = 53.4146 / 280.077
const TAIL_K = 20.8779 / 42.0044
const deg = (r) => ((r * 180) / Math.PI).toFixed(2)

function main() {
  const out = []
  for (let k = 0; k <= STEPS; k++) {
    const r = (k / STEPS) * 2 * Math.PI
    const x = Math.cos(r)
    const y = MAIN_K * Math.sin(r)
    out.push(
      `  ${((k / STEPS) * 100).toFixed(4).replace(/\.?0+$/, '')}% { ` +
        `transform: rotate(${deg(Math.atan2(y, x))}deg) scaleX(${Math.hypot(x, y).toFixed(4)}); }`
    )
  }
  return out.join('\n')
}
function tail() {
  const out = []
  for (let k = 0; k <= STEPS; k++) {
    const r = (k / STEPS) * 2 * Math.PI
    const x = TAIL_K * Math.cos(r)
    const y = Math.sin(r)
    out.push(
      `  ${((k / STEPS) * 100).toFixed(4).replace(/\.?0+$/, '')}% { ` +
        `transform: rotate(${deg(Math.atan2(-x, y))}deg) scaleY(${Math.hypot(x, y).toFixed(4)}); }`
    )
  }
  return out.join('\n')
}
console.log(`@keyframes heli-main-rotor {\n${main()}\n}\n`)
console.log(`@keyframes heli-tail-rotor {\n${tail()}\n}`)
