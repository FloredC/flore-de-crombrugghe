import Block from './Block'
import Container from '../Container'
import Media from './Media'
import DistrictBreadcrumb from '../DistrictBreadcrumb'
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
    <Block width="bleed" as="header" className="bg-surface-canvas py-space-64 xl:py-space-120">
      <Container className="flex flex-col gap-space-40 xl:gap-space-64">
        {/* "You are here" sits at the TOP of the page, right-aligned — Flore's
            note 2026-08-12, matching the frame, where the Breadcrumb instance
            is at x=1094.5 y=41.75 of a 1622-wide frame: level with the navbar,
            hard right, well above the hero content.
            It was previously buried in the left-hand column under the Role
            line, which is not where the design puts it and made it read as
            page metadata rather than as wayfinding.
            Known divergence: Figma has it level with the navbar itself, which
            would mean rendering it inside Nav (a shared component). Here it is
            the first thing inside the hero stage instead — visually top-right
            of the page, without reaching into the nav. Flagged. */}
        <div className="flex justify-end">
          <DistrictBreadcrumb zone={zone} subsection={subsection} />
        </div>

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
            <Media {...media} className="border border-border-grey bg-surface-background" />
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
