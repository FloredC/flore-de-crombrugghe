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
 * SPACING: `space-32` between blocks. Figma separates them with an empty
 * zero-width-space paragraph at body-lg, which is 20px x 1.5 line-height =
 * 30px of blank. 32 is the spacing token that lands on that; there is no 30.
 * Measured off the frame rather than picked, and worth knowing before anyone
 * "tidies" it to 24 -- that would tighten every gap on the page by a fifth.
 *
 * EXCEPT AFTER A COLON, where the gap closes to nothing. Flore, 2026-08-25:
 * "put the text that comes after a ':' closer to the paragraph they belong to.
 * Better for readability."
 *
 * A paragraph ending in a colon is not finished -- it introduces the thing
 * below it. At the full 32 the two read as unrelated blocks, and the reader has
 * to hold the colon across a gap the page uses everywhere to mean "new
 * thought". Figma expresses this by deleting the blank line entirely (node
 * 4897:4563: the bold "People want to have made it" follows its introduction
 * with nothing between), so the remaining separation is just the line leading.
 * Zero here matches that exactly.
 *
 * Detected from the copy rather than declared per block, deliberately: the
 * colon IS the signal, so a writer gets the right spacing by writing normally
 * instead of remembering a flag. The cost is that it cannot be opted out of --
 * if a paragraph ever ends in a colon and genuinely does start a new thought,
 * this will tighten it wrongly. No paragraph on either page does.
 *
 * IMPLEMENTED AS MARGIN, NOT GAP. A flex `gap` is uniform by definition and
 * cannot vary per child, so the container's gap is dropped and each block
 * carries its own top margin instead.
 */

// One node type per key, so an unknown type fails loudly at the point of use
// rather than rendering nothing and looking like missing content.
const RENDERERS = {
  p: ({ text }, key, space) => (
    <p key={key} className={`m-0 text-body-lg font-normal ${space}`}>
      {emphasise(text)}
    </p>
  ),

  // `list-outside` with left padding, not `list-inside`: with markers inside
  // the content box a wrapped line runs back under its own bullet, which at
  // body-lg over a 720 measure happens on nearly every item here. The bullets
  // therefore hang in the gutter and the text keeps one edge.
  list: ({ items }, key, space) => (
    <ul key={key} className={`m-0 flex list-outside list-disc flex-col gap-space-12 pl-space-24 ${space}`}>
      {items.map((item) => (
        <li key={item} className="text-body-lg font-normal">
          {emphasise(item)}
        </li>
      ))}
    </ul>
  ),

  quote: ({ text }, key, space) => (
    <blockquote key={key} className={`m-0 text-body-lg font-normal italic ${space}`}>
      {emphasise(text)}
    </blockquote>
  ),

  aside: ({ text }, key, space) => (
    <p key={key} className={`m-0 text-body-lg font-normal italic ${space}`}>
      {emphasise(text)}
    </p>
  ),
}

// True when a block's copy ends by introducing what follows. Checked on the
// RAW string, before `emphasise` turns it into elements -- a colon inside
// `**bold**` still ends the sentence, and trailing whitespace is common in
// copy pasted out of Figma.
function introducesNext(block) {
  const text = block?.type === 'list' ? block.items?.[block.items.length - 1] : block?.text
  return typeof text === 'string' && text.trimEnd().endsWith(':')
}

export default function Prose({ blocks, className = '' }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {blocks.map((block, index) => {
        const render = RENDERERS[block.type]
        if (!render) {
          throw new Error(
            `Prose: unknown block type "${block.type}". Expected one of ${Object.keys(RENDERERS).join(', ')}.`,
          )
        }
        // First block never carries a top margin -- the block above it is the
        // section header, whose spacing belongs to the section, not here.
        const space = index === 0 ? '' : introducesNext(blocks[index - 1]) ? '' : 'mt-space-32'
        // Index as key: two paragraphs in one section can legitimately be
        // identical strings (they are not, today), and the array is static per
        // render either way.
        return render(block, index, space)
      })}
    </div>
  )
}
