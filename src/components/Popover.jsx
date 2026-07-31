import ButtonLink from './ButtonLink'
import CopyButton from './CopyButton'
import { ArrowDownIcon } from './icons'

function resolveHref(target) {
  if (target.kind === 'project') return `#project-${target.slug}`
  return target.href
}

// Background must be semi-transparent for backdrop-blur to be visible at all
// (opaque bg would just hide it) -- 90% white is a reasonable default, not a
// sampled Figma fill-opacity value, flagged for Flore to confirm/adjust.
const POPOVER_SURFACE_CLASS =
  'rounded border border-gray-300 bg-white/90 backdrop-blur-[7px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]'

export default function Popover({ hotspot }) {
  if (hotspot.type === 'contact') {
    return (
      <div
        data-component="popover"
        data-popover-variant="contact"
        className={`flex w-56 flex-col gap-2 p-4 ${POPOVER_SURFACE_CLASS}`}
      >
        <p>{hotspot.title}</p>
        <p>{hotspot.email}</p>
        <CopyButton value={hotspot.email} />
      </div>
    )
  }

  return (
    <div
      data-component="popover"
      data-popover-variant="link"
      className={`flex w-56 flex-col gap-2 p-4 ${POPOVER_SURFACE_CLASS}`}
    >
      <p>{hotspot.title}</p>
      <ButtonLink variant="popover" href={resolveHref(hotspot.target)} className="flex items-center gap-1">
        {hotspot.ctaLabel}
        <ArrowDownIcon width={16} height={16} />
      </ButtonLink>
    </div>
  )
}
