import districtHarbour from '../assets/illustrations/district-breadcrumb-harbour.svg'
import districtHouse from '../assets/illustrations/district-breadcrumb-house.svg'
import districtLab from '../assets/illustrations/district-breadcrumb-lab.svg'
import districtPlaza from '../assets/illustrations/district-breadcrumb-plaza.svg'

const DISTRICT_ICON = {
  Lab: districtLab,
  House: districtHouse,
  Harbour: districtHarbour,
  Plaza: districtPlaza,
}

// Sampled from Figma's "Wayfinding" component (node 4494:6080): the district
// image is a pre-composed 180x125 card (border/bg/radius already baked into
// the exported SVG, confirmed by its own viewBox and rounded-rect clip path --
// no extra wrapper chrome needed). Text sits beside it, not below: 18px
// (Desktop/body, not the 14px caption size used before), zone and subsection
// both bold, both in the same plain dark text color.
//
// The subsection was accent-orange here until 2026-08-04, following a stale
// line in CLAUDE.md rather than the design file. Figma is the authority on
// colour; confirmed with Flore. Don't reintroduce the accent token.
export default function DistrictBreadcrumb({ zone, subsection }) {
  const icon = DISTRICT_ICON[zone]

  return (
    <div data-district-breadcrumb className="flex items-center gap-4">
      {icon && <img src={icon} alt="" width={180} height={125} />}
      {/* `text-body` rather than a hardcoded 18px: it resolves to 18 at desktop
          (what Figma's wayfinding shows) and 16 at 402, which is the same size
          body-lg takes on mobile -- Flore's ask. The two prose tokens converge
          at the small end, so "same as body-lg on mobile" and "18 on desktop"
          are the same token, not a conflict needing its own scale entry. */}
      {/* `font-bold` (700), not semibold (600): the breadcrumb instance samples
          as Desktop/body for the "You are here:" prefix and Desktop/body-bold
          for the two names (node 4774:7665). This was 600 — a real drift from
          the file, small enough to have gone unnoticed. Corrected 2026-08-12
          while Flore is reviewing this component. */}
      <p className="text-body font-normal text-text-primary">
        You are here: <span className="font-bold">{zone}</span> —{' '}
        <span className="font-bold">{subsection}</span>
      </p>
    </div>
  )
}
