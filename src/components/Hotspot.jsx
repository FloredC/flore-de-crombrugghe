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
 *
 * Focus ring: no Figma sample exists for a marker-focused state (markers
 * aren't ButtonLink/ButtonAction instances, they're their own thing), so this
 * reuses the same focus-ring token as every other interactive element
 * (FOCUS_CLASS's ring color/width) rather than inventing a new treatment.
 * It's scoped to the visible 18px dot via group-focus-visible, not the 44px
 * button -- a ring drawn around the invisible tap target would look like a
 * ring floating in empty space, disconnected from the marker you can see.
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
        className="group flex items-center justify-center focus-visible:outline-none"
        style={{ width: 44, height: 44 }}
        aria-expanded={isOpen}
        {...getReferenceProps()}
      >
        <span
          data-hotspot-dot
          // The drop-shadow moved from an inline style to this arbitrary
          // shadow-[...] utility. An inline style always wins over any
          // stylesheet rule regardless of specificity, so it was silently
          // overriding the ring below on every render -- the ring's CSS
          // variables were being set correctly (confirmed via
          // getComputedStyle), but the actual box-shadow paint never
          // reflected them. Tailwind's ring and shadow utilities are
          // designed to compose in the same box-shadow property via shared
          // --tw-shadow/--tw-ring-shadow custom properties, so moving both
          // into classes lets them coexist instead of one clobbering the
          // other.
          className="rounded-full border-2 border-white bg-action-accent-foreground shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] group-focus-visible:ring-2 group-focus-visible:ring-focus-ring group-focus-visible:ring-offset-2"
          style={{ width: 18, height: 18 }}
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
