import emphasise from '../../lib/emphasis'

/**
 * The Artifakt page's prose renderer: an array of TYPED block nodes.
 *
 * WHY TYPED NODES AND NOT MARKDOWN
 *
 * Flore's Figma copy arrived as Markdown pasted into text layers -- `- ` and
 * `> ` and `**` rendering as literal characters in the frame -- and was then
 * restyled in Figma into real bullet lists, real bold/italic runs and italic
 * asides (2026-08-21). So the design now shows four distinct block treatments,
 * and each one wants its own spacing and its own HTML element.
 *
 * A Markdown string would flatten all four back into one field and hand the
 * spacing decision to a parser's stylesheet. Typed nodes keep the copy as
 * plain strings (see emphasis.jsx on why that matters) while letting the page
 * decide what a bullet list is worth vertically. Inline formatting inside each
 * node still goes through `emphasise`.
 *
 * THE FOUR TYPES, each sampled from the restyled frame:
 *
 *   p        body-lg paragraph. The default; most nodes are this.
 *   list     a real <ul>. Figma draws these as list-disc at body-lg with the
 *            lead-in phrase bold ("**Wanted:** the traced line still...").
 *   quote    participant speech, fully italic, NO quote chrome -- no rule, no
 *            indent, no oversized glyph. That is the design, sampled rather
 *            than assumed: node 4897:4588's quote line carries only
 *            HK_Grotesk:Italic. A <blockquote> because it IS one; the styling
 *            just happens to be quiet.
 *   aside    the authorial voice -- the "Lesson:" notes and the narrowed
 *            question. Same italic treatment as `quote`, different element and
 *            different meaning: a <p>, because Flore is not quoting anyone.
 *            Its bold lead-in comes from `**` inside the string, which renders
 *            bold INSIDE the italic parent and so lands on HK Grotesk's real
 *            Bold Italic face -- which is exactly what Figma draws.
 *
 * SPACING: `gap-space-32`. Figma separates every block with an empty
 * zero-width-space paragraph at body-lg, which is 20px x 1.5 line-height =
 * 30px of blank. 32 is the spacing token that lands on that; there is no 30.
 * Measured off the frame rather than picked, and worth knowing before anyone
 * "tidies" it to 24 -- that would tighten every gap on the page by a fifth.
 */

// One node type per key, so an unknown type fails loudly at the point of use
// rather than rendering nothing and looking like missing content.
const RENDERERS = {
  p: ({ text }, key) => (
    <p key={key} className="m-0 text-body-lg font-normal">
      {emphasise(text)}
    </p>
  ),

  // `list-outside` with left padding, not `list-inside`: with markers inside
  // the content box a wrapped line runs back under its own bullet, which at
  // body-lg over a 720 measure happens on nearly every item here. The bullets
  // therefore hang in the gutter and the text keeps one edge.
  list: ({ items }, key) => (
    <ul key={key} className="m-0 flex list-outside list-disc flex-col gap-space-12 pl-space-24">
      {items.map((item) => (
        <li key={item} className="text-body-lg font-normal">
          {emphasise(item)}
        </li>
      ))}
    </ul>
  ),

  quote: ({ text }, key) => (
    <blockquote key={key} className="m-0 text-body-lg font-normal italic">
      {emphasise(text)}
    </blockquote>
  ),

  aside: ({ text }, key) => (
    <p key={key} className="m-0 text-body-lg font-normal italic">
      {emphasise(text)}
    </p>
  ),
}

export default function Prose({ blocks, className = '' }) {
  return (
    <div className={`flex flex-col gap-space-32 ${className}`}>
      {blocks.map((block, index) => {
        const render = RENDERERS[block.type]
        if (!render) {
          throw new Error(
            `Prose: unknown block type "${block.type}". Expected one of ${Object.keys(RENDERERS).join(', ')}.`,
          )
        }
        // Index as key: two paragraphs in one section can legitimately be
        // identical strings (they are not, today), and the array is static per
        // render either way.
        return render(block, index)
      })}
    </div>
  )
}
