// The four market figures, as tinted cards.
//
// TINTS. Figma binds `Colors/Discipline/green|orange/surface` (#c9f8e2 /
// #ffe4d6) on these cards. Those two values already exist in this repo's token
// layer as `--button-popover-surface-green` and `--button-popover-surface-orange`
// (components.css) -- same primitives, green-20 and orange-20, verified value
// for value. So these are existing tokens, not new ones and not hexes.
//
// The name is admittedly off: `button-popover-surface-*` describes where the
// token was first used, not what it means. Figma has since introduced a
// properly-named `Colors/Discipline/*/surface` for the same values. Mirroring
// that name here would mean adding to the token files, which needs Flore's
// sign-off -- flagged. Until then this indirection is the one place that knows
// about the mismatch, so the rename is a one-line change rather than a hunt.
const TINT = {
  green: 'var(--button-popover-surface-green)',
  orange: 'var(--button-popover-surface-orange)',
}

// Value type is Figma's Desktop/h3 (24 SemiBold). The nearest token is
// `text-h2`, which is 24 at the mobile anchor and 28 at desktop -- so it
// matches Figma exactly on a phone and runs 4px larger on a wide screen. Kept
// as the nearest existing token rather than pinning a literal 24, per the
// no-hardcoding rule; noted in the handover as a small deliberate divergence.
export function StatCard({ value, label, tint = 'green' }) {
  const surface = TINT[tint]
  if (!surface) {
    throw new Error(`StatCard: unknown tint "${tint}". Expected one of ${Object.keys(TINT).join(', ')}.`)
  }

  return (
    // flex-col-reverse + justify-end: DOM order is label-then-value so the
    // <dt>/<dd> pairing is correct for a screen reader, while the figure reads
    // first visually. `justify-end` pins content to the visual top so all four
    // figures share a baseline even when one label wraps to two lines and
    // another doesn't -- in a column-reverse flex the default packs to the
    // bottom, which silently staggers them. (Same trap as the homepage's
    // stat row; see the note there.)
    <div
      className="flex h-full flex-col-reverse justify-end gap-space-12 rounded-radius-20 p-space-16"
      style={{ backgroundColor: surface }}
    >
      <dt className="m-0 text-body font-normal text-text-primary">{label}</dt>
      <dd className="m-0 text-h2 font-semibold text-text-primary">{value}</dd>
    </div>
  )
}

export default function StatGrid({ stats }) {
  return (
    // 4-up at xl, 2-up in the middle band, stacked on a phone. `items-stretch`
    // via the grid default plus `h-full` on the card keeps all four the same
    // height regardless of label length, so the tinted blocks read as a row
    // rather than a ragged strip.
    <dl className="m-0 grid grid-cols-1 gap-space-16 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </dl>
  )
}
