/**
 * Inline formatting for case-study prose.
 *
 * Copy in the content files is plain strings, which is deliberate — see
 * content.js on why case studies are .js modules and not MDX. But long prose
 * needs a way to mark the phrase a skimmer should catch, so a small set of
 * markers in a content string render as real elements.
 *
 * SUPPORTED — three constructs, and deliberately only three:
 *
 *   **bold**          -> <strong>, the phrase a skimmer should catch
 *   *italic*          -> <em>, participant speech and the aside voice
 *   [label](href)     -> <a>, an outbound link inside a sentence
 *
 * WHY A MARKER AND NOT JSX IN THE CONTENT FILE
 * Content strings stay strings: they can be counted, diffed, spell-checked and
 * moved between fields without dragging markup along. The moment one paragraph
 * becomes JSX, every consumer has to handle both shapes.
 *
 * WHY NOT A MARKDOWN LIBRARY
 * This file handled ONE construct until 2026-08-21, and the note here argued a
 * parser would add a dependency, a bundle cost and a much larger surface that
 * no case study asked for. Artifakt asked for two more: its Figma copy uses
 * real italic runs throughout (participant speech, the "Lesson:" asides) and
 * one inline link (fal.ai). Three hand-rolled constructs is still far short of
 * a parser — no headings, no images, no nested emphasis, no HTML — and the
 * argument above holds at three the same way it held at one. If a fourth
 * arrives, reconsider; that is the line, and it is written down so the next
 * person inherits the decision rather than the outcome.
 *
 * BLOCK-level constructs (paragraphs, bullet lists, callouts) are NOT here.
 * They are typed fields in the content file and typed components in Prose.jsx,
 * which is what lets each one carry its own spacing and semantics. A `- ` at
 * the start of a string does nothing.
 *
 * WEIGHT: `font-semibold` is 600, and HK Grotesk SemiBold is a real loaded
 * face (see globals.css) — not a browser-synthesised weight. 700 was too heavy
 * against body copy at 20px; 600 reads as emphasis rather than as a heading.
 *
 * NESTING IS NOT SUPPORTED. `**bold with *italic* inside**` renders the inner
 * markers literally. No string on either page needs it. The regex below is a
 * single flat alternation precisely so this stays true and obvious rather than
 * half-working.
 *
 * FOCUS RING: the link imports `FOCUS_CLASS` from ButtonLink rather than
 * styling its own. A lib module importing from a component is the wrong
 * direction on paper, and it is still the right call here -- FOCUS_CLASS is a
 * style constant, not behaviour, and CaseStudy.jsx already imports it the same
 * way for the source citations, which are the other inline links on the site.
 * Without it this link fell back to the BROWSER's default focus outline (an
 * orange `auto 1px`, measured in the browser -- it is not the site's ring),
 * which is exactly the kind of thing that is invisible when reading the code.
 *
 * ORDER MATTERS IN THE PATTERN: `**` is listed before `*`, otherwise the
 * single-asterisk branch would match the first two characters of a bold run
 * and emit an empty <em>. Tested against "**Lesson:** when the same..." —
 * the exact shape that would break.
 */

import { FOCUS_CLASS } from '../components/ButtonLink'

// One flat alternation, matched left to right. Each branch captures the whole
// delimited run including its markers, so a capturing split returns the
// delimiters rather than discarding them.
const TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g

// `[label](href)` — split out so the render below stays a flat ternary chain.
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/

export default function emphasise(text) {
  if (typeof text !== 'string') return text
  // Fast path: the overwhelming majority of paragraphs carry no markers at
  // all, and a bare string costs nothing to render.
  if (!text.includes('**') && !text.includes('*') && !text.includes('](')) return text

  return text.split(TOKEN).map((part, index) => {
    const link = part.match(LINK)
    if (link) {
      const [, label, href] = link
      return (
        // Outbound and mid-sentence, so it opens in a new tab for the same
        // reason the source citations on the PitchPivot page do: it leads
        // off-site in the middle of a read.
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline underline-offset-2 hover:text-text-secondary ${FOCUS_CLASS}`}
        >
          {label}
        </a>
      )
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      // The key is the index because the same phrase can legitimately appear
      // twice in one paragraph; the array is static per render either way.
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }

    return part
  })
}
