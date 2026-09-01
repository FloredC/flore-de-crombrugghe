import { useCallback, useEffect, useRef } from 'react'
import Helicopter from './Helicopter'
import {
  buildFlightPath,
  growth,
  SIZE_START,
  SIZE_END,
  TILT,
  FADE_START,
  DURATION_MS,
  SAMPLES,
  ease,
} from '../lib/flightPath'

/**
 * The helicopter arriving over the Harbour -- Client work at scale row: in from
 * off-screen top right, down Flore's traced curve, growing as it comes, and
 * fading out on the Rega card. See src/lib/flightPath.js for where the curve
 * and every number in it came from.
 *
 * IT FLIES IN FRONT OF THE CONTENT, deliberately (Flore, 2026-09-01). An
 * earlier version passed behind the row, which cannot work for an arrival that
 * has to land ON a card. Hence the z-index here and `pointer-events: none` so
 * a full-bleed overlay sitting on top of the grid cannot eat a card's clicks.
 *
 * WHY THE OVERLAY IS MEASURED RATHER THAN LAID OUT. The path is defined against
 * the subsection's box and the Rega card's box, both read at run time. Anchoring
 * the landing to `#project-rega` rather than to a percentage of the section
 * means the aircraft still lands on the card when the grid reflows, the card
 * changes size, or a fourth project is added to the row.
 *
 * WHY WAAPI AND NOT CSS. The keyframes are generated from the measured geometry
 * -- 110 samples of a path whose shape depends on the card's position -- so they
 * cannot be written as static CSS the way the rotors and the avatars can. The
 * rotors themselves ARE CSS, because they are fixed.
 */

// ---------------------------------------------------------------------------
// REVIEW LOOP -- TURN THIS OFF BEFORE SHIPPING.
//
// Repeats the flight while the row is on screen so the motion can be watched
// without scrolling away and back. Same shape, and the same reasoning, as the
// flag that used to live in AvatarRega: the shipped behaviour is once-on-entry,
// and flipping this to `false` restores it exactly.
//
// Dev-gated as well as flag-gated, so even left on it cannot reach production.
const DEV_LOOP_FOR_REVIEW = import.meta.env.DEV && true

/** Quiet pause between repeats, so one cycle is the flight plus this. */
const DEV_LOOP_GAP_MS = 1400

/** Everything buildFlightPath() reads, rounded, as one comparable string. */
const geometryKey = (hostBox, cardRel) =>
  [hostBox.width, cardRel.x, cardRel.y, cardRel.width, cardRel.height]
    .map((n) => Math.round(n))
    .join('/')

export default function RegaFlypast({ onPassAvatar }) {
  const hostRef = useRef(null)
  const heliRef = useRef(null)
  const flight = useRef(null)
  const raf = useRef(null)
  const loop = useRef(null)
  const firedOnce = useRef(false)
  // The geometry the current keyframes were built against, so a rebuild can be
  // driven by "did the thing I measured actually change" rather than by
  // counting observer callbacks.
  const builtFor = useRef(null)

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current)
    raf.current = null
    if (flight.current) {
      flight.current.cancel()
      flight.current = null
    }
  }, [])

  // `park` rebuilds the flight and jumps straight to its final frame, without
  // replaying it. That is the answer to a card that changes size WHILE the
  // aircraft is in the air: rebuilding mid-flight would restart the animation,
  // but dropping the change leaves it parked against a stale box -- measured at
  // 12px, when the thumbnail decoded during the flight and grew the card under
  // it. So the change is applied at the end, silently.
  const fly = useCallback((park = false) => {
    const host = hostRef.current
    const heli = heliRef.current
    const card = document.getElementById('project-rega')
    if (!host || !heli || !card) return

    stop()

    const hostBox = host.getBoundingClientRect()
    const cardBox = card.getBoundingClientRect()
    if (!hostBox.width || !cardBox.width) return

    const cardRel = {
      x: cardBox.left - hostBox.left,
      y: cardBox.top - hostBox.top,
      width: cardBox.width,
      height: cardBox.height,
    }
    builtFor.current = geometryKey(hostBox, cardRel)

    const wEnd = cardBox.width * SIZE_END
    const wStart = cardBox.width * SIZE_START
    heli.style.setProperty('--heli-width', `${wEnd}px`)

    // Fly in from beyond the VIEWPORT's right edge, not the subsection's: the
    // section is capped at the container width, so stopping the lead-in there
    // would pop the aircraft into existence inside the page margin. The section
    // clips this horizontally (see .heli-flypast-host in globals.css), so
    // starting off-screen cannot add a horizontal scrollbar.
    const leadTo = window.innerWidth - hostBox.left + wEnd

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', buildFlightPath({ width: hostBox.width, card: cardRel, leadTo }))
    const len = path.getTotalLength()
    if (!len) return

    // Where along the flight it passes closest to the avatar -- measured, not
    // guessed at, so the gust stays in step if the row's layout changes.
    const avatar = host.parentElement?.querySelector('[data-component="avatar-rega"]')
    let passAt = null
    let best = Infinity

    const frames = []
    for (let i = 0; i <= SAMPLES; i++) {
      // `t` is WALL-CLOCK (it becomes the keyframe offset); `d` is how far
      // along the path that instant is. Easing the sampling rather than the
      // animation is what makes FADE_START mean a fraction of the duration --
      // see the long note in lib/flightPath.js.
      const t = i / SAMPLES
      const d = ease(t)
      const pt = path.getPointAtLength(len * d)

      // Centred difference. A pure lookahead collapses to zero length on the
      // last sample, where atan2(0, -0) returns 180deg and snaps the aircraft
      // round on its final frame.
      const ahead = len * d + 2 <= len
      const next = ahead ? path.getPointAtLength(len * d + 2) : pt
      const prev = ahead ? pt : path.getPointAtLength(Math.max(0, len * d - 2))

      // Nose-left, so forward is -x and CSS rotation is the negative of the
      // pitch. See the SIGN note in lib/flightPath.js.
      const pitch = (Math.atan2(next.y - prev.y, -(next.x - prev.x)) * 180) / Math.PI
      const w = wStart + (wEnd - wStart) * growth(d)
      const opacity = t < FADE_START ? 1 : Math.max(0, 1 - (t - FADE_START) / (1 - FADE_START))

      frames.push({
        offset: t,
        // The box is wEnd wide and 0.5625 of that tall, so half its height is
        // 0.28125 of the width -- this puts the aircraft's CENTRE on the path.
        transform:
          `translate(${(pt.x - wEnd / 2).toFixed(1)}px, ${(pt.y - wEnd * 0.28125).toFixed(1)}px) ` +
          `scale(${(w / wEnd).toFixed(4)}) rotate(${(-pitch * TILT).toFixed(2)}deg)`,
        opacity: opacity.toFixed(3),
      })

      if (avatar) {
        const ab = avatar.getBoundingClientRect()
        const ax = ab.left - hostBox.left + ab.width / 2
        const ay = ab.top - hostBox.top + ab.height / 2
        const dist = Math.hypot(pt.x - ax, pt.y - ay)
        if (dist < best) {
          best = dist
          passAt = t
        }
      }
    }

    // linear ON PURPOSE -- the deceleration is already in the sampling above.
    flight.current = heli.animate(frames, {
      duration: DURATION_MS,
      easing: 'linear',
      fill: 'forwards',
    })

    if (park) {
      flight.current.finish()
      return
    }

    // FIRE THE GUST OFF THE ANIMATION'S OWN PROGRESS rather than a setTimeout.
    // `passAt` is wall-clock (see the sampling loop), and so is `progress` now
    // that the effect runs linear, so the two are directly comparable -- but
    // reading the animation still beats a timer, because it cannot drift from a
    // flight that was cancelled, restarted by the review loop, or rebuilt by a
    // resize. It also survives any later change to the easing: back when the
    // curve was on the effect, duration * passAt landed 1.4s after she had
    // actually been passed.
    if (onPassAvatar && passAt != null) {
      let fired = false
      const watch = () => {
        const a = flight.current
        if (!a) return
        const p = a.effect.getComputedTiming().progress
        if (!fired && p != null && p >= passAt) {
          fired = true
          onPassAvatar()
          return
        }
        if (a.playState === 'running') raf.current = requestAnimationFrame(watch)
      }
      raf.current = requestAnimationFrame(watch)
    }
  }, [onPassAvatar, stop])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    // Reduced motion: no flight at all, and the aircraft is never painted (see
    // the render below), so there is nothing parked over the card either.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (DEV_LOOP_FOR_REVIEW) {
          if (entry.isIntersecting) {
            if (loop.current) return
            fly()
            loop.current = setInterval(fly, DURATION_MS + DEV_LOOP_GAP_MS)
          } else {
            clearInterval(loop.current)
            loop.current = null
            stop()
          }
          return
        }
        if (!entry.isIntersecting || firedOnce.current) return
        firedOnce.current = true
        fly()
        io.disconnect()
      },
      { rootMargin: '0px 0px -20% 0px' }
    )
    io.observe(host)

    // The path is measured against the CARD, so anything that moves the card
    // invalidates it -- and a window `resize` listener does not see most of
    // that. The card is a grid item whose height follows its thumbnail, so it
    // grows when that image decodes, with no resize event at all: measured
    // here, the landing drifted from 34% to 28% down the card between two runs
    // for exactly that reason. A ResizeObserver watches the thing that actually
    // changed, which is the same call this codebase's PanZoomContainer makes.
    //
    // Rebuilding mid-flight would restart the animation on every observed
    // frame, so this only re-runs once the aircraft is parked.
    const ro = new ResizeObserver(() => {
      // Keyed on the measurement itself, not on how many callbacks have
      // arrived. ResizeObserver delivers an initial callback on observe(), and
      // batching across two observed elements is not something to depend on --
      // comparing the geometry makes both moot.
      if (!firedOnce.current && !DEV_LOOP_FOR_REVIEW) return
      const inAir = flight.current && flight.current.playState === 'running'
      const cardNow = document.getElementById('project-rega')
      if (!cardNow) return
      const hb = host.getBoundingClientRect()
      const cb = cardNow.getBoundingClientRect()
      const key = geometryKey(hb, {
        x: cb.left - hb.left,
        y: cb.top - hb.top,
        width: cb.width,
        height: cb.height,
      })
      if (key === builtFor.current) return
      if (inAir) {
        // Re-park once it lands, rather than restarting it under the viewer.
        const settling = flight.current
        settling.addEventListener('finish', () => {
          if (flight.current === settling) fly(true)
        }, { once: true })
        return
      }
      fly()
    })
    ro.observe(host)
    const cardEl = document.getElementById('project-rega')
    if (cardEl) ro.observe(cardEl)

    return () => {
      io.disconnect()
      ro.disconnect()
      clearInterval(loop.current)
      loop.current = null
      stop()
    }
  }, [fly, stop])

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div ref={hostRef} data-component="rega-flypast" className="heli-flypast-host" aria-hidden="true">
      {!reduced && (
        <div ref={heliRef} className="heli-flypast-craft">
          <Helicopter className="heli-flypast-svg" />
        </div>
      )}
    </div>
  )
}
