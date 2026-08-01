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

// Sampled from Figma's "Wayfinding" component: the district image is a
// pre-composed 180x125 card (border/bg/radius already baked into the
// exported SVG, confirmed by its own viewBox and rounded-rect clip path --
// no extra wrapper chrome needed). Text sits beside it, not below: 18px
// (Desktop/body, not the 14px caption size used before), zone and subsection
// both bold. Figma's own sample shows both in the same plain dark text color
// with no orange -- but CLAUDE.md explicitly and specifically calls for the
// subsection in the accent-orange token ("do not hardcode a hex value").
// Went with CLAUDE.md's explicit instruction for color (kept Figma's
// confirmed bold weight for both), since that reads as a deliberate call-out
// rather than something to override silently.
export default function DistrictBreadcrumb({ zone, subsection }) {
  const icon = DISTRICT_ICON[zone]

  return (
    <div data-district-breadcrumb className="flex items-center gap-4">
      {icon && <img src={icon} alt="" width={180} height={125} />}
      <p className="text-[18px] font-normal text-text-primary">
        You are here: <span className="font-bold">{zone}</span> —{' '}
        <span className="font-bold text-action-accent-foreground">{subsection}</span>
      </p>
    </div>
  )
}
