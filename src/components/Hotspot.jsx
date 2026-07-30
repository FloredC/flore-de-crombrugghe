import {
  useFloating,
  useHover,
  useClick,
  useDismiss,
  useInteractions,
  useTransitionStyles,
  offset,
  flip,
  shift,
  safePolygon,
  autoUpdate,
  FloatingPortal,
} from '@floating-ui/react'
import Popover from './Popover'

/**
 * Desktop: hover opens directly (bridged hit area via safePolygon, so moving
 * toward the popover doesn't close it), keyboard Enter/Space on the marker
 * opens it (native <button> activation fires a click event, which useClick
 * picks up — no separate "focus opens" handler needed per the PRD's two-step
 * spec: Tab focuses, Enter/Space opens).
 * Mobile: tap opens/closes (same useClick, toggle mode).
 * Dismiss: Escape, outside-click, or moving off marker/popover (hover only).
 * Only one popover open at a time — open state is lifted to Hero.
 * Marker hit target is fixed 44x44px per WCAG 2.2 / Apple HIG, independent of
 * the 18px visual dot and of illustration scale.
 */
export default function Hotspot({ hotspot, isOpen, onOpenChange }) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange,
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
  })

  const hover = useHover(context, { handleClose: safePolygon(), move: false })
  const click = useClick(context)
  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, dismiss])

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 120,
  })

  return (
    <div
      data-component="hotspot"
      data-hotspot-id={hotspot.id}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    >
      <button
        ref={refs.setReference}
        type="button"
        data-hotspot-marker
        className="flex items-center justify-center"
        style={{ width: 44, height: 44 }}
        {...getReferenceProps()}
      >
        <span data-hotspot-dot className="rounded-full bg-gray-900" style={{ width: 18, height: 18 }} />
      </button>
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...transitionStyles, zIndex: 20 }}
            {...getFloatingProps()}
          >
            <Popover hotspot={hotspot} />
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}
