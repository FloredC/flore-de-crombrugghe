import { useState, useRef } from 'react'
import Popover from './Popover'

/**
 * Skeleton stage: click-to-toggle only. Hover-opens/keyboard-focus/bridged hit
 * area/dismissal rules land in the Popover interaction stage (@floating-ui/react).
 * Marker hit target is fixed 44x44px per WCAG 2.2 / Apple HIG, independent of the
 * 18px visual dot and of illustration scale — implemented as button padding, not a
 * scaled-up dot.
 */
export default function Hotspot({ hotspot }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  return (
    <div
      ref={wrapperRef}
      data-component="hotspot"
      data-hotspot-id={hotspot.id}
      style={{ position: 'absolute', left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    >
      <button
        type="button"
        data-hotspot-marker
        style={{ width: 44, height: 44 }}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span data-hotspot-dot style={{ width: 18, height: 18 }} />
      </button>
      {open && <Popover hotspot={hotspot} />}
    </div>
  )
}
