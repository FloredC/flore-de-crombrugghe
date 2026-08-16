// One interview quote with its attribution.
//
// Figma draws these as white cards with a peach rule down the left edge and no
// border or fill of their own (nodes 4774:7583/7589/7595). The rule colour is
// `Colors/Discipline/orange/surface` (#ffe4d6) -- the same value the stat cards
// use, and the same existing token, `--button-popover-surface-orange`. See the
// note in StatGrid.jsx about that token's name.
//
// Rule width: Figma's line measures a shade over 3px. Tailwind's border scale
// steps 2 -> 4, and 4 is also a real spacing token (--spaces-4), so `border-l-4`
// is the nearest step in the system rather than a literal 3px.
//
// A real <blockquote>/<cite>, not styled paragraphs: this is evidence, and the
// markup should say so.
export default function QuoteCard({ quote, attribution }) {
  return (
    <blockquote
      className="m-0 flex h-full flex-col gap-space-16 border-l-4 pl-space-20"
      style={{ borderColor: 'var(--button-popover-surface-orange)' }}
    >
      {/* body-lg (20 desktop), matching Figma's Desktop/body-lg on the quote
          text -- deliberately larger than the attribution under it. */}
      <p className="m-0 text-body-lg font-normal text-text-primary">{quote}</p>
      {attribution && (
        // mt-auto so attributions sit on the card's bottom edge and line up
        // across a row of quotes of differing length, instead of floating
        // directly under each quote at three different heights.
        <cite className="mt-auto text-body-sm font-normal not-italic text-text-secondary">
          {attribution}
        </cite>
      )}
    </blockquote>
  )
}
