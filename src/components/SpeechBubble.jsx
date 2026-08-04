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

export default function SpeechBubble({ variant = 'right', children }) {
  return (
    <div data-speech-bubble-variant={variant} className="relative max-w-[300px]">
      <div className="rounded-radius-16 border border-border-grey bg-surface-background px-space-14 py-space-8">
        {/* text-caption: 14 desktop, 12 at 402 -- both verified, the mobile
            end straight off the 402 wayfinding bubble (node 2928:78240). */}
        <p className="text-caption font-normal">{children}</p>
      </div>
      <div className={`absolute h-[10px] w-[10px] border-border-grey bg-surface-background ${TAIL_CLASS[variant]}`} />
    </div>
  )
}
