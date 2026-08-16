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
export default function SpeechBubble({ variant = 'right', maxWidth = 'max-w-[300px]', children }) {
  return (
    <div data-speech-bubble-variant={variant} className={`relative ${maxWidth}`}>
      <div className="rounded-radius-16 border border-border-grey bg-surface-background px-space-14 py-space-8">
        {/* Stepped up from `text-caption` to `text-body-sm` on 2026-08-12 --
            Flore enlarged the style in Figma deliberately, and the Guide
            instances now sample as Desktop/body-sm (16px, line-height 1.4)
            rather than Desktop/caption (14px). Verified on the case-study
            Guide (node 4774:7579); `text-body-sm` is 14 at the 402 anchor and
            16 at desktop, so it matches the new style exactly at the wide end.
            Applies everywhere the bubble is used -- map, homepage wayfinding
            and subpages -- which is the point: one component, one style. */}
        <p className="text-body-sm font-normal">{children}</p>
      </div>
      <div className={`absolute h-[10px] w-[10px] border-border-grey bg-surface-background ${TAIL_CLASS[variant]}`} />
    </div>
  )
}
