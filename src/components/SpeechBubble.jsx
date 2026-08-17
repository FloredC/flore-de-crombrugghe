// Sampled from Figma's "Speech bubble" component: white bg, 1px border-grey,
// radius-16, px-14/py-8, text 14px regular (Desktop/caption), max-width 300px.
// Two distinct tail treatments, not one style reused two ways:
// - "right" (Wayfinding, avatar to the left): tail on the left edge,
//   vertically centered, rotate-135. Previously used rotate-45 here, which is
//   wrong -- that's the other variant's rotation, not this one's. Position
//   (left edge) was already correct, only the rotation value was mixed up.
// - "top" (Hero, avatar below): tail near the bottom-left, rotate-45,
//   pointing down toward the avatar underneath. No relation to a "top edge"
//   despite the variant name -- that name is Figma's, not a literal
//   description of where the tail sits.
const TAIL_CLASS = {
  right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[135deg] border-b border-r',
  top: 'left-[27px] bottom-0 translate-y-1/2 rotate-45 border-b border-r',
}

// SHARED COMPONENT — additive change, 2026-08-12. Flagged for Flore's review.
//
// `maxWidth` defaults to the original hard `max-w-[300px]`, so every existing
// homepage call site renders byte-identically and the map cannot regress. It
// exists because the case-study Guide is drawn at 520 wide in Figma (nodes
// 4774:7579 and 4774:7661) against the map's 300 -- the same component at two
// deliberately different measures, since one sits beside an illustration in a
// crowded map and the other carries a full paragraph on an open page.
//
// HANDOFF.md already lists the hard 300 cap as the thing that crowds the map at
// small sizes, so making this a prop rather than a constant is a step toward
// that fix, not a workaround around it.
// TWO SIZES, added 2026-08-14 from Flore's detached mock (node 4825:2590).
//
//   compact      the original. 16px text (text-body-sm), 14 horizontal / 8
//                vertical padding. Every homepage call site -- map popovers
//                and wayfinding rows -- and the DEFAULT, so none of them move.
//   comfortable  18px text (text-body), 14 padding on all four sides. The
//                case-study Guide, which carries a full paragraph on an open
//                page rather than a short line beside a crowded map.
//
// SAMPLED, not guessed. `Desktop/body` on that node is HK Grotesk Regular
// 18px / line-height 1.5, which is exactly what `text-body` resolves to at the
// desktop end of its clamp. The padding comes from the node's geometry: the
// body text sits at x=15, y=15 in a 396.5x219 bubble with 15px clear on all
// four sides, and 15 minus the 1px border is `Spaces/14`. So the horizontal
// padding was already right and only the vertical changes, 8 -> 14.
//
// WHY OPT-IN RATHER THAN GLOBAL. The previous size change (caption ->
// body-sm) was applied everywhere on a "one component, one style" argument,
// and that was right for a pure type-token correction. This is different: it
// is a deliberately different measure for a different context, mocked on a
// DETACHED instance, and pushing 18px text plus taller padding into the map
// popovers would grow them over the illustration -- HANDOFF.md already lists
// bubble size as what crowds the map at small sizes. Flagged for Flore: if she
// wants one bubble everywhere, flip the default here and delete `compact`.
const SIZE_CLASS = {
  compact: 'px-space-14 py-space-8',
  comfortable: 'p-space-14',
}

const SIZE_TEXT = {
  compact: 'text-body-sm',
  comfortable: 'text-body',
}

export default function SpeechBubble({
  variant = 'right',
  maxWidth = 'max-w-[300px]',
  size = 'compact',
  children,
}) {
  // The size class goes on the OUTER element, not on the <p>, and that is
  // load-bearing rather than tidiness: `maxWidth` is applied here, and a `ch`
  // cap resolves against THIS element's font-size. With the size class further
  // down, the wrapper inherited the body's 16px while the bubble text rendered
  // at 18, so every `ch` measure came out ~10% narrow -- the case-study cap
  // landed at 353px against the 396.5 its Figma node draws, while looking
  // correct in the code. The <p> inherits the size, so the rendered text is
  // unchanged.
  return (
    <div
      data-speech-bubble-variant={variant}
      data-speech-bubble-size={size}
      className={`relative ${SIZE_TEXT[size]} ${maxWidth}`}
    >
      <div className={`rounded-radius-16 border border-border-grey bg-surface-background ${SIZE_CLASS[size]}`}>
        <p className="font-normal">{children}</p>
      </div>
      <div className={`absolute h-[10px] w-[10px] border-border-grey bg-surface-background ${TAIL_CLASS[variant]}`} />
    </div>
  )
}
