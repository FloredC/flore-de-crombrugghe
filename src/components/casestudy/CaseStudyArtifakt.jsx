import Container from '../Container'
import ProjectCard from '../ProjectCard'
import ButtonLink from '../ButtonLink'
import ContactEmailButton from '../ContactEmailButton'
import { ArrowRightIcon } from '../icons'
import Frame from './Frame'
import SectionHeader from './SectionHeader'
import Prose from './Prose'
import Media from './Media'
import MediaStage from './MediaStage'
import ProcessLogCards from './ProcessLogCards'
import { ARTIFAKT } from '../../lib/caseStudyLayout'
import { getProjectBySlug, contactSection } from '../../lib/content'

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
 * ButtonLink, ProjectCard, and the spacing tokens. What differs is only the
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
      <ButtonLink variant="tertiary" href={href} target="_blank" rel="noopener noreferrer">
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

// One section's text column: title, prose, and the optional process-log link.
// Capped at the page's 720 measure wherever it appears -- including inside the
// side-by-side layout, where it is the left column.
function SectionText({ title, prose, link }) {
  return (
    <div className={`flex w-full flex-col gap-space-24 ${ARTIFAKT.prose}`}>
      {title && <SectionHeader title={title} />}
      {prose && <Prose blocks={prose} />}
      {link && <ProcessLogLink {...link} />}
    </div>
  )
}

// The media placements the frame uses. Each is a width and an alignment;
// MediaStage supplies the tinted panel and the caption, so the treatment stays
// identical and only the box changes.
//
// `aside-right` is the exception and is NOT in this map -- see SCREENCAST below.
const MEDIA_LAYOUT = {
  // 1282 in Figma == the full content column. No cap: `wide` on this site
  // means "whatever Container gives you", so it can't drift from the
  // homepage's content width by carrying a duplicate number.
  full: 'w-full',
  // 720, the same measure as the prose above it, so the stage lines up with
  // the text on both edges rather than only the left.
  'text-width': ARTIFAKT.prose,
  // Full width, and the only place on the page with a large radius.
  showcase: 'w-full',
}

// SCREENCAST: the one asset on this page that is NOT a tinted MediaStage.
//
// Caught on a re-read of the frame after the rest of the page was built, and
// worth recording because it looked right and was wrong. Every other asset here
// sits on a `surface-highlight` panel at radius 4 with the caption inside it.
// The screencast's own Figma container (node 4897:4548) binds
// Colors/Surface/canvas, Radius/24, and puts its caption BELOW the box (node
// 4897:4555, at y=674 outside the 666-tall container) -- all three different.
//
// That is not an inconsistency in the design, it is a borrowed component:
// those are exactly the values PitchPivot's FeatureBlock media uses, and the
// caption is even the same format ("state 21.08.26" against that page's
// "'Impact Framing' state 28.10.25"). It is the site's product-screencast
// treatment, reused. So this renders through plain `Media` with FeatureBlock's
// own class and Media's own caption slot, rather than being re-skinned to
// match its neighbours on this page.
const SCREENCAST_CLASS = 'border border-text-primary bg-surface-canvas'

// SCREENCAST SIZE: capped by HEIGHT, not width -- Flore, 2026-08-21 ("make the
// video smaller so that it fits 100vh").
//
// The asset is 1206x2622, a ratio of 0.46, so a width cap sets the height four
// times over: at Figma's 400 wide it drew 870 tall and filled a laptop viewport
// on its own. Capping the width alone can't express "fits on screen", because
// the height it produces depends entirely on the file's proportions -- the same
// 400 would be a squat box for a landscape asset.
//
// So the real constraint is the height, and the width is DERIVED from it:
// `80svh * (1206/2622)` is the width at which the video is exactly 80svh tall.
// `min()` keeps Figma's 400 as the ceiling, so this only ever makes the video
// smaller than designed, never larger -- on a very tall window it simply
// renders at 400 as drawn.
//
// 80, not 100: the caption sits below the frame and the section needs to read
// as part of a page rather than as a slide. At a 900px-tall window this lands
// the video at ~331x720 with the caption visible under it.
//
// `svh` not `vh`, the same call the map's crop viewport made (see
// PanZoomContainer): `vh` tracks the LARGEST mobile viewport and changes as the
// browser chrome collapses during scroll, which would resize the video mid-
// scroll. `svh` is the small-viewport unit and holds still.
const SCREENCAST_MAX_WIDTH = 'min(400px, calc(80svh * 1206 / 2622))'

// The two `beside` sections' media column.
//
// 523 is Figma's own width for both (nodes 4897:4601 / 4897:4612) and it was
// not being reached: the media took `flex-1` of whatever the 720 text column
// left, which at the 1184 content width is 424. Flore asked for the user-
// testing image to be bigger, 2026-08-21; setting the media to its designed
// width rather than a leftover share is what does that, and it fixes the
// against-the-defaults image in the same move -- they are one pattern and
// Figma draws them the same size, so sizing only one would split them.
//
// The TEXT is what flexes now instead. It keeps `max-w-[720px]` and simply
// resolves narrower here (1184 - 523 - 40 = 621), which is the right way round:
// the evidence has a designed size, the reading measure has a maximum.
const BESIDE_MEDIA = 'lg:w-[523px] lg:shrink-0'

function Section({ section }) {
  const { title, prose, link, media, embeds, logs } = section
  const beside = media?.layout === 'beside'

  return (
    <section data-section={section.id}>
      <Container>
        {beside ? (
          // The page's side-by-side. Text left, media right, matching the two
          // sections Figma draws this way (nodes 4897:4594 / 4897:4606) -- the
          // media is the shorter element in both, so `items-center` keeps it
          // optically level with the paragraph block rather than top-pinned.
          //
          // Stacks below `lg`: at tablet widths a 523 stage beside a 720
          // measure leaves neither enough room, and the prose is the thing
          // that must stay readable.
          <div className="flex flex-col gap-space-40 lg:flex-row lg:items-center lg:gap-space-40">
            <SectionText title={title} prose={prose} link={link} />
            <MediaStage {...stageProps(media)} className={`w-full ${BESIDE_MEDIA}`} />
          </div>
        ) : (
          <div className="flex flex-col gap-space-40">
            {(title || prose || link) && (
              <SectionText title={title} prose={prose} link={link} />
            )}

            {media?.layout === 'aside-right' ? (
              // 400 wide and pushed to the right margin (node 4897:4547).
              // `ml-auto` rather than a float or a grid: it is one item in a
              // column, and auto-margin is the one mechanism that doesn't need
              // a second element to align against.
              <div className="ml-auto w-full" style={{ maxWidth: SCREENCAST_MAX_WIDTH }}>
                <Media {...stageProps(media)} className={SCREENCAST_CLASS} />
              </div>
            ) : (
              media && (
                <MediaStage
                  {...stageProps(media)}
                  className={MEDIA_LAYOUT[media.layout]}
                  // The showcase panel is the page's one large radius, sampled
                  // from the gallery frame (node 4897:4639). Every other stage
                  // keeps MediaStage's default.
                  radius={media.layout === 'showcase' ? 'rounded-radius-60' : undefined}
                />
              )
            )}

            {/* The reveal section's two pipeline embeds. Same stage treatment
                as every other asset, each rendering the site's dashed
                ImagePlaceholder inside because no `src` is set yet. */}
            {embeds?.map((embed) => (
              <MediaStage
                key={embed.label}
                {...stageProps(embed)}
                className={MEDIA_LAYOUT[embed.layout]}
              />
            ))}

            {logs && <ProcessLogCards logs={logs} />}
          </div>
        )}
      </Container>
    </section>
  )
}

// `layout` is this file's concern, not Media's -- strip it before the rest of
// the media object is spread onto MediaStage, so an unknown DOM attribute
// never reaches an element.
function stageProps({ layout, ...rest }) {
  return rest
}

export default function CaseStudyArtifakt({ data }) {
  // Looked up from the real project list rather than duplicated into the
  // content file, so the next project's title, tint, thumbnail and CTA are the
  // same objects the homepage renders and can't drift from it.
  const nextProject = data.onward?.slug ? getProjectBySlug(data.onward.slug) : null

  return (
    <article data-component="case-study" data-slug={data.slug} className="flex flex-col gap-space-80">
      <Frame {...data.frame} />

      {data.body.map((section) => (
        <Section key={section.id} section={section} />
      ))}

      {/* The page's exit. Figma ends on the contact block alone; the
          next-project card is Flore's addition (2026-08-21) and points at
          Welcome to my city.

          Not the `Onward` component, which bundles a card with its own
          single-CTA contact block -- this page's contact block is the
          two-button one (LinkedIn + copy-to-clipboard email), matching the
          frame and the homepage's Contact section. Composing the two pieces
          here rather than adding a variant to Onward keeps that component
          exactly as PitchPivot needs it. */}
      <Container className="flex flex-col gap-space-64">
        {nextProject && (
          <div className="flex flex-col gap-space-40">
            {/* Matches Onward's own eyebrow treatment -- body-sm semibold
                secondary, no uppercase and no tracking, because every text
                style in the Figma file sets letterSpacing 0. */}
            <h2 className="m-0 text-body-sm font-semibold text-text-secondary">
              {data.onward.heading}
            </h2>
            {/* Capped rather than filling the column: a single project card
                stretched to 1184 stops reading as a card. `medium` is the
                2-up homepage variant, the closest match to this width. */}
            <div className="w-full max-w-[562px]">
              <ProjectCard project={nextProject} size="medium" />
            </div>
          </div>
        )}

        <div className="flex max-w-[846px] flex-col gap-space-16 border-t border-border-divider pt-space-64">
          <h2 className="m-0 text-h2 font-semibold">{data.contact.heading}</h2>
          <p className="m-0 text-body-lg font-normal">{data.contact.description}</p>
          {/* The email and LinkedIn URL come from contact.mdx, not from this
              page's content file: they are facts about Flore rather than about
              this page, and a second copy is how one of them goes stale.
              flex-col on mobile -- the two buttons together are wider than a
              phone. */}
          <div className="mt-space-24 flex flex-col items-start gap-space-24 sm:flex-row">
            <ButtonLink
              variant="primary"
              href={contactSection.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </ButtonLink>
            <ContactEmailButton email={contactSection.email} />
          </div>
        </div>
      </Container>
    </article>
  )
}
