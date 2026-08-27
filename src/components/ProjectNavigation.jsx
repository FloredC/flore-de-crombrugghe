import { Link } from 'react-router-dom'
import Container from './Container'
import assetUrl from '../lib/assetUrl'
import { LINK_COLOR_CLASS } from './ButtonLink'
import { ArrowBackIcon, ArrowRightIcon } from './icons'
import { mediaTints, DEFAULT_MEDIA_TINT } from '../lib/mediaTints'

/**
 * Prev / next navigation between projects, from Figma's `ProjectNavigation`
 * component set (node 4999:5309).
 *
 * THE SET IS COMPLETE NOW -- six symbols, Desktop and Mobile x Prev+Next /
 * Next Only / Prev Only. Both gaps flagged on the previous pass are closed:
 * `Next Only` exists (4999:5304 / 4999:5307) so the first project in the
 * sequence is designed rather than inferred, and there are real Mobile frames
 * (390 wide) so the small layout is sampled rather than invented.
 *
 * WHAT CHANGED IN THIS PASS, so a diff reads as intent:
 *
 *   layout    the thumbnail moved BELOW the title. Each side is now a plain
 *             vertical stack -- label, title, thumbnail -- where it was a
 *             label above a thumbnail-beside-title row.
 *   weight    the title is Regular now (Desktop/body, 400), not Bold. Third
 *             setting in three passes: 24 SemiBold -> 18 Bold -> 18 Regular.
 *   mobile    88x60 thumbnail, caption 12, title 16, a full-width RULE between
 *             the two blocks, and 24/32 padding against desktop's 64/48.
 *
 * TYPE MAPS EXACTLY ONTO EXISTING TOKENS, which is worth stating because it
 * looks like a coincidence and is not: the file sets Desktop/caption 14 with
 * Mobile/caption 12, and Desktop/body 18 with Mobile/body 16. `text-caption`
 * already ramps 12 -> 13 -> 14 and `text-body` 16 -> 17 -> 18, so both
 * breakpoints come from one class each and nothing here needs a media query
 * for type.
 */

// 200x133.333 on desktop, 88x60 on mobile.
//
// Expressed as a 3:2 ratio rather than two fixed heights. Desktop is exactly
// 3:2; mobile's 88x60 is 1.467, so this makes the small thumbnail 58.7px tall
// instead of 60 -- 1.3px, taken deliberately in exchange for one ratio that
// cannot drift from its width at any breakpoint in between.
//
// `object-cover` on a declared ratio, so a portrait or ultra-wide thumbnail is
// cropped to the same chip as every other rather than setting its own height.
const THUMB_CLASS =
  'aspect-[3/2] w-[88px] shrink-0 overflow-hidden rounded-radius-8 border border-border-grey md:w-[200px]'

// THE LIFT, taken verbatim from ProjectMedia so the two cannot drift --
// Flore, 2026-08-27: "do the same as for the cards on the home page".
//
// 0/0/20/25% is the site's one shadow language: always X0 Y0 at 25% black with
// only the blur scaling to the object (5 for the nav pill, 10 for a hotspot
// dot, 20 for something card-sized). 20 is right here because the desktop
// thumbnail is card-sized; it stays 20 on mobile so the treatment reads as the
// same gesture rather than a second, smaller one.
//
// ON THE THUMBNAIL, not the whole link, for the same reason ProjectMedia puts
// it on the frame and not the <img>: the thumbnail is the visual object, and a
// shadow around the link's box would trace a rectangle through the label and
// title too.
//
// FOUR TRIGGERS, all driven by the link as `group`:
//
//   group-hover         pointing at it. The only one a mouse needs.
//   group-active        PRESSING it -- Flore, 2026-08-27: "the state is hover
//                       + click (for mobile). It needs to work for both". A
//                       touch device never fires hover, so without this the
//                       thumbnail was inert on a phone and the only feedback
//                       on tap was the title's colour step. `:active` is the
//                       one state touch does fire, on touchstart.
//   group-focus-within  tabbing to it, so keyboard users get the same feedback
//                       as mouse users and not just the ring. Because the
//                       group IS the anchor, this matches when the anchor
//                       itself is focused.
//
// NOTE this is one trigger MORE than the homepage cards, which today do
// hover + focus-within only. Flagged to Flore rather than changed here: adding
// `group-active` to ProjectMedia is a one-line change that would give the
// cards the same tap feedback, but it touches every card on the site.
//
// KEEP BOTH ENDS LITERAL. Tailwind's `shadow-[...]` utility does NOT work for
// this: it only swaps a custom property while the `box-shadow` declaration
// text stays identical, custom properties aren't transitionable, so Chrome
// never advances the transition and pins the shadow at its rest value. The
// full reasoning, and the browser test that caught it, is in ProjectMedia.jsx.
// EVERY VARIANT WRITTEN OUT IN FULL, and it has to stay that way. Tailwind
// finds classes by scanning source text for complete literals -- it does not
// evaluate the file -- so building these by interpolation
// (`group-hover:${SHADOW}`) compiles to nothing at all and the shadow silently
// never paints. Same trap as the `px-[${inset}]` note in CaseStudySnapshot.
// The repetition is the price of the class existing.
const LIFT_CLASS =
  'transition-shadow duration-200 [box-shadow:0_0_0_0_rgba(0,0,0,0)] group-hover:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)] group-active:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)] group-focus-within:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)]'

function ProjectLink({ project, direction }) {
  const isNext = direction === 'next'

  return (
    <Link
      to={`/work/${project.slug}`}
      className={[
        // `group` so the thumbnail's lift fires from anywhere on the link --
        // the same relationship the homepage card has with its media frame.
        'group flex flex-col gap-space-16 md:max-w-[45%] md:gap-space-8',
        // ALIGNMENT IS BY DIRECTION AT EVERY WIDTH: prev reads from the left
        // edge, next from the right. See the note in the default export about
        // the two mobile single-state frames, which disagree with this.
        isNext ? 'items-end text-right' : 'items-start',
        // Colour step + focus ring, no underline -- the treatment the
        // ProjectCard title took when its CTA button came off. Not LINK_CLASS,
        // which would force `font-bold` back onto a title that is now Regular.
        LINK_COLOR_CLASS,
      ].join(' ')}
    >
      {/* LABEL ROW. `text-illustration-foreground` is the token the node binds
          (Colors/illustration/foreground, grey-80) -- an odd name for a text
          colour, but it is what the file carries, so it is used rather than
          swapped for text-secondary on a guess. Flagged. */}
      <span className="flex items-center gap-space-4 text-caption font-normal text-illustration-foreground">
        {isNext ? (
          <>
            Next project
            <ArrowRightIcon width={20} height={20} />
          </>
        ) : (
          <>
            <ArrowBackIcon width={20} height={20} />
            Previous project
          </>
        )}
      </span>

      {/* THE TITLE WRAPS, where the file sets `whitespace-nowrap` on the
          desktop frames. Both examples in the file are the same short string;
          the real titles are not. At the site's 1184 measure each side is
          capped at 45% (~533), and "Welcome to my island — The making of a
          story-first portfolio" runs past that on one line. The mobile frame
          already wraps its own title (`min-w-full`), so this only diverges
          from the desktop symbols, and only for the long titles. */}
      <span className="text-body font-normal">{project.title}</span>

      <span
        className={`${THUMB_CLASS} ${LIFT_CLASS}`}
        // The project's own card tint behind the artwork, so a thumbnail with
        // transparent or letterboxed edges sits on the colour it does on the
        // homepage rather than on Figma's #ebe8e5 placeholder.
        style={{ backgroundColor: mediaTints[project.slug] || DEFAULT_MEDIA_TINT }}
      >
        {project.thumbnail && (
          <img
            // Decorative: the link's accessible name is the title above it, so
            // alt text here would announce the same project twice in one link.
            alt=""
            src={assetUrl(project.thumbnail)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </span>
    </Link>
  )
}

// Holds the remaining link against its own edge under `justify-between` on
// desktop -- the job the 1px `Frame` node does in Figma's single states.
// Hidden below `md`, where the layout is a stack and a phantom child would
// only add a gap.
function Spacer() {
  return <span aria-hidden="true" className="hidden size-px shrink-0 md:block" />
}

export default function ProjectNavigation({ prev, next }) {
  // Nothing to navigate to: render nothing rather than an empty bordered band,
  // which would read as a rule under the page for no reason.
  if (!prev && !next) return null

  return (
    // NO RULES ANYWHERE IN THIS BAND -- Flore, 2026-08-27, looking at the built
    // page: "remove these weird dividers".
    //
    // Two went, and both were in the Figma frames rather than inventions:
    //
    //   the band's own `border-t`, on every one of the six symbols. On the
    //   frame it reads as the edge of a component; on the real page it landed a
    //   hairline across the full window between the content and the nav, with
    //   the footer's own divider a short scroll below it -- two near-identical
    //   full-width rules stacked, which is what made it look like an artefact.
    //
    //   the mobile rule between the two blocks (node 4999:5269). Removed with
    //   it: it was the same hairline doing the same job, and leaving it would
    //   have meant the divider vanished on desktop and survived on a phone.
    //
    // The band still separates from the content above it -- by the whitespace
    // of <main>'s bottom padding, which is the site's usual section rhythm.
    // Horizontal padding is Container's fluid clamp rather than the file's flat
    // 64 / 24: the file draws these at 1440 and 390 and the site's pages sit on
    // one measure, so borrowing the frame's padding would put this band's
    // content on a different left edge from everything above it.
    <nav
      aria-label="Previous and next project"
      data-component="project-navigation"
      className="w-full bg-surface-background"
    >
      <Container>
        <div className="flex flex-col gap-space-40 py-space-32 md:flex-row md:items-center md:justify-between md:gap-space-40 md:py-space-48">
          {prev ? <ProjectLink project={prev} direction="prev" /> : <Spacer />}
          {next ? <ProjectLink project={next} direction="next" /> : <Spacer />}
        </div>
      </Container>
    </nav>
  )
}

/*
 * ONE DELIBERATE DIVERGENCE, FLAGGED RATHER THAN COPIED (2026-08-27).
 *
 * The two MOBILE single-state frames have their alignment swapped relative to
 * every other frame in the set:
 *
 *   Mobile / Next Only  (4999:5307)  items-start  -- "Next project →" on the LEFT
 *   Mobile / Prev Only  (4999:5308)  items-end    -- "← Previous project" on the RIGHT
 *
 * Everywhere else, prev is left and next is right: both desktop single states
 * do it that way, and so do both halves of Mobile / Prev+Next (4999:5306),
 * where the prev block is items-start and the next block items-end.
 *
 * So the same link changes side depending on whether it has a partner, and it
 * lands on the side its own arrow points away from. That reads as a
 * copy-paste slip -- duplicate the paired frame, delete the wrong half, keep
 * the survivor's alignment -- rather than a decision, which is why it is not
 * reproduced: on the live site it would show as a lone "Next project →" hugging
 * the left edge on a phone while the same link hugs the right on a laptop.
 *
 * Both states are reachable and will be seen: Artifakt is first in the
 * sequence (next only) and Roche is last (prev only).
 *
 * If the swap IS intentional, it is two class strings in `ProjectLink`.
 */
