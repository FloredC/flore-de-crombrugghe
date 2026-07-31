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
 * The marker sits beside its illustrated hotspot (offset via markerSide), not
 * centered on top of it -- centering directly on it occludes the illustration.
 */
const MARKER_OFFSET_PX = 26

export default function Hotspot({ hotspot, isOpen, onOpenChange }) {
  const side = hotspot.markerSide === 'left' ? 'left' : 'right'
  const sideSign = side === 'left' ? -1 : 1
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
      data-marker-side={side}
      className="absolute"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: `translate(calc(-50% + ${sideSign * MARKER_OFFSET_PX}px), -50%)`,
      }}
    >
      <button
        ref={refs.setReference}
        type="button"
        data-hotspot-marker
        className="flex items-center justify-center"
        style={{ width: 44, height: 44 }}
        aria-expanded={isOpen}
        {...getReferenceProps()}
      >
        <span
          data-hotspot-dot
          className="rounded-full border-2 border-white bg-action-accent-foreground"
          style={{ width: 18, height: 18, boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.25)' }}
        />
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
