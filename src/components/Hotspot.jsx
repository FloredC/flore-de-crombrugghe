import { useState, useRef } from 'react'
import Popover from './Popover'

/**
 * Skeleton stage: click-to-toggle only. Hover-opens/keyboard-focus/bridged hit
 * area/dismissal rules land in the Popover interaction stage (@floating-ui/react).
 * Marker hit target is fixed 44x44px per WCAG 2.2 / Apple HIG, independent of the
 * 18px visual dot and of illustration scale — implemented as button padding, not a
 * scaled-up dot. Dot fill is a plain neutral placeholder — real marker styling
 * (accent-orange token, hover highlight swap) lands in the Styling/Hotspot-wiring
 * stages, this is just enough to be visibly clickable right now.
 */
export default function Hotspot({ hotspot }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  return (
    <div
      ref={wrapperRef}
      data-component="hotspot"
      data-hotspot-id={hotspot.id}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    >
      <button
        type="button"
        data-hotspot-marker
        className="flex items-center justify-center"
        style={{ width: 44, height: 44 }}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span data-hotspot-dot className="rounded-full bg-gray-900" style={{ width: 18, height: 18 }} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-10 -translate-x-1/2 pt-2">
          <Popover hotspot={hotspot} />
        </div>
      )}
    </div>
  )
}
