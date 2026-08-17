/**
 * Inline emphasis for case-study prose.
 *
 * Copy in the content files is plain strings, which is deliberate — see
 * content.js on why case studies are .js modules and not MDX. But long prose
 * needs a way to mark the phrase a skimmer should catch, so `**like this**`
 * in a content string renders as a real <strong>.
 *
 * WHY A MARKER AND NOT JSX IN THE CONTENT FILE
 * Content strings stay strings: they can be counted, diffed, spell-checked and
 * moved between fields without dragging markup along. The moment one paragraph
 * becomes JSX, every consumer has to handle both shapes.
 *
 * WHY NOT A MARKDOWN LIBRARY
 * This handles one construct. A parser would add a dependency, a bundle cost
 * and a much larger surface (links, lists, HTML) that no case study asks for.
 *
 * WEIGHT: `font-semibold` is 600, and HK Grotesk SemiBold is a real loaded
 * face (see globals.css) — not a browser-synthesised weight. 700 was too heavy
 * against body copy at 20px; 600 reads as emphasis rather than as a heading.
 *
 * Escaping is not supported: a literal `**` in copy would be swallowed. No
 * string on the page contains one, and if that ever changes the fix is a
 * different marker, not an escape syntax.
 */
export default function emphasise(text) {
  if (typeof text !== 'string' || !text.includes('**')) return text

  // Capturing split, so the delimiters come back in the array rather than
  // being thrown away and needing a second pass to locate.
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      // The key is the index because the same phrase can legitimately appear
      // twice in one paragraph; the array is static per render either way.
      <strong key={index} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}
