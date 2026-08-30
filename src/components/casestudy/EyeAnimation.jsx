import { useEffect, useRef, useState } from 'react'

/**
 * The blinking eye on the pipeline's pass-interaction cards — Flore's Lottie,
 * 2026-08-30 ("a subtle eye animation on the pass cards").
 *
 * THE INTERACTION IS THE FILE'S OWN. The export is not one loop, it is three
 * named segments, and their names say what they are for:
 *
 *     Eye_AnimOn     frames   0- 30   the eye opens
 *     Eye_Blinks     frames  30-200   open, blinking, pupil moving
 *     Eye_AnimOff    frames 200-232   the eye closes
 *
 * So the animation was authored as a hover state, not as an ambient loop, and
 * this plays it that way: closed at rest, opens and blinks while the card is
 * hovered or focused, closes when you leave. Nothing about that sequencing is
 * invented here — it is read off the segments.
 *
 * ONE EDIT TO THE ASSET, and it is worth naming rather than leaving to be
 * discovered: the export carried a fourth layer, `BG`, an opaque WHITE 800x800
 * rectangle spanning the whole timeline. That is a preview backdrop from
 * LottieFiles; on a card it would render the eye as a white square. The copy in
 * `src/assets/animations/eye.json` has that layer and its comp removed and
 * nothing else changed (33,499 -> 32,295 bytes). Re-exporting overwrites this,
 * so drop the layer again — or turn it off in the export.
 *
 * WHY IT LOADS LATE, and why that answers the bundle question. `lottie-web` is
 * ~168KB minified even in the light build, against a main bundle of ~477KB —
 * too much to spend up front on a decorative eye. It is behind a dynamic
 * `import()` fired by an IntersectionObserver, so Vite splits it into its own
 * chunk and NOTHING is downloaded until the pipeline section actually scrolls
 * into view. A reader who never reaches that chapter, or who is on any other
 * page, pays zero.
 *
 * The light build specifically: this file uses shape layers and track mattes
 * only — no expressions, no text, no images — which is exactly the subset
 * `lottie_light` keeps.
 *
 * REDUCED MOTION gets the still frame and no player at all: the import never
 * fires, so those readers do not even download it. The eye still renders,
 * because `poster` below draws the resting frame as plain SVG.
 */

// Frame numbers from the export's own layer boundaries (60fps).
const OPEN = [0, 30]
const BLINK = [30, 200]
// 231, not the segment's nominal 232: the closing comp's last layer ends AT 232,
// so that frame renders nothing at all. Playing to it left a one-frame blank
// before `complete` fired and reset to REST. Measured, not theorised -- frames
// 4/30/120 all draw a 15.3px-wide eye and 232 draws none.
const CLOSE = [200, 231]
// The resting frame. NOT 0: the opening comp's own layers start at frame 3, so
// frames 0-2 render nothing at all and the eye would flash empty. 4 is the first
// frame that draws the closed lid.
const REST = 4

// THE CROP, and it is the reason the eye looked like a speck rather than a
// sizing mistake -- Flore, 2026-08-30: "it's so small that I can't see it."
//
// The export's canvas is 800x800, but the artwork is a 150x150 precomp placed
// at its centre, and the eye only fills part of THAT. Measured against a 100px
// box: at the default viewBox the drawn eye is 13% wide and 9% tall. At the
// badge's 20px that is a 2.6 x 1.7px mark -- the dot in her screenshot. Making
// the container bigger could not have fixed it; 94% of the box was empty and
// scaling empty space scales nothing.
//
// So the viewBox is cropped to the artwork's own bounds instead. Same numbers,
// same box: 96% wide, 65% tall. The eye is now ~5x larger at any given size.
//
// Derived, not eyeballed: the layer sits at p=[400,400] with anchor [75,75], so
// the precomp's origin is 325,325; the open eyelid spans +-50.7 x and +-35.3 y
// about [75,76.07] within it, plus a 5-unit stroke. That is 347,348 and 106
// square. `getBoundingClientRect` confirms it lands inside the box with no
// clipping.
const VIEW_BOX = '347 348 106 106'

// PLAYBACK SPEED -- Flore, 2026-08-30: "make the animations of the eye slower
// (it's a bit quick now)."
//
// A multiplier on the export's own 60fps rather than an edit to the file, so
// the timing stays hers and this stays one number to turn. At 0.6:
//
//                    at 60fps    at 0.6
//   open   0- 30       0.50s      0.83s
//   blink 30-200       2.83s      4.72s   (loops while hovered)
//   close 200-231      0.52s      0.86s
//
// Lower is slower. Set once at load: `playSegments` does not reset it, so every
// segment inherits the same rate and the three cannot drift apart.
const SPEED = 0.6

export default function EyeAnimation({ active, size = 16, className = '' }) {
  const hostRef = useRef(null)
  const animRef = useRef(null)
  const [ready, setReady] = useState(false)

  // Load and initialise when the card comes into view -- not on mount, so the
  // player's chunk is not fetched for a page section the reader may never
  // reach.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let cancelled = false
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        // The `esm/` build, and the path matters: `build/player/lottie_light.js`
        // is a UMD bundle. Rollup's CommonJS interop gives it a default export
        // at build time, so `vite build` succeeded and chunked it -- but Vite's
        // dev server serves that path as a raw ES module, where it exports
        // NOTHING and only assigns `window.lottie`. The result was a silent
        // unhandled rejection on `.default.loadAnimation`, in dev only, with a
        // clean production build. Caught in the browser, not the build.
        //
        // `esm/lottie_light.min.js` ends in `export { lottie as default }`, so
        // it behaves identically in both.
        const lottie = (await import('lottie-web/build/player/esm/lottie_light.min.js')).default
        if (cancelled) return
        animRef.current = lottie.loadAnimation({
          container: host,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: (await import('../../assets/animations/eye.json')).default,
          rendererSettings: { viewBoxSize: VIEW_BOX },
        })
        animRef.current.setSpeed(SPEED)
        animRef.current.goToAndStop(REST, true)
        setReady(true)
      },
      { rootMargin: '200px' },
    )
    observer.observe(host)

    return () => {
      cancelled = true
      observer.disconnect()
      animRef.current?.destroy()
      animRef.current = null
    }
  }, [])

  // Open-and-blink while active, close when it ends.
  //
  // The blink loop is queued from the OPEN segment's completion rather than
  // played as one long segment, because only the middle third should repeat --
  // looping the whole thing would re-open an eye that is already open every
  // 3.9 seconds.
  useEffect(() => {
    const anim = animRef.current
    if (!anim || !ready) return undefined

    const onComplete = () => {
      if (!animRef.current) return
      if (active) {
        animRef.current.loop = true
        animRef.current.playSegments(BLINK, true)
      } else {
        animRef.current.goToAndStop(REST, true)
      }
    }

    anim.addEventListener('complete', onComplete)
    anim.loop = false
    anim.playSegments(active ? [OPEN] : [CLOSE], true)

    return () => anim.removeEventListener('complete', onComplete)
  }, [active, ready])

  return (
    <span
      ref={hostRef}
      aria-hidden="true"
      // The eye says "there is something to look at here" -- it is the badge's
      // glyph, and the badge's words carry the meaning. Decorative by
      // construction, so it is hidden from assistive tech rather than given a
      // label that would duplicate the text beside it.
      className={`block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* THE RESTING FRAME, as plain markup. It is what shows before the player
          loads, and the only thing that ever shows under reduced motion -- so
          the badge never has a hole in it where the eye should be, on a slow
          connection or otherwise. Lottie replaces the contents of this span
          once it initialises.

          Drawn from the export's own closed-lid path (the four-point lens
          flattened) and `currentColor`, so it takes the badge's colour where
          the Lottie's own art is baked black.

          ITS viewBox IS THE PLAYER'S CROP, shifted into the precomp's own frame
          (the 325 origin subtracted) -- so the placeholder and the real thing
          are the same size and nothing jumps when Lottie takes over. */}
      {!ready && (
        <svg viewBox="22 23 106 106" width={size} height={size} fill="none" aria-hidden="true">
          <path
            d="M24.3 76.1c0 0 22.7-15.3 50.7-15.3s50.7 15.3 50.7 15.3"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  )
}
