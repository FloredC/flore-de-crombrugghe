import Container from '../Container'
import Reveal from '../Reveal'
import ButtonLink from '../ButtonLink'
import ContactEmailButton from '../ContactEmailButton'
import { ArrowRightIcon, ExternalLinkIcon } from '../icons'
import Frame from './Frame'
import SectionHeader from './SectionHeader'
import Prose from './Prose'
import Media from './Media'
import MediaStage from './MediaStage'
import AvatarNote from './AvatarNote'
import ProcessLogCards from './ProcessLogCards'
import PipelineDiagram from './PipelineDiagram'
import CaseStudyChapters from './CaseStudyChapters'
import CaseStudyContact from './CaseStudyContact'
import { ARTIFAKT, SPACE } from '../../lib/caseStudyLayout'
import { ARTIFAKT_CHAPTERS, CASE_STUDY_OUTRO } from '../../lib/chapters'
import { contactSection } from '../../lib/content'

/**
 * The Artifakt case study page.
 *
 * WHY THIS IS A SECOND COMPOSITION AND NOT A BRANCH INSIDE CaseStudy.jsx
 *
 * `CaseStudy.jsx` is PitchPivot's page. It reads named slots -- `data.what`,
 * `data.turningPoint`, `data.features`, `data.takeaways`, `data.process` --
 * and renders a fixed sequence of typed evidence components (StatGrid, three
 * QuoteCards, FeatureBlock pairs, RankedBars, the Guide). Artifakt has none of
 * those shapes. Forcing it through would mean naming its "How I worked"
 * section `turningPoint` to satisfy a key, which is a lie in the data model
 * that every future reader has to decode.
 *
 * So the two pages share the VISUAL SYSTEM and not the composition, which is
 * what Flore actually asked for (2026-08-21: "I was talking more about the
 * visual structure and the spaces"). Everything that decides how the page
 * looks and breathes is imported: Frame, SectionHeader, Media, Container,
 * ButtonLink, and the spacing tokens. What differs is only the
 * order and the section shapes -- which is exactly the part that genuinely
 * differs in the design file.
 *
 * The concrete payoff: nothing here can regress the shipped PitchPivot page,
 * and a spacing fix in a shared primitive still reaches both.
 *
 * RULE 1 DOES NOT APPLY HERE, deliberately. PitchPivot's page enforces "no two
 * consecutive blocks share a width" and throws in dev if they do -- the rhythm
 * comes from the content column stepping in and out. Artifakt's frame answers
 * the same question the other way: every text container sits at x=171 at a
 * fixed 720 measure all the way down (nodes 4897:4528, 4897:4559, 4897:4565,
 * 4897:4584 ... all identical), and the pacing comes from the MEDIA instead --
 * 1282 full-width stages, a 720 stage, 523 side-by-sides, one radius-60
 * showcase. Applying Rule 1 here would fire on the second section and force a
 * rhythm the design does not have. Flore's call, 2026-08-21.
 *
 * THE 720 MEASURE is wider than PitchPivot's `narrow` (62ch, ~560). It is
 * sampled, it is consistent across every section of the frame, and it is
 * flagged as a second reading measure on the site rather than reconciled --
 * see ARTIFAKT.prose in caseStudyLayout.js.
 */

// The three process-log links, and the six cards, are designed but have no
// destinations yet (Flore, 2026-08-21: "these are the links to the
// documentation. we can do that later").
//
// Rendered as PLAIN TEXT with the arrow, not as an <a href="#"> and not as a
// disabled-looking control: an anchor with no destination is either
// unfocusable dead chrome or a promise the page can't keep, and a greyed-out
// row invents a "disabled" state Figma never drew. As plain text the page
// looks exactly as designed and lies about nothing.
//
// When the URLs land, adding `href` to the `link` object in the content file
// turns this into a real tertiary ButtonLink with no layout change -- the
// markup below is already the same shape. That is why the branch exists now.
function ProcessLogLink({ label, href }) {
  const content = (
    <>
      {label}
      <ArrowRightIcon width={20} height={20} />
    </>
  )

  if (href) {
    return (
      // `to`, not `href`: these are in-app routes now, so React Router handles
      // them and the reader keeps their history. Same tab -- the log page
      // carries its own "Back to Artifakt", so a new tab would strand them
      // with two ways back and neither being the browser's.
      <ButtonLink variant="tertiary" to={href}>
        {content}
      </ButtonLink>
    )
  }

  return (
    <span
      data-pending-link
      className="inline-flex items-center gap-1 text-body font-bold tracking-[0.02em]"
    >
      {content}
    </span>
  )
}

// One section's text column: prose, and the optional process-log link.
//
// THE TITLE IS NO LONGER IN HERE for `split` sections -- Flore's layout pass,
// 2026-08-24. Figma now draws the section title across the FULL content column
// (1283) with the two-column row beneath it (e.g. nodes 4897:4566, 4897:4585,
// 4897:4596), rather than sitting inside the narrow text column. So the title
// is hoisted into Section and this renders body copy only when it is a column
// of a split. Stack sections still pass a title and get the old behaviour.
function SectionText({ title, prose, link, measure = ARTIFAKT.prose }) {
  return (
    <div className={`flex w-full flex-col gap-space-24 ${measure}`}>
      {title && <SectionHeader title={title} />}
      {prose && <Prose blocks={prose} />}
      {link && <ProcessLogLink {...link} />}
    </div>
  )
}

// The media placements that are NOT a split column. `split` is handled in
// Section directly, since it is a row rather than a width.
const MEDIA_LAYOUT = {
  // 1282 in Figma == the full content column. No cap: `wide` on this site
  // means "whatever Container gives you", so it can't drift from the
  // homepage's content width by carrying a duplicate number.
  full: 'w-full',
  // Full width, and the only place on the page with a large radius.
  showcase: 'w-full',
}

// SCREENCAST: the one asset on this page that is NOT a tinted MediaStage.
//
// Every other asset sits on a `surface-yellow` panel with the caption inside
// it. The screencast's own Figma container (node 4897:4548) binds
// Colors/Surface/canvas, Radius/24, and puts its caption BELOW the box -- all
// three different. That is not an inconsistency in the design, it is a borrowed
// component: those are exactly the values PitchPivot's FeatureBlock media uses,
// and the caption is even the same format ("state 21.08.26" against that page's
// "'Impact Framing' state 28.10.25"). It is the site's product-screencast
// treatment, reused, so it renders through plain `Media` rather than being
// re-skinned to match its neighbours here.
const SCREENCAST_CLASS = 'border border-text-primary bg-surface-canvas'

// SCREENCAST SIZE: capped by HEIGHT, not width -- Flore, 2026-08-21 ("make the
// video smaller so that it fits 100vh").
//
// The asset is 1206x2622, a ratio of 0.46, so a width cap sets the height four
// times over: at Figma's 400 wide it drew 870 tall and filled a laptop viewport
// on its own. Capping the width alone cannot express "fits on screen", because
// the height it produces depends entirely on the file's proportions.
//
// So the real constraint is the height and the width is DERIVED from it:
// `80svh * (1206/2622)` is the width at which the video is exactly 80svh tall.
// `min()` keeps Figma's 400 as the ceiling, so this only ever makes the video
// smaller than designed, never larger.
//
// `svh` not `vh`, the same call the map's crop viewport made (see
// PanZoomContainer): `vh` tracks the LARGEST mobile viewport and changes as the
// browser chrome collapses during scroll, which would resize the video
// mid-scroll. `svh` is the small-viewport unit and holds still.
const SCREENCAST_MAX_WIDTH = 'min(400px, calc(80svh * 1206 / 2622))'

// EQUAL COLUMNS -- Flore, 2026-08-24: "text and image are on an equal width
// (fill)".
//
// This replaces a `beside` layout where the media took a fixed 523 and the text
// took whatever was left. Figma now splits the row down the middle: the text
// container and the media container are both ~590-621 of a 1283 row with a
// 40-60 gap (nodes 4928:2854, 4930:3000, 4929:2893, 4929:2907, 4930:2993).
//
// `grid-cols-2` rather than two flex bases, because "equal" is the rule and a
// grid states it once. At the 1184 content width each column resolves to 572,
// against Figma's ~600 -- the difference is entirely our 1184 content column
// against their 1283, not a divergence in the split.
//
// `items-center`: Figma vertically centres the media in most of these rows
// (the reveal container sits at y=138 of a 724-tall row, user testing at y=138
// of 750). The media is the shorter element in every one, so centring reads as
// deliberate where top-pinning would leave a hole under it.
//
// Stacks below `lg`. At tablet widths neither column has room, and the prose is
// the one that has to stay readable.
const SPLIT_ROW = 'grid grid-cols-1 items-center gap-space-40 lg:grid-cols-2'

// Which of the eleven sections a chapter starts on. Derived from the chapter
// config rather than listed here, so the two cannot drift: adding a chapter
// moves the marker with it, and a config pointing at a section id this page
// does not render simply marks nothing (and the nav's scrollspy treats that
// chapter as unreachable) instead of silently anchoring the wrong section.
const CHAPTER_ANCHOR_IDS = new Set(ARTIFAKT_CHAPTERS.chapters.map((chapter) => chapter.id))

function Section({ section, isChapterAnchor }) {
  const { title, note, prose, link, media, extraMedia, pipeline, logs, cta } = section
  const split = media?.layout === 'split'

  // WHERE THE TITLE SITS, derived rather than declared per section.
  //
  // Figma's rule, read off the frame: a section with a Guide puts its title
  // across the full content column, because the Guide sits beneath it spanning
  // the same width (nodes 4897:4566 + 4928:2830, 4897:4585 + 4929:2894, and so
  // on). A section WITHOUT a Guide keeps the title inside its text column --
  // "What it is" is a split row and still draws its title at the column's 621.5
  // (node 4897:4538 is a child of the 4897:4537 text container).
  //
  // Derived from `note` instead of a per-section flag so the two can't drift:
  // adding a Guide to a section moves its title, which is what the frame would
  // do too. If that correlation ever breaks in the design, this becomes an
  // explicit field -- flagged rather than assumed permanent.
  const fullWidthTitle = split && Boolean(note)

  // The media in a split column is usually a tinted stage, but the screencast
  // keeps the site's product-video treatment instead (see SCREENCAST_CLASS).
  //
  // GUARDED ON `split`, not just on `media?.plain`. Computing this
  // unconditionally called stageProps(undefined) for the three sections that
  // have no media at all (reflection, how-i-worked, and the split-less what),
  // which threw on destructuring and blanked the whole page. Worth recording
  // because `npm run build` passed clean -- an undefined identifier and a
  // runtime destructure both survive the bundler and only appear in a browser.
  const splitMedia = !split ? null : media.plain ? (
    // `mx-auto`: Figma centres the video inside its half of the row (the
    // 400-wide video+label sits at x=110.75 of the 621.5 wrapper, node
    // 4928:2802). Left-aligned it drifted away from the column it shares.
    <div className="mx-auto w-full" style={{ maxWidth: SCREENCAST_MAX_WIDTH }}>
      <Media {...stageProps(media)} className={SCREENCAST_CLASS} />
    </div>
  ) : (
    <MediaStage {...stageProps(media)} className="w-full" radius={media?.radius} tint={media?.tint} />
  )

  return (
    // THE SECTION ID IS NOW A REAL ANCHOR, added with the chapter nav.
    //
    // These ids were already declared in the content file and already treated
    // as anchors there ("The `id` stays `how-i-worked`: it is a stable anchor,
    // not a label"), but only ever reached the DOM as `data-section` -- so
    // nothing could actually link to them. Emitting `id` as well makes the
    // page's existing structure addressable without inventing a parallel set
    // of anchors, which is what let the chapter nav point at real sections
    // rather than at markers added for its benefit.
    //
    // `data-chapter-anchor` is separate from `id` on purpose: it marks the
    // five sections a chapter STARTS on, and its only job is to carry the
    // larger `scroll-margin-top` from globals.css. The other six sections stay
    // on the site-wide 120px, because they are not jump destinations.
    // THE SECTION IS THE REVEAL GROUP. It stays a real <section> with its own
    // id -- `Reveal` renders whatever tag it is given, which matters here
    // because the chapter nav and the progress line both anchor on these
    // elements and would lose their targets to a wrapper div.
    //
    // Long-form settings, set once in globals.css rather than here: 8px of
    // travel instead of 12, and no stagger between blocks. Reading wants the
    // page to hold still; the Guide is the deliberate exception and keeps the
    // full treatment.
    <Reveal
      as="section"
      id={section.id}
      data-section={section.id}
      data-chapter-anchor={isChapterAnchor || undefined}
    >
      {/* The whole section is one column: full-width title, then the Guide,
          then the content row. `gap-space-40` is the step Figma puts between
          all three (title ends y=90, bubble starts y=130, row starts y=308
          with the bubble 138 tall). */}
      <Container className="flex flex-col gap-space-40">
        {/* FULL-WIDTH TITLE on split sections. On stack sections the title
            stays inside the text column, where Figma still draws it. */}
        {title && fullWidthTitle && <SectionHeader title={title} />}

        {/* The Guide. Right-aligned to the content edge by AvatarNote itself,
            which is where Figma puts it (the 520-wide instance sits at x=763 of
            the 1283 row, so its right edge and the page margin are one line).
            Reuses the PitchPivot component unchanged -- Flore asked for "the
            avatar idea that is present on pitchpivot as well", so this is
            deliberately the same component and not a lookalike. */}
        {note && <AvatarNote body={note} />}

        {split ? (
          <div className={SPLIT_ROW}>
            {/* `measure=""` drops the 720 cap: inside a split the column IS the
                measure, and a cap wider than the column would do nothing except
                mislead the next reader. The title rides along here whenever it
                is not hoisted above. */}
            <SectionText title={fullWidthTitle ? null : title} prose={prose} link={link} measure="" />
            {splitMedia}
          </div>
        ) : (
          <>
            {(title || prose || link) && (
              <SectionText
                title={title}
                prose={prose}
                link={link}
                // A section can ask for the narrower closing measure. See
                // ARTIFAKT.proseNarrow.
                measure={section.measure === 'narrow' ? ARTIFAKT.proseNarrow : undefined}
              />
            )}
            {media && (
              <MediaStage
                {...stageProps(media)}
                className={MEDIA_LAYOUT[media.layout]}
                // The showcase panel is the page's one large radius, sampled
                // from the gallery frame (node 4897:4639).
                radius={media.layout === 'showcase' ? 'rounded-radius-60' : media.radius}
                tint={media.tint}
              />
            )}
          </>
        )}

        {/* A second, full-width asset BELOW the split row. Today this is the
            artist roster under "What it is" (node 4931:4526), which Figma puts
            inside that section rather than in one of its own.
            Separate from `media` rather than making `media` an array: the two
            are different jobs -- `media` is the split row's right column and
            `extraMedia` spans the section under it -- and an array would make
            the placement depend on index position. */}
        {extraMedia && (
          <MediaStage
            {...stageProps(extraMedia)}
            className={MEDIA_LAYOUT[extraMedia.layout]}
            radius={extraMedia.radius}
            tint={extraMedia.tint}
          />
        )}

        {/* The reveal section's pipeline diagram. Full width, below the split
            row -- Figma keeps it outside the row (node 4897:4571 sits at the
            section's own x=171, not in a column).

            A REAL COMPONENT, not an iframe, since 2026-08-25. It was
            LanguageRiverEmbed pointing at a standalone HTML document, and the
            step previews were clipped by the frame's bottom edge -- an iframe
            is a clipping boundary and a popover cannot escape one. See
            PipelineDiagram.jsx. */}
        {pipeline && <PipelineDiagram {...pipeline} />}

        {logs && <ProcessLogCards logs={logs} />}

        {/* A section-closing CTA. Only the Process section uses one today (the
            repo link) -- see the note in the content file for why it sits here
            and not in the hero.

            Secondary and full-size, from node 5022:9636, and left-aligned on
            the section's own margin like everything else in the column.
            `self-start` because Container is a flex column: without it the
            button stretches to the full content width. */}
        {cta && (
          <ButtonLink
            variant="secondary"
            className="self-start"
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {cta.label}
            <ExternalLinkIcon width={20} height={20} />
          </ButtonLink>
        )}
      </Container>
    </Reveal>
  )
}

// `layout` is this file's concern, not Media's -- strip it before the rest of
// the media object is spread onto MediaStage, so an unknown DOM attribute
// never reaches an element.
function stageProps({ layout, plain, radius, tint, ...rest }) {
  return rest
}

export default function CaseStudyArtifakt({ data }) {
  // Looked up from the real project list rather than duplicated into the
  // content file, so the next project's title, tint, thumbnail and CTA are the
  // same objects the homepage renders and can't drift from it.
  // `nextProject` is gone -- see the note on the exit block below.

  return (
    // `SPACE.break` rather than a flat 80 -- Flore, 2026-08-25: the chapters
    // needed more air, matching PitchPivot. That step is 80 at small sizes and
    // 140 from `xl`, so the two case studies now breathe identically and a
    // future change to the rhythm reaches both from one place.
    //
    // The flat 80 came from the Figma frame, which draws 40 of padding on each
    // side of a section. Deliberately overridden in code, not in the design.
    <article data-component="case-study" data-slug={data.slug} className={`flex flex-col ${SPACE.break}`}>
      <Frame {...data.frame} />

      {data.body.map((section) => (
        <Section
          key={section.id}
          section={section}
          isChapterAnchor={CHAPTER_ANCHOR_IDS.has(section.id)}
        />
      ))}

      {/* The page's exit -- back to Figma's own shape, which ends on the
          contact block alone.

          THE NEXT-PROJECT CARD WAS REMOVED 2026-08-27. It was Flore's addition
          (2026-08-21) and pointed at Welcome to my island; moving between
          projects is now `ProjectNavigation`, the prev/next band ProjectPage
          renders on every subpage below <main>. Keeping a curated card here
          would answer the same question twice on one screen -- and with a
          different answer, since the band follows the Work grid's order rather
          than a hand-picked slug.

          The contact block stays and is still not `Onward`: this page's
          version is the two-button one (LinkedIn + copy-to-clipboard email),
          matching the frame and the homepage's Contact section, where Onward's
          is a prompt and one CTA. */}
      {/* The page's exit. EXTRACTED to CaseStudyContact 2026-08-30 -- this was
          written inline here, and it is now the block every subpage ends on, so
          it had to stop being one page's markup. Nothing about what it renders
          changed; it carries the same id, the same copy (from this page's
          content file) and the same two buttons.

          Still not `Onward`: this page's version is the two-button one
          (LinkedIn + copy-to-clipboard email), where Onward's was a prompt and
          one CTA that navigated away to the homepage. */}
      <CaseStudyContact {...data.contact} />

      {/* Both floating controls. Last in the article so they are last in the
          tab order too -- a reader tabbing through the page reaches the content
          before the shortcut to it, and the global nav (rendered by ProjectPage
          above <main>) still comes first of all. */}
      <CaseStudyChapters config={ARTIFAKT_CHAPTERS} />
    </article>
  )
}
