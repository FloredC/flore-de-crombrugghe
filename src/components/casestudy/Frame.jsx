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
// TYPE: the title renders at `text-display`, Figma's `Desktop/display` -- 48px
// Bold, line-height 1.2. That step did not exist when this page was first
// built, so the title rendered a third too small at `text-h1` (36); the token
// was added 2026-08-19 and this is its only call site so far. The v2 Thesis
// raised the same gap, so it is now settled for both.
//
// Its mobile anchor is the one unmeasured number in the type scale -- see the
// note on `display` in tailwind.config.js. Nothing else in this file needs to
// know that, but if the hero title ever reads wrong on a phone, that is where
// it lives, not here.
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
          {/* GAPS ARE 10 THROUGHOUT — resampled 2026-08-19 from Flore's restructure
              of `section hero`. Both this column and the title group below ran at
              24 and 16, which were never sampled and had no rationale recorded;
              `Spaces/10` is the only spacing variable bound anywhere in the block
              (nodes 4774:7531 / 4774:7533), and the node geometry agrees -- meta
              ends at y=22 and the title group starts at y=32.
              The two nested flex columns mirror Figma's two nested auto-layout
              frames exactly, even though one column at gap 10 would render
              identically. Same structure, same place to look. */}
          <div className="flex flex-col gap-space-10">
            {/* Sentence case, and `text-primary` as of Flore's 2026-08-19 pass --
                this was `text-secondary`, correctly sampled at the time. The
                hero text block now binds exactly one colour variable,
                Colors/Text/text-primary, with no per-node override, so all four
                lines here are primary. */}
            <p className="m-0 text-body-sm font-normal text-text-primary">{category}</p>

            <div className="flex flex-col gap-space-10">
              <h1 className="m-0 text-display font-bold text-text-primary">{title}</h1>
              <p className="m-0 text-body-lg font-normal text-text-primary">{oneLiner}</p>

              {/* ROLE AND DATE ON ONE LINE — Flore's restructure, 2026-08-19
                  (node 4863:2346). This was a <dl> of two labelled rows, "Role"
                  and "Date" in semibold text-secondary. Figma now draws a single
                  body-sm line with no labels at all, so the <dl> went with them:
                  a description list with nothing doing the describing is markup
                  claiming a relationship the page no longer shows.

                  They stay TWO fields in the content file and two props here.
                  Role and date are different facts, the homepage card reads
                  `date` on its own, and joining them is a presentation choice --
                  so the join happens here, at the point of presentation, and
                  nowhere else. `filter(Boolean)` so a project carrying only one
                  of the two doesn't render a stray comma.

                  Note this drops the "Role"/"Date" labels from the accessibility
                  tree as well as the page -- the line now reads as one
                  uninterrupted phrase to a screen reader. That follows the
                  design; flagged to Flore rather than compensated for with a
                  visually-hidden label she didn't ask for. */}
              {(role || date) && (
                <p className="m-0 text-body-sm font-normal text-text-primary">
                  {[role, date].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* The button now FLOATS over the media's bottom edge, as Figma draws
              it — Flore, 2026-08-14. It previously sat below the media: a
              deliberate earlier call, on the reasoning that overlapping could
              cover artwork at widths Figma doesn't draw. Flore's mock settles
              it, and the risk turns out not to apply — the button is centred
              while the only content along that edge ("Feedback generated by
              Gemini 2.5 Flash") is left-aligned, so they don't collide.

              `relative` on the wrapper, not on the Media frame: that frame has
              `overflow-hidden` for its corner radius, which would clip the half
              of the button hanging below. As a sibling it escapes cleanly.

              translate-y-1/2 puts exactly half the button below the edge, so it
              straddles rather than sits on it, and stays centred at any width
              because it is measured from the button's own box. */}
          <div className="relative">
            {/* `mx-auto` is what makes the floating button land on centre. The
                media is capped at MEDIA_WIDTH.hero (450) inside a ~560 grid
                column, so left-aligned it sat 55px left of the column's middle
                — and the button centres on the wrapper, not on the artwork.
                Centring the media makes the two centres the same line. */}
            <Media {...media} className="mx-auto border border-text-primary bg-surface-background" />
            {liveUrl && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <ButtonLink variant="primary" href={liveUrl} target="_blank" rel="noopener noreferrer">
                  {liveLabel}
                  <ExternalLinkIcon width={16} height={16} />
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Block>
  )
}
