/**
 * The global layout system, measured from the two Figma page frames
 * (`bp-1622-desktop` node 2928:73693, `402-mobile` node 2928:78203).
 *
 * Two facts do most of the work here:
 *
 * 1. Two grids on the same 1184px container, differing in both column count
 *    and gutter: Work is 6 columns / 60px, Approach and About are 12 columns
 *    / 24px. Both are real layout grids declared in the Figma file -- read
 *    off the frames' own generated output, not inferred from card widths.
 *    Confirmed with Flore as intentional rather than drift: project cards get
 *    more air than the smaller editorial cards.
 *
 *    (Worth knowing, because it caused a wrong call once: Work's widths *also*
 *    land exactly on a 12/60 grid, so it can be described either way and the
 *    pixels are identical. Use 6 -- it's what the file declares, and it's what
 *    the spans in Figma are numbered against. Describing Work as 12 columns
 *    silently doubles every span versus what a designer reads off the file.)
 *
 * 2. The column grids are only meaningful at >= 1280 viewport, where Container
 *    resolves to exactly 1184. Work's 60px gutters leave ~5px columns at 768.
 *    Below `xl` every section falls back to a plain N-up grid -- which is also
 *    where the Approach/About collage flattens, per Flore.
 *
 * Column maths, both exact (no rounding anywhere):
 *
 *   Work       col = (1184 - 5*60)/6 = 147.33    span 2 = 354.67  (3-up card)
 *                                                span 3 = 562     (2-up card)
 *                                                span 5 = 976.67  (Artifakt)
 *
 *   Editorial  col = (1184 - 11*24)/12 = 76.67   span 3  = 278     (ValueCard)
 *                                                span 6  = 580
 *                                                span 7  = 680.67
 *                                                span 10 = 982.67
 *
 * Vertical rhythm, likewise measured rather than chosen: 200 between
 * top-level sections (and before the footer), 64 from a Wayfinding row to the
 * content under it, 48 from a section header to its content.
 *
 * The below-`xl` values are a deliberate override of the 402 frame, decided
 * on 2026-08-04. Two steps got there, and the second reverses part of the
 * first, so both are recorded:
 *
 * 1. They were originally invented -- "Figma has no frames between 402 and
 *    1622" got read as "no frames at all", so the small end was guessed. The
 *    402 frame does specify a rhythm (40 top padding, 48 Wayfinding, 48 card
 *    -> card) and those were measured in.
 *
 * 2. On a real phone that rhythm reads flat -- Flore's call, and the ratios
 *    show why. Against desktop, the *structural* gaps had been compressed to
 *    0.40-0.48 while local ones sat at 0.67-0.75, so a section break came out
 *    barely larger than a card gap and the hierarchy collapsed. Everything now
 *    sits on one ~0.7 ratio of its desktop value, snapped to the token scale.
 *    The fix is proportional, not a flat increase: the big gaps roughly double,
 *    the small ones barely move.
 *
 * So mobile is now *looser* than the 402 frame draws it. That is intentional.
 * If the frame is ever revised, don't silently re-measure these back down --
 * check whether the hierarchy still survives at that size first.
 *
 * Card-internal spacing (ProjectCard's own gaps) stays exactly as the 402
 * frame has it; only page rhythm was opened up.
 *
 * The 402 frame only draws the hero and the Work section, so the below-`xl`
 * values outside Work are ratio-derived rather than measured.
 */

// --- Page rhythm ------------------------------------------------------------

// 200 between every top-level section, and between the last section and the
// footer -- a real auto-layout gap on Figma's `Vertical container`, uniform
// across all four boundaries.
export const PAGE_STACK = 'flex flex-col gap-space-140 xl:gap-space-200'

// Work opens with 80px of top padding inside its 1280 frame; Approach and
// About have none; Contact is padded 120 top and bottom.
// This padding is the *whole* visible gap between the map and the Work
// heading -- the hero no longer carries bottom padding and the nav no longer
// reserves flow space, so nothing else contributes to it. Flore asked for
// ~78/38; 80 and 40 are the token-scale values either side and 80 is the
// Figma frame's own number, so the gap is one token rather than two magic
// numbers. Deliberately below the ~0.7 mobile ratio the rest of the page
// uses: this is a boundary against the map, not between two text sections.
export const SECTION_PAD_WORK = 'pt-space-40 xl:pt-space-80'
export const SECTION_PAD_CONTACT = 'py-space-64 xl:py-space-120'

// Section header -> first content block, and Wayfinding row -> the content
// beneath it. Both uniform across every section.
//
// Figma had Work tighter than the rest on both (24 vs 48, 48 vs 64). Flore's
// call: those were slips, not intent -- match everywhere else. Deliberately
// one constant each rather than a per-zone pair, so the two can't drift apart
// again without someone choosing to split them.
export const SECTION_HEADER_GAP = 'gap-space-32 xl:gap-space-48'
// Mobile 48 measured off the 402 frame (breadcrumb h=69.44 -> content y=117.44),
// where it happens to be *wider* than the 32 guessed here before, not tighter.
export const WAYFINDING_GAP = 'gap-space-48 xl:gap-space-64'

// Gap between subsections within one section. Work is spaced as widely as the
// top-level sections themselves (200); Approach and About use 120.
export const SUBSECTION_GAP_WORK = 'flex flex-col gap-space-140 xl:gap-space-200'
export const SUBSECTION_GAP_EDITORIAL = 'flex flex-col gap-space-80 xl:gap-space-120'

// --- Work grids (6 col / 60px gutter) ---------------------------------------

// Artifakt spans 5 of 6 -- not the full width. Below xl it's a normal block.
export const WORK_FEATURED_ROW = 'xl:grid xl:grid-cols-6 xl:gap-x-space-60'
export const WORK_FEATURED_CARD = 'xl:col-span-5'

// The featured card sits 100 above the 2-up row beneath it (node 2928:73715).
// Was 200, matching the top-level section gap; Flore tightened it to 100 on
// 2026-08-04 so the Work rows read as one group rather than three sections.
export const WORK_FEATURED_STACK = 'flex flex-col gap-space-72 xl:gap-space-100'

// 2-up: span 6 each. Row gap 100 against a 60 gutter (node 2928:73730) --
// still more vertical air than horizontal, but the same 100 as the featured
// stack above it, so every Work row-to-row gap on the page is one number.
// Was 140; Flore aligned it with the projects on 2026-08-04.
export const WORK_GRID_2UP =
  'grid grid-cols-1 gap-y-space-72 sm:grid-cols-2 sm:gap-x-space-24 xl:gap-x-space-60 xl:gap-y-space-100'

// 3-up: span 4 each.
export const WORK_GRID_3UP =
  'grid grid-cols-1 gap-y-space-72 sm:grid-cols-2 sm:gap-x-space-24 lg:grid-cols-3 xl:gap-x-space-60'

// --- Editorial grids (12 col / 24px gutter) ---------------------------------

// Four ValueCards at span 3 each: 4*278 + 3*24 = 1184 exactly. On the same
// 12-column grid as the rest of the editorial zone rather than a standalone
// 4-up -- identical pixels either way, but this way the shared system is
// visible in the code instead of being a coincidence.
//
// (Figma briefly had these in a 1208-wide row that overflowed the container
// by 24px, using a 32px gutter. Flore has since removed that wrapper and put
// the cards on a real grid; the two now agree.)
export const VALUE_CARD_GRID =
  'grid grid-cols-1 gap-space-40 sm:grid-cols-2 xl:grid-cols-12 xl:gap-x-space-24'
export const VALUE_CARD_CELL = 'xl:col-span-3'

// The Approach and About card blocks are staggered collages in Figma, not
// grids: fixed-width cards hand-placed with horizontal and vertical offsets.
// Per Flore they stay a collage at xl and collapse to a plain grid below,
// since hand-set offsets have nowhere to go on a narrow viewport.
export const COLLAGE_GRID =
  'grid grid-cols-1 gap-space-80 sm:grid-cols-2 xl:grid-cols-12 xl:gap-x-space-24 xl:gap-y-space-64'

// --- Editorial card width ---------------------------------------------------
//
// What sets an editorial card's visual weight is this width, NOT its column
// span. The span only decides which columns the card's frame occupies; the
// card is then aligned inside that frame with justify-self and sized here.
// Dropping a span moves a card sideways and leaves it exactly as large.
//
// Reduced 2026-08-04, Flore's call: the talks/writing and About cards were
// competing with the actual project work. Measured at 1440 they were wider
// than the smallest project cards -- 400 against 355, with bigger media
// (400x300 vs 320x278) -- so the secondary content was reading as the more
// prominent of the two.
//
// 320 puts them clearly below the 355 3-up project card, and is already a
// number in the system (the project artwork's own width). The wide card keeps
// its 1.5x relation to the small one (600/400 -> 480/320) so the editorial
// zone holds its internal hierarchy, and 480 still sits below the 562 2-up
// project card. Both diverge from Figma's 400/600 -- deliberate, so don't
// restore them from the file without asking.
//
// The max-w carries the same intent below xl, where the collage flattens to a
// plain grid: without it these cards go full-bleed and match the project cards
// again, which is the whole problem, just on a phone.
const EDITORIAL_CARD = 'max-w-[320px] xl:w-[320px]'
const EDITORIAL_CARD_WIDE = 'max-w-[480px] xl:w-[480px]'

// Placement per card, in content order. Column starts and spans are exact;
// the vertical offsets approximate Figma's, since real card heights are
// content-driven and won't match the fixed heights in the design file.
export const MEDIA_COLLAGE = [
  // Podcast (embed): right-aligned inside a span-10 frame -> x = 582.67.
  `xl:col-start-1 xl:col-span-10 xl:row-start-1 xl:justify-self-end ${EDITORIAL_CARD}`,
  // Friends of Figma: flush left.
  `xl:col-start-1 xl:col-span-6 xl:row-start-2 xl:justify-self-start ${EDITORIAL_CARD}`,
  // Swisscovid: right half, inset 100, and dropped ~300 below its row-mate.
  `xl:col-start-7 xl:col-span-6 xl:row-start-2 xl:justify-self-start xl:ml-space-100 xl:mt-space-300 ${EDITORIAL_CARD}`,
  // 10-year quiz: back to the left half, same 100 inset.
  `xl:col-start-1 xl:col-span-6 xl:row-start-3 xl:justify-self-start xl:ml-space-100 xl:mt-space-32 ${EDITORIAL_CARD}`,
]

export const ASIDE_COLLAGE = [
  // Cold Plunge: right-aligned inside a span-10 frame, same as the podcast.
  `xl:col-start-1 xl:col-span-10 xl:row-start-1 xl:justify-self-end ${EDITORIAL_CARD}`,
  // Data, Illustrated: flush left, the wide card in a span-7 frame.
  `xl:col-start-1 xl:col-span-7 xl:row-start-2 xl:justify-self-start xl:mt-space-160 ${EDITORIAL_CARD_WIDE}`,
  // Papayas: right-aligned to the full 12-column width -> x = 784.
  `xl:col-start-1 xl:col-span-12 xl:row-start-3 xl:justify-self-end ${EDITORIAL_CARD}`,
]
