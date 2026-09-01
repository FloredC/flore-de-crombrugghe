/**
 * The Rega helicopter's flight path.
 *
 * THE CURVE IS FLORE'S, TRACED IN FIGMA, NOT FITTED HERE. She drew it in
 * `helicopter animation` (node 5078:5824) as `Vector 3806`, together with four
 * helicopter instances placed along it at the size and angle she wanted. The
 * anchors and control points below are that vector's own path data, verbatim,
 * in its local coordinate space (bbox 1106.1 x 285.637).
 *
 * Everything else in this file is derived from those four poses rather than
 * chosen, and the derivation is worth recording because it settled two
 * questions that had been guesses:
 *
 * ROTATION IS THE PATH TANGENT. Solving each pose's axis-aligned bounding box
 * back into (width, angle) -- the component's natural aspect is 0.5625, so
 * W = w(c + Rs), H = w(s + Rc) -- gives four clean widths and four angles that
 * track the tangent of the curve they sit on:
 *
 *     pose   at      width   path tangent   she drew
 *       1    3%       120       -1.9deg       0.0deg
 *       2    37%      170       37.2deg      32.7deg
 *       3    60%      200        5.7deg      10.0deg
 *       4    93%      220       22.6deg      20.6deg
 *
 * Widths landing on 120/170/200/220 exactly is the check that the solve is
 * right rather than merely plausible. So the aircraft simply points where it is
 * going; there is no separate "bank" parameter to invent.
 *
 * THE GLIDE IS SHALLOW. The curve drops 282 over 1106, a 14.3deg glide. An
 * earlier version of this animation fell at 34.7deg -- nearly two and a half
 * times steeper -- which is what read as "going down too fast".
 *
 * SIGN. The helicopter is drawn NOSE-LEFT, so its forward axis is -x and a dive
 * is a small POSITIVE pitch measured as atan2(dy, -dx). CSS rotate() is
 * clockwise, which LIFTS a left-pointing nose, so the rotation applied is the
 * negative of the pitch. Measuring the heading with the usual atan2(dy, dx)
 * instead puts leftward travel near 180deg and stands the aircraft on its nose;
 * getting this backwards is a real bug this had, and it looks like a climb.
 */

// --- Flore's traced curve, local coordinates ---------------------------------
const A = [
  [1106.07, 3.25218],
  [728.883, 48.9708],
  [511.714, 170.89],
  [211.678, 210.895],
  [0.223607, 285.19],
]
const C = [
  [[922.239, -8.17792], [767.745, 17.7288]],
  [[680.305, 88.0234], [594.581, 155.651]],
  [[428.847, 186.13], [357.41, 179.463]],
  [[65.9464, 242.328], [59.2783, 255.662]],
]

const CURVE_SPAN_X = A[0][0] - A[4][0] // 1105.85
const CURVE_DROP_Y = A[4][1] - A[0][1] // 281.94

/** Her glide as a ratio, so DESCENT below is a multiplier on a real angle. */
export const CURVE_GLIDE = CURVE_DROP_Y / CURVE_SPAN_X // 0.2549 -> 14.3deg

// --- Tunables ----------------------------------------------------------------
// All proportional, none in pixels: the section is fluid and the helicopter has
// to hold its relationship to the card at every width.

/** Horizontal span of the curve, as a fraction of the subsection's width. */
export const SPAN = 0.75

/** Multiplier on her glide angle. 1 is exactly what she drew. */
export const DESCENT = 1

/** Where the aircraft ends up, as a fraction of the Rega card's own box. This
 *  is where she placed the LAST pose's centre, not where the sketch line stops
 *  -- the line is a guide and runs on past it. */
export const LAND_X = 0.25
export const LAND_Y = 0.34

/** Size as a fraction of the Rega card's width. Her four poses extrapolate to
 *  114 and 223 against a 561.8 card, i.e. 20% growing to 40% -- it very nearly
 *  doubles, rather than the 3.6x an earlier pass had. */
export const SIZE_START = 0.2
export const SIZE_END = 0.4

/** 1 = nose exactly along the path, which is what the pose table above says. */
export const TILT = 1

/**
 * 6000, up from 4200 (Flore, 2026-09-01: "a bit slower"). The aircraft covers
 * roughly 1500px of travel, so this is about 250px/s average rather than 360.
 *
 * FADE_START below is a fraction of THIS, so the exit stretches with it rather
 * than staying a fixed 1.2s tail that would get proportionally snappier every
 * time the flight is slowed down.
 */
export const DURATION_MS = 6000

/** Samples taken along the path to build the keyframes. */
export const SAMPLES = 110

/**
 * THE EASING IS BAKED INTO THE SAMPLING, AND THE ANIMATION ITSELF RUNS LINEAR.
 * That is not a stylistic preference, it is the only way the fade is
 * controllable, and it was measured before it was changed.
 *
 * Handing WAAPI an `easing` makes the keyframe offsets *path* progress. Under
 * any deceleration the last sliver of path then occupies most of the clock:
 * with the ease-out this used to carry, the aircraft covered 34% of the route
 * in the first 10% of the time and then spent **55% of the duration inside the
 * final 12% of the path**. Since the fade is defined on that final stretch,
 * over half the animation was a nearly-stationary helicopter dissolving. Every
 * ease-out tested had the same shape of problem -- the mildest still spent 33%
 * there -- because it is inherent to easing the animation rather than the path.
 *
 * Sampling the path at eased positions while leaving the keyframe offsets
 * uniform inverts that: offset == wall-clock, so FADE_START below means what it
 * says, and the aircraft still decelerates into its landing.
 */
const EASE = [0.45, 0.35, 0.5, 1]

/** Fraction of the DURATION at which it starts fading out. Wall-clock, not
 *  distance -- by then the deceleration has it over the card already. */
export const FADE_START = 0.72

/**
 * A CSS cubic-bezier as a plain function, so the same curve can be applied to
 * the sampling rather than to the animation. Newton-Raphson with a bisection
 * fallback, which is what the browsers' own solvers do.
 */
export function cubicBezier([x1, y1, x2, y2]) {
  const ca = (a, b) => 1 - 3 * b + 3 * a
  const cb = (a, b) => 3 * b - 6 * a
  const cc = (a) => 3 * a
  const calc = (t, a, b) => ((ca(a, b) * t + cb(a, b)) * t + cc(a)) * t
  const slope = (t, a, b) => 3 * ca(a, b) * t * t + 2 * cb(a, b) * t + cc(a)

  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2)
      if (s === 0) break
      const err = calc(t, x1, x2) - x
      if (Math.abs(err) < 1e-6) return calc(t, y1, y2)
      t -= err / s
    }
    // Newton can wander outside [0,1] on flat segments; bisect from scratch.
    let lo = 0
    let hi = 1
    t = x
    while (lo < hi) {
      const v = calc(t, x1, x2)
      if (Math.abs(v - x) < 1e-6) break
      if (v < x) lo = t
      else hi = t
      const next = (lo + hi) / 2
      if (Math.abs(next - t) < 1e-9) break
      t = next
    }
    return calc(t, y1, y2)
  }
}

/** Wall-clock fraction in, fraction of the PATH covered out. */
export const ease = cubicBezier(EASE)

// --- Growth ------------------------------------------------------------------
// Her four widths, as arc-length position along the curve against width
// normalised so 0 is the extrapolated size at t=0 and 1 at t=1. Endpoints are
// included so the curve is anchored rather than extrapolating off the ends.
const POSE_T = [0, 0.035, 0.369, 0.597, 0.933, 1]
const POSE_S = [0, 0.0551, 0.5138, 0.7891, 0.9724, 1]

/**
 * Fritsch-Carlson monotone cubic. Monotone specifically: an ordinary spline
 * through these points overshoots between the third and fourth, and a
 * helicopter that briefly shrinks while approaching reads as flying backwards.
 */
function monotone(xs, ys) {
  const n = xs.length
  const d = []
  const m = []
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]))
  m.push(d[0])
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2)
  m.push(d[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i] / d[i]
    const b = m[i + 1] / d[i]
    const h = Math.hypot(a, b)
    if (h > 3) {
      m[i] = ((3 * a) / h) * d[i]
      m[i + 1] = ((3 * b) / h) * d[i]
    }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0]
    if (x >= xs[n - 1]) return ys[n - 1]
    let i = 0
    while (x > xs[i + 1]) i++
    const h = xs[i + 1] - xs[i]
    const t = (x - xs[i]) / h
    const t2 = t * t
    const t3 = t2 * t
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    )
  }
}

/** 0 at the start of the flight, 1 at the end, following her four poses. */
export const growth = monotone(POSE_T, POSE_S)

/**
 * Her curve, scaled and placed so its LAST anchor sits on the landing point.
 *
 * `width` is the box the path is laid out across (the subsection); `card` is
 * the Rega card's box relative to that same origin. Horizontal scale comes from
 * SPAN and vertical scale is the same times DESCENT, so DESCENT = 1 reproduces
 * her glide angle exactly whatever the viewport is doing -- the angle does not
 * drift with the section's aspect ratio the way a normalised 0-1 path would.
 *
 * `leadTo` extends the curve BACKWARDS along its own start tangent to that x,
 * so the aircraft flies in from off-screen instead of appearing mid-air. The
 * lead-in is a straight line rather than another cubic: extending a bezier
 * backwards is tangent-continuous only if it stays straight, and a level
 * cruise-in is what reads as an approach anyway.
 */
export function buildFlightPath({ width, card, leadTo }) {
  const sx = (width * SPAN) / CURVE_SPAN_X
  const sy = sx * DESCENT
  const endX = card.x + card.width * LAND_X
  const endY = card.y + card.height * LAND_Y
  const map = (p) => [endX + (p[0] - A[4][0]) * sx, endY + (p[1] - A[4][1]) * sy]

  const start = map(A[0])
  let d = ''

  if (leadTo != null) {
    const dir = [A[0][0] - C[0][0][0], A[0][1] - C[0][0][1]]
    const dpx = [dir[0] * sx, dir[1] * sy]
    if (dpx[0] > 0.001) {
      const k = (leadTo - start[0]) / dpx[0]
      if (k > 0) {
        d += `M${(start[0] + dpx[0] * k).toFixed(2)} ${(start[1] + dpx[1] * k).toFixed(2)} L`
      }
    }
  }
  d += (d ? '' : 'M') + `${start[0].toFixed(2)} ${start[1].toFixed(2)}`

  for (let i = 0; i < 4; i++) {
    const c1 = map(C[i][0])
    const c2 = map(C[i][1])
    const a = map(A[i + 1])
    d +=
      ` C${c1[0].toFixed(2)} ${c1[1].toFixed(2)}` +
      ` ${c2[0].toFixed(2)} ${c2[1].toFixed(2)}` +
      ` ${a[0].toFixed(2)} ${a[1].toFixed(2)}`
  }
  return d
}
