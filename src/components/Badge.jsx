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
      // Figma nests this as a 101x80 box flush to the frame's top-right with
      // the stamp centred inside it, and the stamp is round rather than the
      // pill this used to render. Mirroring that nesting rather than
      // hand-computing offsets: rotating a box changes its visual bounds, so
      // a single positioned element needs the offsets corrected for the
      // rotation, and the two-box version just gets it right.
      <span
        data-badge="nda"
        className="pointer-events-none absolute right-0 top-0 flex h-[80px] w-[101px] items-center justify-center"
      >
        <span
          // -rotate-[15deg], not -rotate-15: Tailwind's default rotate scale
          // jumps 12 -> 45, so `-rotate-15` is not a real class and silently
          // rendered transform:none (confirmed via getComputedStyle).
          className="relative flex size-[66px] -rotate-[15deg] items-center justify-center rounded-full border-[2.357px] border-black bg-white-transparent text-body-sm font-bold text-text-primary"
        >
          {/* The stamp's second, inner ring. */}
          <span aria-hidden="true" className="absolute inset-[6.5px] rounded-full border border-black" />
          NDA
        </span>
      </span>
    )
  }

  if (status === 'full-case-study') {
    return (
      // Was a solid dark tab, which Flore found too prominent -- now the same
      // translucent-white chrome as the NDA stamp, with black text and rule.
      //
      // Border on the bottom and left only, per Figma: the badge is flush into
      // the frame's top-right corner, so its top and right edges sit on the
      // frame's own border. A full outline would double that stroke up.
      //
      // The rule is border-grey, matching the ProjectMedia frame it sits in --
      // Flore's call, and a step quieter than Figma, which still has it at
      // text-primary. Text stays black. NOTE: Figma is behind on this one.
      //
      // bg-white-transparent is the real --white-transparent token again, here
      // and on the NDA badge. Both used to hardcode bg-white/[0.33] because the
      // token had exported as opaque #ffffff with its alpha dropped, making it
      // indistinguishable from --white. Fixed at the root in primitives.css
      // (#ffffff54, read back from Figma), so the copies are gone.
      <span
        data-badge="case-study"
        className="pointer-events-none absolute right-0 top-0 rounded-bl-radius-12 rounded-tr-radius-12 border-b border-l border-border-grey bg-white-transparent px-space-10 py-space-4 text-body-sm font-semibold text-text-primary"
      >
        Case study
      </span>
    )
  }

  return null
}
