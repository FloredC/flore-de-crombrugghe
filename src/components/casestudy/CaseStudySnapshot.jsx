import Block from './Block'
import Frame from './Frame'
import Media from './Media'
import Onward from './Onward'
import SectionHeader from './SectionHeader'
import { getProjectBySlug } from '../../lib/content'
import { ARTIFAKT } from '../../lib/caseStudyLayout'

/**
 * The PROJECT SNAPSHOT layout — the third tier, below the two case studies.
 *
 * Third entry in ProjectPage's LAYOUTS registry, and the first one that is
 * meant to serve MORE THAN ONE PAGE: Sinomocene and Roche are next, and the
 * whole point of the tier is that the three are structurally identical and
 * differ only in content. So unlike CaseStudy (PitchPivot) and
 * CaseStudyArtifakt, nothing here may be keyed on slug — anything a snapshot
 * needs to vary has to arrive as data.
 *
 * The shape it renders, from the Figma frame (node 4939:5039):
 *
 *   Frame          the shared hero, with the snapshot tier's own stage colour
 *   What           prose beside a supporting image
 *   Views          N titled rows, each a pair of captioned screenshots
 *   Onward         the shared exit
 *
 * ---------------------------------------------------------------------------
 * THIS PAGE OPTS OUT OF RULE 1, AND THAT IS THE DESIGN, NOT AN OVERSIGHT.
 *
 * The case-study vocabulary's first rule is that no two consecutive blocks
 * share a width — the alternation is what gives those pages their rhythm, and
 * CaseStudy.jsx enforces it in dev by reading the rendered DOM back.
 *
 * A snapshot's three view rows are the same width three times running, on
 * purpose. They are a CATALOGUE, not an argument: six comparable things shown
 * at comparable size, where varying the width would imply one view matters more
 * than another. Rule 1 exists to keep a long argued page from flattening into a
 * scroll; it has nothing to enforce on a page whose whole content is a grid.
 *
 * So `useWidthRuleCheck` is deliberately NOT called here. Noted rather than
 * silently omitted, because "the check isn't running" and "the check doesn't
 * apply" look identical from the outside.
 *
 * Rule 2 (side-by-side at most once per page) is out too, and more heavily —
 * the hero, the What section and all three view rows are two-column. Same
 * reasoning: the pairing IS the content here.
 */

// The vertical rhythm between sections.
//
// NOT `SPACE.break` (80/100/140), which is the case studies' chapter gap. The
// snapshot frame runs its sections 60 apart, and that is a real difference in
// kind rather than a slip to normalise: a case study separates arguments, which
// need room to land, while a snapshot separates rows of a catalogue, which read
// better close together. Using `break` here made the page feel like a case
// study with the words removed.
//
// Scaled down rather than flat, matching how every other stack on the site
// behaves below the desktop frame.
const SECTION_GAP = 'gap-space-40 xl:gap-space-60'

// The two-column split used by every view row: EVEN, because the frame draws
// the pairs at 621.5 + 40 + 621.5 = 1283. Two comparable screenshots shown at
// comparable size is the whole premise of the catalogue.
//
// `md`, the site's established phone/tablet boundary (see Nav.jsx) — below it
// everything stacks, since two 572-wide screenshots side by side stop being
// readable well before they stop fitting.
const PAIR_GRID = 'grid grid-cols-1 gap-space-24 md:grid-cols-2 md:gap-space-40'

// The What section is UNEVEN, and was wrong until 2026-08-26: it rendered
// through PAIR_GRID at 50/50 while the frame draws 720 + 40 + 525 = 1285
// (node 4940:6514). The icons column was therefore ~9% too wide, which is part
// of why Flore read the icons as too big on the page.
//
// `fr` units carrying Figma's own two numbers rather than a computed
// percentage pair: the ratio then reproduces exactly at any container width,
// and the next person can see where 720 and 525 came from without doing
// arithmetic backwards.
const WHAT_GRID = 'grid grid-cols-1 gap-space-24 md:grid-cols-[720fr_525fr] md:gap-space-40'

/**
 * One screenshot with its caption underneath.
 *
 * A local component rather than `Media`'s own `caption` prop, which renders
 * centred `body-sm` in `text-secondary` — right for the homepage cards, wrong
 * here. The frame draws these captions left-aligned at `body` in
 * `text-primary`, reading as a sentence about the image rather than a label on
 * it, so this owns the figcaption.
 */
function View({ src, alt, caption, aspect }) {
  return (
    <figure className="m-0 flex flex-col gap-space-16">
      <Media
        kind="image"
        src={src}
        alt={alt}
        placeholderAspect={aspect}
        // radius 12 + `Shadow universal`, both read off the frame. The shadow
        // is what lifts a white-backgrounded screenshot off a white page —
        // without it these six read as holes rather than objects.
        radius="rounded-radius-12"
        className="shadow-universal"
      />
      <figcaption className="text-body font-normal text-text-primary">{caption}</figcaption>
    </figure>
  )
}

export default function CaseStudySnapshot({ data }) {
  const nextProject = data.onward?.slug ? getProjectBySlug(data.onward.slug) : null

  return (
    <article data-component="case-study-snapshot" data-slug={data.slug}>
      <Frame {...data.frame} />

      <div className={`flex flex-col ${SECTION_GAP} pt-space-40 xl:pt-space-60`}>
        {/* WHAT — prose beside its supporting image.
            The text column takes the Artifakt page's 720 measure rather than
            the case studies' 62ch `narrow`: the frame draws this container at
            720 (node 4940:5453), the same number Artifakt uses, so the site
            already has this measure and does not need a third one. */}
        <Block width="wide" className={`${WHAT_GRID} items-center`}>
          <div className={`flex flex-col gap-space-24 ${ARTIFAKT.prose}`}>
            <SectionHeader title={data.what.title} />
            {data.what.body.map((paragraph) => (
              <p key={paragraph} className="m-0 text-body-lg font-normal">
                {paragraph}
              </p>
            ))}
          </div>
          {/* THE ICONS ARE INSET, not full-bleed in their column — Flore added
              the padding in Figma on 2026-08-26 (node 4957:6776) to bring them
              down in size. The frame is 525 wide and holds the artwork at 397,
              so 64 of padding either side.
              A PERCENTAGE, not `px-space-64`: 64/525 = 12.19%, and expressing
              it as a proportion means the inset keeps its relationship to the
              artwork at every width instead of eating the column on a phone,
              where a fixed 64 each side would leave the icons 215px wide. */}
          <div className="px-[12.19%]">
            <Media {...data.what.media} radius="rounded-none" />
          </div>
        </Block>

        {/* THE VIEWS — one titled row per pair.
            `text-h2` at semibold, NOT the frame's Desktop/h2 (32). The code's
            `text-h2` token tops out at 28 because Flore deliberately diverged
            it from Figma on 2026-08-04 for the card titles, so there is no 32
            in the scale and adding a ninth size for one page is worse than
            using the step that already exists. What matters structurally is
            that the row title sits BELOW the section title (36) and above the
            body — 28 holds that relationship, which 36 would flatten.
            Flagged to Flore. */}
        {data.views.map((row) => (
          <Block key={row.title} width="wide" className="flex flex-col gap-space-24 xl:gap-space-40">
            <h2 className="m-0 text-h2 font-semibold text-text-primary">{row.title}</h2>
            <div className={PAIR_GRID}>
              {row.items.map((item) => (
                <View key={item.src} {...item} aspect={data.viewAspect} />
              ))}
            </div>
          </Block>
        ))}

        <Onward
          heading={data.onward.heading}
          project={nextProject}
          contact={data.onward.contact}
        />
      </div>
    </article>
  )
}
