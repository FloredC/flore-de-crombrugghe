/**
 * One horizontal bar chart, used three times on this page with different data.
 * Divs and design tokens only -- no chart library, per the build spec.
 *
 * THE EMPHASIS RULE is the whole point of the component. Exactly one bar per
 * chart carries `emphasis` and takes the accent; every other bar is neutral
 * grey. So the chart makes its argument by colour before anyone reads a
 * number -- most visibly in the third instance, where the tallest bar
 * (organisational politics) is the one the product does NOT solve.
 *
 * That rule is enforced below rather than trusted: passing two emphasised
 * items, or none, throws in dev. A chart that quietly emphasised two bars
 * would still look plausible, which is exactly the kind of wrong-but-fine
 * output that survives review.
 *
 * COLOURS. Both resolve to existing semantic tokens; nothing here is a hex.
 *   emphasis -> --colors-chart-chart-blue-stroke (blue-50)
 *   neutral  -> --colors-border-grey (grey-20)
 *
 * `chart-blue-stroke` is the only semantic token in the system that means "a
 * blue data mark", which is what the spec's "PitchPivot blue" accent needs to
 * be here. Worth knowing that the site's token literally named `action-accent`
 * is ORANGE (orange-70) -- using it would have made the accent bar orange and
 * clashed with the peach quote rules and stat cards. Flagged for Flore: if the
 * emphasis bar should instead be the pale card tint (#dfe8fd, lib/mediaTints),
 * that value is too light to read as a filled bar and would need its own
 * darker step.
 *
 * SCALE. `max` is per-item so a chart can either share one scale (tool
 * quality, both out of 10) or normalise against its own largest value
 * (response counts, where the number is a count and not a score). The spec's
 * warning about never setting figures from two different surveys side by side
 * is a CONTENT rule -- it lives in the data file, one chart per survey.
 */

// Deliberately not a `bg-*` Tailwind class: the value is applied via inline
// style so the component stays one code path for both states, and so a new
// emphasis colour is a one-line change here rather than a class-name swap.
const EMPHASIS_FILL = 'var(--colors-chart-chart-blue-stroke)'
const NEUTRAL_FILL = 'var(--colors-border-grey)'

export default function RankedBars({ items, caption, source }) {
  if (import.meta.env.DEV) {
    const emphasised = items.filter((item) => item.emphasis)
    if (emphasised.length !== 1) {
      throw new Error(
        `RankedBars: exactly one item must carry \`emphasis\`, found ${emphasised.length}` +
          `${caption ? ` in "${caption}"` : ''}. The single accent bar is the chart's argument.`,
      )
    }
  }

  return (
    <figure className="m-0 flex flex-col gap-space-16">
      {caption && (
        <figcaption className="text-body-sm font-semibold text-text-primary">{caption}</figcaption>
      )}

      {/* A plain list, not a table: every label and value below is real,
          visible text, so a screen reader already receives the full dataset in
          reading order. The bars are aria-hidden decoration on top of it. That
          satisfies the spec's "accessible fallback" without duplicating the
          numbers into a second hidden table, which would make every figure be
          announced twice. */}
      <ul className="m-0 flex list-none flex-col gap-space-12 p-0">
        {items.map((item) => {
          const max = item.max || Math.max(...items.map((other) => other.value))
          const share = Math.max(0, Math.min(1, item.value / max))

          return (
            <li key={item.label} className="flex flex-col gap-space-4">
              <div className="flex items-baseline justify-between gap-space-16">
                <span
                  className={`text-body-sm ${
                    item.emphasis ? 'font-semibold text-text-primary' : 'font-normal text-text-secondary'
                  }`}
                >
                  {item.label}
                </span>
                {/* Value at the end of the row, per the spec. Tabular figures
                    so the numbers line up in a column instead of dancing with
                    the glyph widths. */}
                <span
                  className={`shrink-0 text-body-sm tabular-nums ${
                    item.emphasis ? 'font-bold text-text-primary' : 'font-normal text-text-secondary'
                  }`}
                >
                  {item.value}
                  {item.max ? <span className="font-normal text-text-secondary">/{item.max}</span> : null}
                </span>
              </div>
              <div aria-hidden="true" className="h-space-8 w-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${share * 100}%`,
                    backgroundColor: item.emphasis ? EMPHASIS_FILL : NEUTRAL_FILL,
                  }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      {source && <p className="m-0 text-caption font-normal text-text-secondary">{source}</p>}
    </figure>
  )
}
