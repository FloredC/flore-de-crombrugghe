import Block from './Block'
import Frame from './Frame'
import emphasise from '../../lib/emphasis'
import { MEDIA_WIDTH } from '../../lib/caseStudyLayout'

/**
 * The NDA SUBPAGE layout — a fourth content tier, below the project snapshots.
 *
 * Four pages render through it: Rega, myRIDE, trail-app (SAC) and SBB
 * (Figma section `NDA`, node 4980:7811). Like the snapshot tier it is one
 * layout serving several slugs, so nothing here may be keyed on slug —
 * anything that varies arrives as data.
 *
 * The whole shape, from the frames:
 *
 *   Frame     the shared hero, on the snapshot tier's grey stage
 *   Columns   two text columns, "What was essential" / "What I did"
 *
 * That is the entire page, and the brevity is the tier. These are projects
 * under NDA: there is no process to show and no artefact that can be
 * published, so the page states the problem, the work, and the scale, and
 * sends the reader to the live product. Anything more would need material
 * that cannot exist.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS TIER DELIBERATELY DOES NOT HAVE
 *
 * NO `Onward` BLOCK. Every other subpage ends with one — a curated next
 * project plus a contact CTA. None of the four frames draws one, and rather
 * than invent the exit these pages hand the reader back through the nav's
 * "Back to Portfolio" and the Footer, which ProjectPage renders around every
 * subpage anyway. Flagged to Flore as the one place the tier breaks with the
 * others; it is one entry in the content files away if she wants it.
 *
 * NO WIDTH ALTERNATION to check. `useWidthRuleCheck` is not called, for the
 * same reason CaseStudySnapshot skips it and then some: with exactly two
 * blocks on the page there is no sequence for Rule 1 to be about. Noted
 * rather than silently omitted — "the check isn't running" and "the check has
 * nothing to check" look identical from the outside.
 *
 * ---------------------------------------------------------------------------
 * THE HERO SITS ON THE PAGE'S NORMAL MEASURE, WHICH FIGMA DOES NOT.
 *
 * All four frames draw the hero content on a 1472-wide container at x=78,
 * while the columns below sit on the site's usual 1285 at x=171 — so the
 * title's left edge lands ~93px outside "What was essential". Nothing else in
 * the file does that, and it reads on the frame as a misalignment rather than
 * as a full-bleed hero.
 *
 * Both render through `Container` here, so the page has one left edge. This is
 * a deliberate divergence from the frames, flagged to Flore rather than
 * reproduced: an off-measure hero is the kind of thing that looks like a bug
 * in the build even when it was in the design.
 */

// The gap between the hero stage's bottom edge and the first column title.
//
// SPACE.break's rhythm (80 / 100 / 140), written as padding rather than reused
// as the gap class it is. Measured off the frames: 126px at 1622 (the stage
// ends at y=900, "What was essential" starts at y=1026), which the 140 end
// lands nearest.
//
// NOT CaseStudySnapshot's 40/60 opening gap, which was the first thing tried
// here and is the wrong step: 60 is the distance between ROWS OF ONE
// CATALOGUE, and this is the only boundary on the page — between the hero and
// the whole of its content. A break is what the frames draw and what the
// boundary is.
//
// The stage itself still ends earlier than the frames draw it: Figma leaves
// 187px of grey below the hero content where Frame spends 64/80/120. Frame's
// padding is shared with five built case studies and reviewed, so it is left
// alone and the NDA stage is correspondingly shorter — which also keeps the
// hero off the whole first screen (see the HERO_VERTICAL_RESERVE note in
// Hero.jsx for why that matters). Flagged rather than special-cased.
const SECTION_GAP = 'pt-space-80 xl:pt-space-100 2xl:pt-space-140'

// The two columns. `md`, the site's phone/tablet boundary (see Nav.jsx) —
// below it they stack, since a 40-gap two-up at phone width would leave each
// column too narrow for an 18px measure.
//
// EVEN, because the frames draw them even (622.5 + 40 + 622.5 = 1285). The
// columns also carry `max-w-[720px]` in Figma, which is dead weight at every
// width the site actually renders — a flex-1 column in the 1184 content box
// resolves to 572 — so it is not reproduced here.
const COLUMN_GRID = 'grid grid-cols-1 gap-space-40 md:grid-cols-2 md:gap-space-40'

/**
 * One block of a column's body.
 *
 * A local renderer rather than `Prose`, following the precedent CaseStudySnapshot
 * set with its own `RichText`: Prose is built for the two long case studies and
 * carries machinery this tier has no use for (four block types, and the
 * `introducesNext` colon rule that tightens the gap after an introducing
 * line — which would fire on every one of the bold lead-ins below and collapse
 * the list's spacing). Bending it would mean two new props serving one caller.
 *
 * `text-body`, not Prose's `text-body-lg`: the frames set these paragraphs as
 * `Desktop/body` (18), one step below the case studies' 20. That is the tier
 * showing through in the type, so it is carried over rather than normalised.
 *
 * Inline emphasis goes through the shared `emphasise`, so `**Scale:**` renders
 * as the site's semibold-600 emphasis. Figma draws the lead-ins at Bold 700;
 * 600 is a settled site-wide decision (see the note in emphasis.jsx — 700 read
 * as a heading against body copy), and one tier is not the place to reopen it.
 */
function ColumnBlock({ block }) {
  if (block.type === 'list') {
    return (
      // `list-outside` with left padding, matching Prose: with markers inside
      // the content box a wrapped line runs back under its own bullet, and
      // every item here wraps.
      //
      // gap 8, not Prose's 12. The frames run these items at zero gap, on
      // plain `mb-0` list items; 8 is the nearest step that keeps the items
      // reading as one list while still separating the wrapped ones. Zero was
      // tried and the multi-line items ran together.
      <ul className="m-0 flex list-outside list-disc flex-col gap-space-8 pl-space-24">
        {block.items.map((item) => (
          <li key={item} className="text-body font-normal">
            {emphasise(item)}
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === 'p') {
    return <p className="m-0 text-body font-normal">{emphasise(block.text)}</p>
  }

  throw new Error(`CaseStudyNda: unknown block type "${block.type}". Expected p or list.`)
}

export default function CaseStudyNda({ data }) {
  return (
    <article data-component="case-study-nda" data-slug={data.slug}>
      <Frame
        {...data.frame}
        // The display width is the TIER's, not the page's — see MEDIA_WIDTH.ndaHero.
        // Merged over the content file's media so a page could still override it,
        // but none does.
        media={{ maxWidth: MEDIA_WIDTH.ndaHero, ...data.frame.media }}
      />

      <div className={SECTION_GAP}>
        <Block width="wide" className={COLUMN_GRID}>
          {data.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-space-24">
              {/* `text-h2` at semibold, the same call CaseStudySnapshot's view
                  titles make and for the same reason: the frames set these as
                  Desktop/h2 (32), and the code's `text-h2` tops out at 28
                  because Flore diverged it from Figma on 2026-08-04. Adding a
                  ninth size for one tier is worse than using the step that
                  exists. Not `SectionHeader`, which is fixed at text-h1/bold
                  (36) — that is the long case studies' section-header step, and
                  these titles sit below it in the frames. */}
              <h2 className="m-0 text-h2 font-semibold text-text-primary">{column.title}</h2>
              {column.body.map((block, index) => (
                // Index as key: two blocks in a column can legitimately be
                // equal strings, and the array is static per render.
                <ColumnBlock key={index} block={block} />
              ))}
            </div>
          ))}
        </Block>
      </div>
    </article>
  )
}
