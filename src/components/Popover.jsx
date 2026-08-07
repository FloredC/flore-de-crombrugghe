import ButtonLink from './ButtonLink'
import CopyButton from './CopyButton'
import { ArrowDownIcon } from './icons'
import { getDiscipline } from '../lib/disciplines'

function resolveHref(target) {
  if (target.kind === 'project') return `#project-${target.slug}`
  return target.href
}

// Sampled directly from the Figma "Hotspot Popover" node: radius 8px
// (--spaces/8), padding 12px (--spaces/12), backdrop-blur 3.5px, drop shadow
// 0/0/5/0 black 25% (note: a screenshot Flore shared separately showed
// Blur:10 -- flagging the mismatch, using this node's own value here).
// Fill opacity is still a guess (Figma's own export shows fully opaque, which
// per CLAUDE.md's note would make backdrop-blur invisible -- can't be
// literally true if blur is meant to show). Confirmed via an isolated overlay
// test directly on this map's line art that backdrop-filter renders correctly
// at this blur radius; bg-white/90 was just too subtle against thin, sparse
// line work to notice. bg-white/70 makes it visibly perceptible without
// looking like a different fill color -- still not a sampled opacity value,
// flagged for Flore to confirm/adjust once she has the real Figma number.
const POPOVER_SURFACE_CLASS = 'rounded-[8px] bg-white/70 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)]'

// Tailwind's backdrop-blur-* utility only emits unprefixed backdrop-filter --
// this build's autoprefixer config isn't adding -webkit-backdrop-filter, which
// Safari requires (CLAUDE.md flags this explicitly). Set both properties by
// hand rather than relying on the Tailwind class, so it isn't silently
// invisible in Safari regardless of the fill-opacity question above.
const POPOVER_BLUR_STYLE = {
  WebkitBackdropFilter: 'blur(3.5px)',
  backdropFilter: 'blur(3.5px)',
}

// The discipline line above the title, added 2026-08-07 -- Figma's Hotspot
// Popover gained a `discipline` text property on both variants (nodes
// 2760:18699 and 4461:12257). Caption size like the title, but REGULAR weight
// against the title's semibold, and 4px below it rather than the 16px that
// separates the text block from the CTA -- so it reads as an eyebrow on the
// title, not as a third stacked line.
//
// Deliberately not coloured: the discipline's colour is carried by the marker
// and the CTA pill. Colouring the label too would be the third instance of the
// same signal inside one 186px card.
function DisciplineHeading({ discipline, title }) {
  return (
    <div className="flex flex-col gap-space-4">
      <p className="text-caption font-normal">{discipline.label}</p>
      <p className="text-caption font-semibold">{title}</p>
    </div>
  )
}

export default function Popover({ hotspot }) {
  const discipline = getDiscipline(hotspot.discipline)

  // The popover renders through a FloatingPortal, i.e. as a child of <body>,
  // NOT inside the hotspot it belongs to. So it inherits nothing from the
  // marker -- every discipline variable it needs has to be declared here, on
  // both variants. (This is easy to get wrong precisely because the popover
  // *looks* nested when you're reading Hotspot.jsx.)
  const disciplineVars = {
    '--discipline-marker': discipline.marker,
    '--discipline-marker-hover': discipline.markerHover,
    '--discipline-surface': discipline.popoverSurface,
  }

  if (hotspot.type === 'contact') {
    return (
      <div
        data-component="popover"
        data-popover-variant="contact"
        data-discipline={hotspot.discipline}
        className={`flex w-56 flex-col gap-4 p-3 ${POPOVER_SURFACE_CLASS}`}
        style={{ ...POPOVER_BLUR_STYLE, ...disciplineVars }}
      >
        <DisciplineHeading discipline={discipline} title={hotspot.title} />
        <div className="flex min-w-0 items-center gap-1">
          <p className="min-w-0 truncate text-caption font-semibold">{hotspot.email}</p>
          <CopyButton value={hotspot.email} />
        </div>
      </div>
    )
  }

  return (
    <div
      data-component="popover"
      data-popover-variant="link"
      data-discipline={hotspot.discipline}
      className={`flex w-56 flex-col gap-4 p-3 ${POPOVER_SURFACE_CLASS}`}
      // Declared on the popover rather than on the CTA so the whole card can
      // reach the discipline's colours -- ButtonLink's `popover` variant and
      // CopyButton both read them from here. See the note in ButtonLink for
      // why the colour isn't a prop.
      style={{ ...POPOVER_BLUR_STYLE, ...disciplineVars }}
    >
      <DisciplineHeading discipline={discipline} title={hotspot.title} />
      <ButtonLink variant="popover" href={resolveHref(hotspot.target)} className="w-fit">
        <span className="flex items-center gap-1">
          {hotspot.ctaLabel}
          <ArrowDownIcon width={14} height={14} />
        </span>
      </ButtonLink>
    </div>
  )
}
