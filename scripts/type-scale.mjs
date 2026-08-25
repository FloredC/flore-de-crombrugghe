/**
 * Generates the piecewise `clamp()` expressions in tailwind.config.js's
 * `fontSize` block. Run it, paste the output back into that file.
 *
 * WHY THIS EXISTS RATHER THAN HAND-EDITING THE CLAMPS
 *
 * Each expression carries two derived coefficients -- a rem intercept and a vw
 * slope -- and neither is meaningful on its own. Nudging an intercept by hand
 * moves BOTH anchors of that segment, including the 402 and 1622 ends that are
 * measured off the Figma frames and are supposed to be exact. The failure is
 * silent: the expression still parses, still looks fluid, and is simply wrong
 * at the one width anybody would check it against.
 *
 * So the anchors are the editable thing and the coefficients are output.
 *
 * THE SHAPE
 *
 *   clamp(mobile, max(min(A, plateau), C), desktop)
 *
 *   A         402 -> 1280 ramp, mobile value up to the laptop value
 *   min(A,P)  clips A at the plateau, so 1280-1500 is flat
 *   max(.,C)  C only overtakes the plateau above 1500, ramping to 1622
 *   clamp     pins the two measured Figma ends exactly
 *
 * Run: node scripts/type-scale.mjs
 */

const ROOT = 16 // px, the browser default the rem terms are expressed against

// The four viewport anchors the scale is built on. 402 and 1622 are the two
// Figma page frames; 1280 and 1500 bound the laptop plateau (see the `screens`
// note in tailwind.config.js for why the regime boundary is 1600 but the
// plateau ends at 1500 -- the last 122px is the ramp).
const MOBILE = 402
const KNEE = 1280
const PLATEAU_END = 1500
const DESKTOP = 1622

// [mobile @402, laptop plateau, desktop @1622] in px.
// The mobile and desktop columns are MEASURED off Figma text styles. Only the
// middle column is a judgement call, and it is the only one to tune.
const TOKENS = {
  display: [36, 42, 48],
  h1: [28, 32, 36],
  h2: [24, 24, 28],
  'body-lg': [16, 18, 20],
  body: [16, 17, 18],
  'body-sm': [14, 15, 16],
  caption: [12, 13, 14],
}

const rem = (px) => `${+(px / ROOT).toFixed(5)}rem`

// A linear segment through two (viewport px, font px) anchors, as `<rem> + <vw>vw`.
function segment(x1, y1, x2, y2) {
  const slope = (y2 - y1) / (x2 - x1)
  const intercept = y1 - slope * x1
  // A flat segment is legal and meaningful -- it says the token holds one size
  // from the mobile frame all the way to the plateau -- but `x + 0vw` is noise
  // in the output, so emit the constant.
  if (slope === 0) return rem(y1)
  return `${+(intercept / ROOT).toFixed(5)}rem + ${+(slope * 100).toFixed(4)}vw`
}

// Same maths CSS will do, so the printed table is a real check and not a
// restatement of the inputs.
function resolve(expr, vw) {
  const line = (s) => {
    const [a, b] = s.split(' + ')
    // A flat segment has no vw term (see `segment` above).
    return parseFloat(a) * ROOT + (b ? (parseFloat(b) / 100) * vw : 0)
  }
  const { mobile, a, plateau, c, desktop } = expr
  return Math.min(Math.max(Math.max(Math.min(line(a), plateau), line(c)), mobile), desktop)
}

const CHECK = [402, 768, 1024, 1280, 1366, 1440, 1512, 1560, 1600, 1622, 1920]

for (const [name, [mobile, plateau, desktop]] of Object.entries(TOKENS)) {
  const a = segment(MOBILE, mobile, KNEE, plateau)
  const c = segment(PLATEAU_END, plateau, DESKTOP, desktop)
  // `min(A, plateau)` collapses to the plateau when A is flat -- same result,
  // and the shorter form is the one worth reading in the config.
  const ramp = mobile === plateau ? rem(plateau) : `min(${a}, ${rem(plateau)})`
  console.log(`${name}:\n  'clamp(${rem(mobile)}, max(${ramp}, ${c}), ${rem(desktop)})',`)
  const at = CHECK.map((vw) => `${vw}:${resolve({ mobile, a, plateau, c, desktop }, vw).toFixed(2)}`)
  console.log(`  // ${at.join('  ')}\n`)
}
