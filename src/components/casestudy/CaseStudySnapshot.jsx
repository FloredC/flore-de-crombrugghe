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

// radius 12 + `Shadow universal`, both read off the frames. The shadow is what
// lifts a white-backgrounded screenshot off a white page — without it these
// read as holes rather than objects. Shared by stills and video embeds so the
// two can't drift apart.
const FRAME_CHROME = 'overflow-hidden rounded-radius-12 shadow-universal'

/**
 * A Vimeo embed, sized by the video's own aspect rather than the design's box.
 *
 * The frame draws a 1283x596 placeholder rectangle (ratio 2.15) with the words
 * "Video embed" in the middle, which is a stand-in for the player, not a claim
 * about its shape. The real video is 1280x720 — plain 16:9, confirmed against
 * Vimeo's oEmbed endpoint rather than assumed. Reserving the box at 2.15 would
 * letterbox the player inside its own rounded frame.
 *
 * `dnt=1` is Vimeo's Do Not Track parameter: it stops the player setting
 * tracking cookies and reporting analytics. The site has no cookie banner, so
 * an embed that quietly starts tracking visitors would be a consent problem the
 * page has no way to answer. This keeps it to a plain video player.
 *
 * `loading="lazy"` is right here, unlike on the hero image — the embed is well
 * below the fold, and it pulls in the whole Vimeo player.
 */
function VideoEmbed({ videoId, title }) {
  return (
    <div className={`relative aspect-video w-full ${FRAME_CHROME}`}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?dnt=1`}
        title={title}
        loading="lazy"
        allow="fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  )
}

/**
 * One piece of evidence with its caption underneath — a still or a video embed.
 *
 * A local component rather than `Media`'s own `caption` prop, which renders
 * centred `body-sm` in `text-secondary` — right for the homepage cards, wrong
 * here. The frames draw these captions left-aligned at `body` in
 * `text-primary`, reading as a sentence about the image rather than a label on
 * it, so this owns the figcaption.
 */
function View({ kind = 'image', src, alt, caption, aspect, videoId, title, label }) {
  return (
    <figure className="m-0 flex flex-col gap-space-16">
      {kind === 'video' ? (
        <VideoEmbed videoId={videoId} title={title} />
      ) : (
        <Media
          kind="image"
          src={src}
          alt={alt}
          label={label}
          placeholderAspect={aspect}
          radius="rounded-radius-12"
          className="shadow-universal"
        />
      )}
      {caption && (
        // CAPTION MEASURE: the frames draw every caption at 621.5 — half the
        // content width — even under a full-bleed item. A caption running the
        // full 1184 under the video would be a 130-character line, well past a
        // comfortable measure, so the cap is kept rather than let the caption
        // inherit its item's width.
        <figcaption className="max-w-[621px] text-body font-normal text-text-primary">
          {caption}
        </figcaption>
      )}
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
            {/* OPTIONAL. Teamchatviz titles this section ("Slack Stats
                Visualised"); Sinomocene hides the title layer (node 4940:6703,
                `hidden`) and opens straight into the prose, whose own first
                line is doing the work a heading would. */}
            {data.what.title && <SectionHeader title={data.what.title} />}
            {data.what.body.map((paragraph) => (
              <p key={paragraph} className="m-0 text-body-lg font-normal">
                {paragraph}
              </p>
            ))}
          </div>
          {/* THE SUPPORTING IMAGE IS INSET in its column, by an amount each
              page sets for itself — Flore pads these in Figma to bring the
              artwork down in size, and the two pages use different values
              (Teamchatviz 64 of 525, Sinomocene 72 of 525).
              A PERCENTAGE, not a `px-space-N` class, and not a Tailwind
              arbitrary value: expressed as a proportion the inset keeps its
              relationship to the artwork at every width, where a fixed 64 each
              side would eat the column on a phone and leave the artwork ~215px
              wide. An inline style rather than a class because the value is
              content, and Tailwind cannot generate a class from a runtime
              string -- `px-[${'{'}inset{'}'}]` would silently produce nothing. */}
          <div style={{ paddingInline: data.what.mediaInset }}>
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
        {data.views.map((row, index) => (
          <Block
            // Rows are positional and a title is optional, so the title cannot
            // be the key -- Sinomocene has two untitled rows, which would
            // collide on `undefined`.
            key={row.title ?? `row-${index}`}
            width="wide"
            className="flex flex-col gap-space-24 xl:gap-space-40"
          >
            {row.title && (
              <h2 className="m-0 text-h2 font-semibold text-text-primary">{row.title}</h2>
            )}
            {/* ONE ITEM RUNS FULL WIDTH, two share the row. Sinomocene's video
                is a single full-width item under "How it works" (node
                4940:6711 spans the whole 1283 container) while its stills come
                in pairs, so the row's own length decides the grid rather than a
                flag in the content file that could disagree with it. */}
            <div className={row.items.length === 1 ? '' : PAIR_GRID}>
              {row.items.map((item, i) => (
                <View key={item.src ?? item.videoId ?? i} {...item} aspect={item.aspect ?? data.viewAspect} />
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
