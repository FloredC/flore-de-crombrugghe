// Sampled from Figma's "Speech bubble" component (variant=right): white bg,
// 1px border-grey, radius-16, px-14/py-8, text 14px regular (Desktop/caption
// -- corrects an earlier guess of 12px pulled from a specific Wayfinding
// instance override, not the base component). Tail is the classic CSS
// technique: a small square rotated 45deg with only two borders shown, matching
// the bubble's own bg/border so it reads as one continuous shape.
// "top" variant (tail on top edge instead of left) has no direct Figma sample
// yet -- implemented as a reasonable mirrored equivalent, flagged as inferred.
const TAIL_CLASS = {
  right: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r',
  top: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t',
}

export default function SpeechBubble({ variant = 'right', children }) {
  return (
    <div data-speech-bubble-variant={variant} className="relative">
      <div className="rounded-radius-16 border border-border-grey bg-surface-background px-space-14 py-space-8">
        <p className="text-[14px] font-normal">{children}</p>
      </div>
      <div className={`absolute h-[10px] w-[10px] border-border-grey bg-surface-background ${TAIL_CLASS[variant]}`} />
    </div>
  )
}
