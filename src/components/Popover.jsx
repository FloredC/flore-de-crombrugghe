import ButtonLink from './ButtonLink'
import CopyButton from './CopyButton'
import { ArrowDownIcon } from './icons'

function resolveHref(target) {
  if (target.kind === 'project') return `#project-${target.slug}`
  return target.href
}

// Sampled directly from the Figma "Hotspot Popover" node: radius 8px
// (--spaces/8), padding 12px (--spaces/12), backdrop-blur 3.5px, drop shadow
// 0/0/5/0 black 25% (note: a screenshot Flore shared separately showed
// Blur:10 -- flagging the mismatch, using this node's own value here).
// Figma's own fill for this node is fully opaque white with no alpha, which
// per CLAUDE.md's own note means backdrop-blur would show nothing at all --
// bg-white/90 here is a guess to make the blur visible, not a sampled
// fill-opacity value. Still need the real fill-opacity % from Flore.
const POPOVER_SURFACE_CLASS =
  'rounded-[8px] bg-white/90 backdrop-blur-[3.5px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)]'

export default function Popover({ hotspot }) {
  if (hotspot.type === 'contact') {
    return (
      <div
        data-component="popover"
        data-popover-variant="contact"
        className={`flex w-56 flex-col gap-4 p-3 ${POPOVER_SURFACE_CLASS}`}
      >
        <p className="text-[14px] font-semibold">{hotspot.title}</p>
        <div className="flex items-center gap-1">
          <p className="text-[14px] font-semibold">{hotspot.email}</p>
          <CopyButton value={hotspot.email} />
        </div>
      </div>
    )
  }

  return (
    <div
      data-component="popover"
      data-popover-variant="link"
      className={`flex w-56 flex-col gap-4 p-3 ${POPOVER_SURFACE_CLASS}`}
    >
      <p className="text-[14px] font-semibold">{hotspot.title}</p>
      <ButtonLink variant="popover" href={resolveHref(hotspot.target)} className="w-fit">
        <span className="flex items-center gap-1">
          {hotspot.ctaLabel}
          <ArrowDownIcon width={14} height={14} />
        </span>
      </ButtonLink>
    </div>
  )
}
