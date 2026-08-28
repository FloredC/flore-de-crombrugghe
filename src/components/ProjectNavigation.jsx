import { Link } from 'react-router-dom'
import Container from './Container'
import assetUrl from '../lib/assetUrl'
import { LINK_COLOR_CLASS } from './ButtonLink'
import { ArrowBackIcon, ArrowRightIcon } from './icons'
import { mediaTints, DEFAULT_MEDIA_TINT } from '../lib/mediaTints'

/**
 * Prev / next navigation between projects, from Figma's `ProjectNavigation`
 * component set (node 4999:5309) — six symbols, Desktop and Mobile x Prev+Next
 * / Next Only / Prev Only.
 *
 * BOTH BREAKPOINTS ARE ONE ROW with a column on each side holding label /
 * title / thumbnail. Mobile stopped stacking on 2026-08-27, so the
 * `flex-col md:flex-row` split and the divider between the blocks are gone.
 *
 * HOW THE TWO SIDES STAY ALIGNED (Flore, 2026-08-28). The two titles wrap to
 * different numbers of lines, so left to itself the band misaligns twice over:
 * the labels sit at different heights and so do the thumbnails.
 *
 * The fix is structural and has no spacer in it. Each column holds exactly TWO
 * children — a text group (label + title, 8 apart) and the thumbnail — and
 * `justify-between` pins one to the top and the other to the bottom. The row
 * stretches both columns to the height of the taller one, so the shorter column
 * simply has more space between its group and its thumbnail. Nothing is added;
 * the leftover is absorbed where there is nothing to misalign.
 *
 * A previous pass built this with an explicit `filler` element and a 200px
 * floor on the mobile row, both read literally off the frames. Flore, on her
 * phone: "I added fillers to be sure that everything would be aligned but you
 * took it too literal... Don't add unnecessary space." The filler was a
 * description of the intent, not a component to reproduce, and the 200 was
 * sized around the multi-line test strings in the frame. Both are gone.
 *
 * WHAT VARIES BY BREAKPOINT, after Flore's 2026-08-28 pass:
 *
 *   padding      24 / 32     ->  64 / 48
 *   label        "Previous"  ->  "Previous project"
 *   label size   12          ->  14
 *   title        14          ->  18
 *   thumbnail    88x60       ->  200x133
 *   WIDTH RULE   equal halves, 40 apart  ->  content-sized, justify-between
 *
 * and that width rule is the interesting one — see the note on the link below.
 *
 * THREE THINGS THIS FILE USED TO CARRY AS DIVERGENCES ARE GONE, resolved in the
 * frames rather than outvoted here:
 *
 *   the alignment swap  the mobile single states used to mirror the wrong way
 *                       (Next Only left-aligned, Prev Only right). Both now
 *                       match the paired state — prev left, next right.
 *   the rules           the band's top border is gone from the frames too.
 *   the label colour    desktop's label was Colors/illustration/foreground
 *                       (grey-80) against mobile's text-primary, so this file
 *                       carried a breakpoint-dependent colour. Desktop moved to
 *                       text-primary, so it is one value again.
 *
 * The column gap converged the same way: desktop went 8 -> 16 to meet mobile,
 * which is the whole of that frame's 15px growth.
 */

// 88x60 on mobile, 200x133.333 on desktop, at a fixed 3:2.
//
// Desktop is exactly 3:2; mobile's 88x60 is 1.467, so this draws the small
// thumbnail 58.7px tall instead of 60 — 1.3px, taken deliberately in exchange
// for one ratio that cannot drift from its width at any size in between.
//
// `object-cover` on a declared ratio, so a portrait or ultra-wide thumbnail is
// cropped to the same chip as every other rather than setting its own height.
const THUMB_CLASS =
  'aspect-[3/2] w-[88px] shrink-0 overflow-hidden rounded-radius-8 border border-border-grey md:w-[200px]'

// THE LIFT, taken verbatim from ProjectMedia so the two cannot drift — Flore:
// "do the same as for the cards on the home page", then "the state is hover +
// click (for mobile). It needs to work for both".
//
// 0/0/20/25% is the site's one shadow language: X0 Y0 at 25% black with only
// the blur scaling to the object (5 for the nav pill, 10 for a hotspot dot,
// 20 for something card-sized).
//
// On the thumbnail rather than the whole link, for the same reason ProjectMedia
// puts it on the frame and not the <img>: a shadow around the link's box would
// trace a rectangle through the label and title too.
//
// Three triggers, all driven by the link as `group`: hover for a pointer,
// ACTIVE for touch (which never fires hover — the one state a tap does fire),
// and focus-within so tabbing gets the same feedback as pointing. One trigger
// more than the homepage cards, which do hover + focus-within only; adding
// `group-active` to ProjectMedia would give them the same tap feedback but
// touches every card on the site. Flagged, not done here.
//
// EVERY VARIANT WRITTEN OUT IN FULL, and it has to stay that way. Tailwind
// finds classes by scanning source text for complete literals — it does not
// evaluate the file — so building these by interpolation compiles to nothing
// and the shadow silently never paints. Tailwind's `shadow-[...]` utility
// does not work here either: it swaps a custom property while the `box-shadow`
// declaration text stays identical, and custom properties are not
// transitionable, so the transition never advances. Both ends stay literal.
const LIFT_CLASS =
  'transition-shadow duration-200 [box-shadow:0_0_0_0_rgba(0,0,0,0)] group-hover:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)] group-active:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)] group-focus-within:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)]'

/**
 * The label, which loses its second word on mobile: "Previous" at 390,
 * "Previous project" at 1440.
 *
 * ONE text node with the tail hidden, rather than two nodes swapped by
 * breakpoint. Two nodes would put the same label in the DOM twice and rely on
 * `hidden` to keep one out of the accessibility tree; this way there is
 * exactly one string, and what a screen reader announces is what is on screen.
 *
 * THE OUTER <span> IS LOAD-BEARING, and this was wrong on the first attempt.
 * The label row is a flex container, so bare text inside it becomes an
 * anonymous flex item -- which meant "Previous" and " project" were two
 * separate items with the row's `gap-space-4` between them, and the span's own
 * leading space collapsed away. It LOOKED right (4px is within a pixel of a
 * real space at this size), but the word gap was the flex gap, so it would
 * have silently changed with the icon spacing. Wrapping the text keeps it one
 * flex item with ordinary inline content and a real space character.
 */
function Label({ children }) {
  return (
    <span>
      {children}
      <span className="hidden md:inline"> project</span>
    </span>
  )
}

function ProjectLink({ project, direction }) {
  const isNext = direction === 'next'

  return (
    <Link
      to={`/work/${project.slug}`}
      className={[
        // `group` so the thumbnail's lift fires from anywhere on the link —
        // the same relationship the homepage card has with its media frame.
        //
        // TWO CHILDREN, PUSHED APART: the text group (label + title) and the
        // thumbnail, with `justify-between` holding one at the top and the
        // other at the bottom. That is the whole alignment mechanism — see the
        // note above the component.
        //
        // `gap-space-16` is a FLOOR, not a fixed gap. With two children and
        // `justify-between`, any leftover space still goes between them — the
        // gap only guarantees a minimum. Without it the TALLER column collapses
        // to exactly its content and its title ends up touching its thumbnail
        // (measured: 1px on the Rega page's 3-line title), because that column
        // is the one setting the row height and so has no slack of its own.
        //
        // My addition, not in the frames: they avoid the problem by fixing the
        // row height (200 mobile / 255.666 desktop), which is the thing that
        // put dead air in the middle. A floor gets the breathing room without
        // the air, and holds at any title length. 16 is the same step the
        // thumbnail's own row uses.
        //
        // WIDTH IS THE ONE RULE THAT DIFFERS BY BREAKPOINT. Mobile splits the
        // row into EQUAL HALVES (`flex-1`, 40 apart); desktop keeps
        // content-sized columns pushed apart by the row's own
        // `justify-between`, capped at 45% so a long title cannot reach across.
        // `min-w-0` because a flex item's default `min-width: auto` refuses to
        // shrink below its longest word, which would push the halves uneven.
        'group flex min-w-0 flex-1 flex-col justify-between gap-space-16 md:flex-none md:max-w-[45%]',
        // Prev reads from the left edge, next from the right, at EVERY width.
        isNext ? 'items-end text-right' : 'items-start',
        // Colour step + focus ring, no underline — the treatment the
        // ProjectCard title took when its CTA button came off. Not LINK_CLASS,
        // which would force `font-bold` onto a title the frames set Regular.
        LINK_COLOR_CLASS,
      ].join(' ')}
    >
      {/* THE TEXT GROUP: label and title together, 8 apart, as one block that
          `justify-between` pins to the top of the column. Grouping them is
          what makes the alignment work without any spacer element. */}
      <span
        className={`flex w-full flex-col gap-space-8 md:w-auto ${isNext ? 'items-end' : 'items-start'}`}
      >
        {/* LABEL ROW. One colour at both sizes — Colors/Text/text-primary.
          `text-caption` ramps 12 -> 13 -> 14, exactly the frames' Mobile and
          Desktop caption sizes, so the size needs no media query.

          WEIGHT DOES need one: the label went from Regular to Mobile/caption-
          BOLD (700) and Desktop/caption-SEMIBOLD (600) in Flore's 2026-08-28
          pass. Heavier on the smaller size, which is the usual compensation —
          12px needs the weight to hold against an 18px title, 14px does not. */}
      <span className="flex items-center gap-space-4 text-caption font-bold text-text-primary md:font-semibold">
        {isNext ? (
          <>
            <Label>Next</Label>
            <ArrowRightIcon width={20} height={20} />
          </>
        ) : (
          <>
            <ArrowBackIcon width={20} height={20} />
            <Label>Previous</Label>
          </>
        )}
      </span>

      {/* TITLE. 14 on mobile (Mobile/body-sm), 18 on desktop (Desktop/body).
          No single token spans that — `text-body-sm` tops out at 16 and
          `text-body` starts there — so the two are switched at `md`. They
          carry the frames' line heights with them (1.4 and 1.5), so that comes
          for free rather than needing an override.

          WIDTH FOLLOWS THE COLUMN ON MOBILE (`w-full`), because the frame
          sets `min-w-full` on it — and min-width beats max-width in CSS, so
          the `max-w-[120px]` sitting beside it in the same node is dead weight
          and is not reproduced. The title therefore fills its half and wraps.

          On desktop it is content-sized and the link's 45% cap does the
          limiting instead. That cap is a divergence: the desktop frames set
          `whitespace-nowrap`, and "Welcome to my island — The making of a
          story-first portfolio" would run into the other side on one line. */}
        <span className="w-full text-body-sm font-normal md:w-auto md:text-body">
          {project.title}
        </span>
      </span>

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

// The empty half opposite a lone link.
//
// IT TAKES A REAL HALF ON MOBILE (`flex-1`) and collapses to a hairline on
// desktop, and that asymmetry is what reproduces the frames rather than being
// a hack. Figma's Mobile/Next Only caps its single column at `max-w-[151px]`,
// which is exactly (390 - 48 padding - 40 gap) / 2 — so a lone link keeps the
// width it would have had WITH a partner instead of stretching across. Two
// `flex-1` children split the row evenly and produce that for free.
//
// On desktop the frames use `justify-between` with content-sized columns, so
// the spacer only has to occupy the far edge: 1px is enough, and a `flex-1`
// there would push the real link into the middle.
function Spacer() {
  return <span aria-hidden="true" className="flex-1 md:size-px md:flex-none" />
}

export default function ProjectNavigation({ prev, next }) {
  // Nothing to navigate to: render nothing rather than an empty band.
  if (!prev && !next) return null

  return (
    // NO RULES ANYWHERE IN THIS BAND. Flore removed the band's top border and
    // the mobile divider — first on the built page ("remove these weird
    // dividers"), now in the frames too, so nothing here diverges any more.
    // The band separates from the content above it by the whitespace of
    // <main>'s bottom padding, which is the site's usual section rhythm.
    //
    // Horizontal padding is Container's fluid clamp rather than the frames'
    // flat 64 / 24: they are drawn at 1440 and 390 and the site's pages sit on
    // one measure, so borrowing the frame's padding would put this band's
    // content on a different left edge from everything above it.
    <nav
      aria-label="Previous and next project"
      data-component="project-navigation"
      className="w-full bg-surface-background"
    >
      <Container>
        {/* `items-stretch` (the flex default, so nothing to write) is what
            makes this work: both columns take the height of the taller one, so
            the shorter column's `justify-between` has real slack to push its
            thumbnail down with. This was `items-center` until 2026-08-28,
            which is exactly what left the labels at different heights.

            NO MIN-HEIGHT. The frames draw the mobile row at a flat 200 and I
            reproduced that once — wrongly. Flore, seeing it on her phone: "I
            added fillers to be sure that everything would be aligned but you
            took it too literal... Don't add unnecessary space." The 200 is
            sized around the multi-line test strings in the frame, not a spec;
            with the real titles it left ~63px of dead air in the middle of the
            band. Alignment does not need it, so the band hugs its content. */}
        <div className="flex gap-space-40 py-space-32 md:justify-between md:py-space-48">
          {prev ? <ProjectLink project={prev} direction="prev" /> : <Spacer />}
          {next ? <ProjectLink project={next} direction="next" /> : <Spacer />}
        </div>
      </Container>
    </nav>
  )
}
