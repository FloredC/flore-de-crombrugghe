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

/** Horizontal span of the curve, as a fraction of the subsection's width.
 *  Only used as the FALLBACK now -- see FLYBY below. */
export const SPAN = 0.75

/** Multiplier on her glide angle. 1 is exactly what she drew. Fallback only. */
export const DESCENT = 1

/**
 * WHERE IT PASSES REGA, as a multiple of the avatar's own width, measured from
 * her centre. Positive y is below her.
 *
 * THIS EXISTS BECAUSE THE AVATAR WAS NEVER AN ANCHOR. Sizing the curve from
 * SPAN x glide made its height a function of the section's width, and the
 * avatar's position is not: below 1024 the wayfinding row wraps and she moves
 * up and left while the curve gets shorter. Measured closest approach was
 *
 *     1440   70px   0.59 avatar-widths   at 40% along
 *     1024   47px   0.44                 at 50%
 *      900  169px   1.76                 at 67%
 *      768  324px   3.38                 at  0%   <- the FIRST frame
 *
 * At 768 the aircraft's nearest point to her was where it started: it flew away
 * from her for the whole flight, and the gust therefore fired before she had
 * been approached at all.
 *
 * 0.6 reproduces what desktop already did (0.59), so the widths that were right
 * do not move.
 */
export const FLYBY_X = 0
export const FLYBY_Y = 0.6

/**
 * Below this the solved curve is too compressed to read as flight at all -- the
 * horizontal span would be `MIN_SOLVED_SCALE * 1106` px. 0.15 puts the floor at
 * about 166px of travel, which is already less than the aircraft is wide; the
 * point is to reject the degenerate cases, not to find a pleasing minimum.
 */
const MIN_SOLVED_SCALE = 0.15

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
 * THE FLARE. Fraction of the duration at which the aircraft stops following the
 * path angle and levels out, reaching horizontal by FADE_START.
 *
 * Following the tangent all the way to the end left it nose-down about 27deg at
 * the moment it settled on the card, which reads as an aircraft about to crash
 * rather than one arriving (Flore, 2026-09-01). A real helicopter does the same
 * thing for the same reason: it flares out of the descent before touching down.
 *
 * It levels by the time the fade begins rather than by the end of the flight,
 * so the last thing you see clearly is a level aircraft -- finishing the flare
 * during the fade would hide the very moment being corrected.
 *
 * Smoothstepped, not linear: the tangent is still steepening when the flare
 * starts, so a linear blend puts a visible kink in the rotation exactly where
 * the eye is already following it.
 */
export const FLARE_START = 0.5

/**
 * CEILING ON THE DIVE, in degrees.
 *
 * The flare fixed the ending; measuring it showed the MIDDLE had the same
 * problem at narrow widths. The two-anchor solve stretches the curve vertically
 * when there is little horizontal room but Rega still sits well above the card,
 * so the steepest tangent ran away with the viewport:
 *
 *     1440   -36deg      768   -60deg      640   -72deg
 *
 * At -72deg the aircraft is essentially vertical. Clamping the ANGLE rather
 * than flattening the path keeps it arriving where it should while still
 * looking like an aircraft -- and a helicopter really can descend steeply
 * without pitching to match, which is not true of a fixed-wing.
 *
 * 40 is above the -36 that desktop already reached, so the widths Flore has
 * already signed off do not move; this only bites where the solve went extreme.
 */
export const MAX_PITCH_DEG = 40

/**
 * The aircraft's CSS rotation for a path pitch at wall-clock `t`: clamped, then
 * flared out to level, then negated.
 *
 * The negation lives here rather than at the call site because it is the one
 * piece of this that is easy to get backwards -- nose-left means CSS rotate()
 * lifts the nose, so a dive is a NEGATIVE rotation. An earlier version had the
 * aircraft climbing while it descended for exactly this reason.
 */
export function craftRotation(pitch, t) {
  const clamped = Math.max(-MAX_PITCH_DEG, Math.min(MAX_PITCH_DEG, pitch))
  return -clamped * flare(t)
}

/** 1 while it follows the path, easing to 0 (level) between the two marks. */
function flare(t) {
  const span = FADE_START - FLARE_START
  if (t <= FLARE_START) return TILT
  if (span <= 0) return 0
  const k = Math.min(1, (t - FLARE_START) / span)
  return TILT * (1 - k * k * (3 - 2 * k)) // smoothstep
}

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
export function buildFlightPath({ width, card, leadTo, flyby }) {
  const endX = card.x + card.width * LAND_X
  const endY = card.y + card.height * LAND_Y

  // TWO ANCHORS, SOLVED -- not one anchor and a guessed length.
  //
  // The end is pinned to the card. Pinning A[1] as well (the interior anchor
  // where Flore drew the aircraft beside Rega) leaves exactly two unknowns, the
  // horizontal and vertical scales, and two equations. So it is solved, not
  // fitted:
  //
  //     X = endX + (A1x - A4x) * sx   ->   sx = (flyby.x - endX) / (A1x - A4x)
  //     Y = endY + (A1y - A4y) * sy   ->   sy = (flyby.y - endY) / (A1y - A4y)
  //
  // The curve then reaches her AND lands on the card at every width, instead of
  // reaching her only where the section happened to be wide enough.
  //
  // The cost is that the glide angle is no longer exactly the 14.3deg she drew
  // -- it now stretches to connect two real points. That is the right trade:
  // passing her and landing on the card are the things the animation is ABOUT,
  // and the angle is how it gets between them.
  let sx = (width * SPAN) / CURVE_SPAN_X
  let sy = sx * DESCENT

  if (flyby) {
    const nx = (flyby.x - endX) / (A[1][0] - A[4][0])
    const ny = (flyby.y - endY) / (A[1][1] - A[4][1])
    // NO ROOM MEANS NO FLIGHT -- returning null rather than falling back.
    //
    // As the viewport narrows the Guide wraps and Rega slides left, while the
    // card goes full-width and drags its landing point left too. The horizontal
    // gap between them closes continuously, so there is no breakpoint to pick:
    //
    //     600px   gap  58px    520px   gap   3px
    //     560px   gap  30px    375px   gap -38px   (she is PAST the landing)
    //
    // At 375 the usable gap is 41px, so the entire flight would be shorter than
    // the 137px aircraft flying it. There is nothing to tune. Falling back to
    // the fixed geometry is worse than not flying: it produced a helicopter
    // that passed 2.6 avatar-widths away and never reacted with her, which
    // reads as broken rather than as absent. The caller treats null as "leave
    // this to the avatar's own reaction".
    if (!(nx > MIN_SOLVED_SCALE && ny > MIN_SOLVED_SCALE) || !Number.isFinite(nx) || !Number.isFinite(ny)) {
      return null
    }
    sx = nx
    sy = ny
  }
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
