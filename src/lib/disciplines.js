// The map's markers are grouped by discipline (Flore's concept, 2026-08-07,
// out of the first round of user testing). A discipline decides two things at
// once: the label printed at the top of the hotspot's popover, and the colour
// carried by the marker dot, its pulse, the map highlight, and the popover's
// CTA background.
//
// One table rather than a colour per hotspot, because the grouping is the
// point -- two markers sharing a colour is what tells a reader they're the
// same kind of work. A per-hotspot colour field would let that drift silently
// the moment one project got recoloured on its own.
//
// Colours are the component-level `--marker-*` / `--button-popover-surface-*`
// tokens (src/styles/tokens/components.css), which is where Figma's own
// `marker/*` and `button/popover/surface/*` variables land. Referenced as CSS
// variables rather than Tailwind classes so a component can set them once on
// a wrapper and let every child inherit -- see Hotspot.jsx.
//
// The mapping is NOT one label per colour: Contact and Selected talks are both
// purple in Figma -- verified on the marker instances themselves rather than
// read off a screenshot, and corroborated by the desktop page frame
// (2928:73693), which binds only four `marker/*` colours across five
// disciplines. Flagged to Flore as possibly unintended; until she says
// otherwise it's what the file shows.
//
// No node ids here on purpose. This cited two marker-instance sublayers and
// both had stopped resolving by 2026-08-19 -- Figma reissues sublayer ids
// whenever an instance changes, so those citations rot on their own even if
// nobody touches the design. Name the component, not the sublayer.
export const DISCIPLINES = {
  'own-products': {
    label: 'Own Products',
    marker: 'var(--marker-orange)',
    markerHover: 'var(--marker-orange-hover)',
    popoverSurface: 'var(--button-popover-surface-orange)',
  },
  'client-work': {
    label: 'Client work',
    marker: 'var(--marker-green)',
    markerHover: 'var(--marker-green-hover)',
    popoverSurface: 'var(--button-popover-surface-green)',
  },
  'selected-talks': {
    label: 'Selected talks',
    marker: 'var(--marker-purple)',
    markerHover: 'var(--marker-purple-hover)',
    popoverSurface: 'var(--button-popover-surface-purple)',
  },
  'outside-of-work': {
    label: 'Outside of work',
    marker: 'var(--marker-red)',
    markerHover: 'var(--marker-red-hover)',
    popoverSurface: 'var(--button-popover-surface-red)',
  },
  contact: {
    label: 'Contact',
    marker: 'var(--marker-purple)',
    markerHover: 'var(--marker-purple-hover)',
    popoverSurface: 'var(--button-popover-surface-purple)',
  },
}

// Throws rather than falling back to a default colour. A hotspot with a
// missing or misspelled discipline would otherwise render in whatever the
// fallback happened to be, which is exactly the kind of wrong-but-plausible
// output that survives a review -- the marker would look fine, just filed
// under the wrong group.
export function getDiscipline(key) {
  const discipline = DISCIPLINES[key]
  if (!discipline) {
    throw new Error(
      `Unknown discipline "${key}". Expected one of: ${Object.keys(DISCIPLINES).join(', ')}`,
    )
  }
  return discipline
}
