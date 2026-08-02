// Both badges are anchored inside the ProjectMedia frame (top-right), not in
// the content column -- sampled from Figma's "project label/case study" and
// "project label/NDA" nodes.
//
// Case study: a solid dark tab flush to the top-right corner, notched with a
// bottom-left + top-right radius (12).
// NDA: a rotated outlined stamp, double-ringed, on a translucent white fill.
export default function Badge({ status }) {
  if (status === 'nda-project') {
    return (
      <span
        data-badge="nda"
        // -rotate-[15deg], not -rotate-15: Tailwind's default rotate scale
        // jumps 12 -> 45, so `-rotate-15` is not a real class and silently
        // rendered transform:none (confirmed via getComputedStyle).
        className="pointer-events-none absolute right-space-24 top-space-16 flex -rotate-[15deg] items-center justify-center rounded-radius-48 border-2 border-black bg-white/30 px-space-12 py-space-8 text-body-sm font-bold shadow-[0_0_0_1px_rgba(0,0,0,1)_inset]"
      >
        NDA
      </span>
    )
  }

  if (status === 'full-case-study') {
    return (
      <span
        data-badge="case-study"
        className="pointer-events-none absolute right-0 top-0 rounded-bl-radius-12 rounded-tr-radius-12 bg-surface-inverted px-space-10 py-space-4 text-body-sm font-semibold text-text-inverted"
      >
        Case study
      </span>
    )
  }

  return null
}
