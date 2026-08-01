import { useEffect, useRef } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

/**
 * Overflow-triggered per PRD: pan only activates when the illustration's
 * natural size exceeds its container -- the map itself never scales down to
 * fit (per Flore: "the map stays that size but gets viewport crops"). Pan
 * only, no zoom (minScale=maxScale=1) -- deliberately deferred per Flore,
 * who's hoping to avoid needing a zoom control at all. centerOnInit gives
 * the "center it first" initial crop. limitToBounds constrains panning to
 * the map's own edges, not free/infinite drag.
 *
 * When disabled, the wrapper must not force any sizing of its own -- the
 * map's height in that mode comes from the image's natural aspect ratio at
 * w-full, and forcing e.g. h-full here (with no defined ancestor height)
 * would collapse it to zero. Fixed-size cropping is handled by the parent
 * (a fixed-height, overflow-hidden div in Hero) when enabled, not by this
 * component stretching to fill it.
 *
 * Single-finger touch is deliberately left alone (see the capture-phase
 * listener below) so it always falls through to native page scroll --
 * react-zoom-pan-pinch treats a one-finger touch-drag as "pan" and calls
 * preventDefault on it, which on mobile traps the page-scroll gesture
 * inside the map (Flore: "clash between the map's pan behaviour and the
 * scroll function"). Two-finger touch already pans for free through the
 * library's own pinch handler -- it computes pan from the touch-center
 * delta independent of scale, so it still works with zoom locked at 1 -- so
 * blocking only the single-finger case gets two-finger-pan-on-mobile /
 * drag-to-pan-on-desktop without reimplementing panning by hand.
 */
export default function PanZoomContainer({ enabled, children }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    const node = containerRef.current
    if (!node) return undefined
    const blockSingleFingerPan = (event) => {
      if (event.touches.length === 1) event.stopPropagation()
    }
    // Capture phase: must run before react-zoom-pan-pinch's own touchstart
    // listener on its (descendant) wrapper element, so stopping it here
    // keeps that listener from ever seeing a single-finger touchstart.
    node.addEventListener('touchstart', blockSingleFingerPan, { capture: true })
    return () => node.removeEventListener('touchstart', blockSingleFingerPan, { capture: true })
  }, [enabled])

  return (
    <div ref={containerRef} className={enabled ? 'h-full w-full' : 'w-full'}>
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={1}
        disabled={!enabled}
        centerOnInit
        limitToBounds
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent wrapperClass={enabled ? '!w-full !h-full' : '!w-full'}>{children}</TransformComponent>
      </TransformWrapper>
    </div>
  )
}
