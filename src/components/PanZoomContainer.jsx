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
 */
export default function PanZoomContainer({ enabled, children }) {
  return (
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
  )
}
