import Block from './Block'
import Container from '../Container'
import Media from './Media'
import ButtonLink from '../ButtonLink'
import { ExternalLinkIcon } from '../icons'

// The page opener: a full-bleed stage carrying the meta / title / one-liner on
// the left and the hero media on the right, matching Figma's `section hero`
// (node 4774:7528), where the background rectangle spans the whole 1624 frame
// while the content sits on the page's normal column.
//
// The "map cutout" is DistrictBreadcrumb -- the same component the homepage
// sections use, which already renders the district illustration plus
// "You are here: Zone — Subsection". Reusing it means a subpage and its
// homepage section can't drift on either the drawing or the wording.
//
// TYPE, and the one thing in this file that is not a token match:
// Figma sets the title in `Desktop/display` -- 48px Bold, line-height 1.2 --
// which has no counterpart in the type scale (the largest is `h1` at 36). 48 vs
// 36 is a third larger, well outside anything I'd call the nearest step, so
// rather than inventing a token or hardcoding 48 this renders at `text-h1` and
// the gap is flagged for Flore. It is the same decision the v2 Thesis raised,
// so a `display` step would settle both at once.
//
// STAGE COLOUR: `surface-canvas`, a real token, and the one Figma binds for the
// feature stages on this same page. Figma's actual hero background is a subtle
// grid illustration, which is not in the asset contract -- flagged.
export default function Frame({
  category,
  title,
  oneLiner,
  role,
  date,
  liveUrl,
  liveLabel,
  zone,
  subsection,
  media,
}) {
  return (
    // `bg-notebook` over the canvas token: the graph-paper surface from Flore's
    // talk deck (see globals.css). This closes a gap flagged when the hero was
    // built -- Figma's hero background is a grid illustration, and the stage was
    // rendering as flat canvas because no asset existed for it. It never needed
    // an asset; it is a CSS pattern.
    // The top padding absorbed from ProjectPage's <main> (see the note there):
    // 120 + 64 = 184 at small, 160 + 120 = 280 at xl, so the spacing above the
    // hero content is unchanged while the grid itself now reaches y=0.
    // Asymmetric on purpose -- the extra top is nav clearance, not rhythm.
    <Block
      width="bleed"
      as="header"
      className="bg-notebook pb-space-64 pt-space-160 xl:pb-space-120 xl:pt-space-280"
    >
      <Container className="flex flex-col gap-space-40 xl:gap-space-64">
        {/* The "You are here: Lab — Own products" breadcrumb was removed here on
            2026-08-14 — Flore: it reads out of context on a subpage. The map
            wayfinding belongs to the homepage, where the district illustration
            has a map to refer back to; on a standalone case study it points at
            something the reader cannot see.
            `zone` and `subsection` stay in the content file and in this
            component's props: they are still the project's real place in the
            taxonomy, and the homepage card uses them. Nothing renders them
            here any more. */}

        {/* The page's hero pairing. Note this is a second side-by-side
            composition alongside FeatureBlock, which the build spec caps at
            one -- Figma draws the hero this way, so Figma's composition won
            and the conflict is flagged rather than silently resolved. */}
        <div className="grid grid-cols-1 items-center gap-space-40 lg:grid-cols-2 lg:gap-space-64">
          <div className="flex flex-col gap-space-24">
            {/* Sentence case and text-secondary, straight off the Figma meta
                node -- not the uppercase eyebrow this had before. */}
            <p className="m-0 text-body-sm font-normal text-text-secondary">{category}</p>

            <div className="flex flex-col gap-space-16">
              <h1 className="m-0 text-h1 font-bold text-text-primary">{title}</h1>
              <p className="m-0 text-body-lg font-normal text-text-primary">{oneLiner}</p>
            </div>

            {(role || date) && (
              // A description list because each label genuinely names its value.
              // The <div> wrappers are valid inside <dl> and keep each dt/dd
              // pair on its own row.
              <dl className="m-0 flex flex-col gap-space-8">
                {role && (
                  <div className="flex flex-col gap-space-4 sm:flex-row sm:gap-space-8">
                    <dt className="text-body-sm font-semibold text-text-secondary">Role</dt>
                    <dd className="m-0 text-body-sm font-normal text-text-primary">{role}</dd>
                  </div>
                )}
                {date && (
                  <div className="flex flex-col gap-space-4 sm:flex-row sm:gap-space-8">
                    <dt className="text-body-sm font-semibold text-text-secondary">Date</dt>
                    <dd className="m-0 text-body-sm font-normal text-text-primary">{date}</dd>
                  </div>
                )}
              </dl>
            )}

          </div>

          <div className="flex flex-col items-center gap-space-24">
            <Media {...media} className="border border-text-primary bg-surface-background" />
            {liveUrl && (
              // Figma floats this button over the media's bottom edge; placed
              // below it here instead, so it can never cover the artwork at a
              // width Figma doesn't draw. Same prominence, no overlap risk.
              <ButtonLink variant="primary" href={liveUrl} target="_blank" rel="noopener noreferrer">
                {liveLabel}
                <ExternalLinkIcon width={16} height={16} />
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </Block>
  )
}
