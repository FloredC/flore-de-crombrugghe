import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

// True on phones/tablets (touch as the primary input). A touchscreen laptop
// with a trackpad reports `fine` and is treated as desktop -- acceptable,
// since the gesture clash this guards against is a touch-primary problem.
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)')
    const update = () => setCoarse(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return coarse
}

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
 * `panning` is disabled outright on touch-primary devices. The library
 * binds mousedown/mousemove to *window* and only checks that the target is
 * inside the wrapper -- so the compatibility mouse events every mobile
 * browser synthesises after a one-finger tap/swipe were driving a real pan,
 * jerking the map under the finger (Flore: "weird page movement when I do a
 * one-finger touch or swipe", in both Safari and Chrome). Disabling panning
 * stops that at the source: `isPanningAllowed` gates both the mouse path and
 * the one-finger touch path, and it bails *before* the library's
 * preventDefault, so native page scroll is left fully intact. Two-finger pan
 * is unaffected -- it runs through the pinch path, whose guard checks only
 * `pinch.disabled` -- so mobile keeps two-finger pan and desktop keeps
 * mouse-drag pan.
 *
 * `wheel` is disabled for a similar reason: the library's wheel handler is a
 * zoom gesture and calls preventDefault unconditionally, before checking
 * whether scale would even change -- so with zoom locked at 1 it silently
 * swallowed every mouse-wheel scroll over the map on desktop.
 *
 * Re-centering is driven by a ResizeObserver on this container rather than a
 * window resize listener, and calls centerView imperatively rather than
 * remounting. A window listener fires on mobile URL-bar collapse (which
 * changes innerHeight without changing this box's size), which was
 * re-centering the map mid-scroll and reading as random jumps.
 */
export default function PanZoomContainer({ enabled, children }) {
  const containerRef = useRef(null)
  const transformRef = useRef(null)
  const coarsePointer = useCoarsePointer()

  useEffect(() => {
    if (!enabled) return undefined
    const node = containerRef.current
    if (!node) return undefined
    let lastSize = null
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const size = `${Math.round(width)}x${Math.round(height)}`
      // First callback is the initial measurement -- centerOnInit already
      // handled that one, so only react to genuine size *changes*.
      if (lastSize === null || size === lastSize) {
        lastSize = size
        return
      }
      lastSize = size
      transformRef.current?.centerView(1, 0)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled])

  return (
    <div ref={containerRef} className={enabled ? 'h-full w-full' : 'w-full'}>
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={1}
        maxScale={1}
        disabled={!enabled}
        centerOnInit
        limitToBounds
        panning={{ velocityDisabled: true, disabled: coarsePointer }}
        wheel={{ disabled: true }}
      >
        <TransformComponent wrapperClass={enabled ? '!w-full !h-full' : '!w-full'}>{children}</TransformComponent>
      </TransformWrapper>
    </div>
  )
}
