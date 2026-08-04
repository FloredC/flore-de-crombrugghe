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
      <p className="text-[18px] font-normal text-text-primary">
        You are here: <span className="font-bold">{zone}</span> —{' '}
        <span className="font-bold">{subsection}</span>
      </p>
    </div>
  )
}
