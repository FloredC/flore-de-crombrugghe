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

export default function DistrictBreadcrumb({ zone, subsection }) {
  const icon = DISTRICT_ICON[zone]

  return (
    <div data-district-breadcrumb className="flex items-center gap-2">
      {icon && <img src={icon} alt="" width={40} height={40} />}
      <p className="text-caption font-normal">
        You are here: {zone} — {/* TODO(styling stage): subsection in --colors-action-accent-foreground-default, not hardcoded */}
        <span data-accent>{subsection}</span>
      </p>
    </div>
  )
}
