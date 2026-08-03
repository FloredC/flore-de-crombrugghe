/**
 * The global layout system, measured from the two Figma page frames
 * (`bp-1622-desktop` node 2928:73693, `402-mobile` node 2928:78203).
 *
 * Two facts do most of the work here:
 *
 * 1. Every section is a 12-column grid on the same 1184px container. Only the
 *    gutter changes -- 60px in Work, 24px in Approach/About. Confirmed with
 *    Flore as intentional rather than drift: project cards get more air than
 *    the smaller editorial cards. (Read as "6 columns / 60px" it looks like a
 *    second, incompatible grid; it isn't -- 12/60 reproduces every Work card
 *    width exactly, and keeps one system across the page.)
 *
 * 2. The 12-column grid is only meaningful at >= 1280 viewport, where
 *    Container resolves to exactly 1184. Twelve columns with 60px gutters
 *    leaves ~5px columns at 768. Below `xl` every section falls back to a
 *    plain N-up grid -- which is also where the Approach/About collage
 *    flattens, per Flore.
 *
 * Column maths, both exact (no rounding anywhere):
 *
 *   Work       col = (1184 - 11*60)/12 = 43.67   span 4  = 354.67  (3-up card)
 *                                                span 6  = 562     (2-up card)
 *                                                span 10 = 976.67  (Artifakt)
 *
 *   Editorial  col = (1184 - 11*24)/12 = 76.67   span 3  = 278     (ValueCard)
 *                                                span 6  = 580
 *                                                span 7  = 680.67
 *                                                span 10 = 982.67
 *
 * Vertical rhythm, likewise measured rather than chosen: 200 between
 * top-level sections (and before the footer), 64 from a Wayfinding row to the
 * content under it, 48 from a section header to its content. Compression
 * below `xl` is interpolation -- Figma has no frames between 402 and 1622.
 */

// --- Page rhythm ------------------------------------------------------------

// 200 between every top-level section, and between the last section and the
// footer -- a real auto-layout gap on Figma's `Vertical container`, uniform
// across all four boundaries.
export const PAGE_STACK = 'flex flex-col gap-space-120 xl:gap-space-200'

// Work opens with 80px of top padding inside its 1280 frame; Approach and
// About have none; Contact is padded 120 top and bottom.
export const SECTION_PAD_WORK = 'pt-space-48 xl:pt-space-80'
export const SECTION_PAD_CONTACT = 'py-space-64 xl:py-space-120'

// Section header -> first content block, and Wayfinding row -> the content
// beneath it. Both uniform across every section.
//
// Figma had Work tighter than the rest on both (24 vs 48, 48 vs 64). Flore's
// call: those were slips, not intent -- match everywhere else. Deliberately
// one constant each rather than a per-zone pair, so the two can't drift apart
// again without someone choosing to split them.
export const SECTION_HEADER_GAP = 'gap-space-32 xl:gap-space-48'
export const WAYFINDING_GAP = 'gap-space-32 xl:gap-space-64'

// Gap between subsections within one section. Work is spaced as widely as the
// top-level sections themselves (200); Approach and About use 120.
export const SUBSECTION_GAP_WORK = 'flex flex-col gap-space-80 xl:gap-space-200'
export const SUBSECTION_GAP_EDITORIAL = 'flex flex-col gap-space-64 xl:gap-space-120'

// --- Work grids (12 col / 60px gutter) --------------------------------------

// Artifakt spans 10 of 12 -- not the full width. Below xl it's a normal block.
export const WORK_FEATURED_ROW = 'xl:grid xl:grid-cols-12 xl:gap-x-space-60'
export const WORK_FEATURED_CARD = 'xl:col-span-10'

// The featured card sits 200 above the 2-up row beneath it.
export const WORK_FEATURED_STACK = 'flex flex-col gap-space-64 xl:gap-space-200'

// 2-up: span 6 each. Row gap is 140 against a 60 gutter -- deliberately more
// vertical air than horizontal, straight from the 2x2 block in Figma.
export const WORK_GRID_2UP =
  'grid grid-cols-1 gap-y-space-64 sm:grid-cols-2 sm:gap-x-space-24 xl:gap-x-space-60 xl:gap-y-space-140'

// 3-up: span 4 each.
export const WORK_GRID_3UP =
  'grid grid-cols-1 gap-y-space-64 sm:grid-cols-2 sm:gap-x-space-24 lg:grid-cols-3 xl:gap-x-space-60'

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
  'grid grid-cols-1 gap-space-32 sm:grid-cols-2 xl:grid-cols-12 xl:gap-x-space-24'
export const VALUE_CARD_CELL = 'xl:col-span-3'

// The Approach and About card blocks are staggered collages in Figma, not
// grids: fixed-width cards hand-placed with horizontal and vertical offsets.
// Per Flore they stay a collage at xl and collapse to a plain grid below,
// since hand-set offsets have nowhere to go on a narrow viewport.
export const COLLAGE_GRID =
  'grid grid-cols-1 gap-space-64 sm:grid-cols-2 xl:grid-cols-12 xl:gap-x-space-24 xl:gap-y-space-64'

// Placement per card, in content order. Column starts and spans are exact;
// the vertical offsets approximate Figma's, since real card heights are
// content-driven and won't match the fixed heights in the design file.
export const MEDIA_COLLAGE = [
  // Podcast (embed): right-aligned inside a span-10 frame -> x = 582.67.
  'xl:col-start-1 xl:col-span-10 xl:row-start-1 xl:justify-self-end xl:w-[400px]',
  // Friends of Figma: flush left.
  'xl:col-start-1 xl:col-span-6 xl:row-start-2 xl:justify-self-start xl:w-[400px]',
  // Swisscovid: right half, inset 100, and dropped ~300 below its row-mate.
  'xl:col-start-7 xl:col-span-6 xl:row-start-2 xl:justify-self-start xl:ml-space-100 xl:mt-space-300 xl:w-[400px]',
  // 10-year quiz: back to the left half, same 100 inset.
  'xl:col-start-1 xl:col-span-6 xl:row-start-3 xl:justify-self-start xl:ml-space-100 xl:mt-space-32 xl:w-[400px]',
]

export const ASIDE_COLLAGE = [
  // Cold Plunge: right-aligned inside a span-10 frame, same as the podcast.
  'xl:col-start-1 xl:col-span-10 xl:row-start-1 xl:justify-self-end xl:w-[400px]',
  // Data, Illustrated: flush left, the wide card (600) in a span-7 frame.
  'xl:col-start-1 xl:col-span-7 xl:row-start-2 xl:justify-self-start xl:mt-space-160 xl:w-[600px]',
  // Papayas: right-aligned to the full 12-column width -> x = 784.
  'xl:col-start-1 xl:col-span-12 xl:row-start-3 xl:justify-self-end xl:w-[400px]',
]
