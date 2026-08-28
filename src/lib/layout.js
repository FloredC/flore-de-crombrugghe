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
 *
 * ---------------------------------------------------------------------------
 * THREE DENSITY REGIMES (added 2026-08-25)
 *
 * `xl:` used to mean "the desktop design" and `2xl` was unused, which had one
 * consequence worth stating plainly: from 1280px upward the page was PIXEL-
 * IDENTICAL. The Artifakt card measured 977x882 at a 1440 viewport and 977x887
 * at 1728 -- a 5px difference, and all of that was the type clamp. The 1622
 * frame's rhythm was simply being applied to laptops.
 *
 * So the prefixes were re-pointed rather than new ones invented:
 *
 *   (bare)   phone/tablet. Untouched by this pass.
 *   xl:      1280+, LAPTOP. The design's proportions at laptop density.
 *   2xl:     1600+, LARGE DESKTOP. The Figma frame, restored exactly.
 *
 * Every generous value that used to sit on `xl:` now sits on `2xl:`; where the
 * bare (phone) value would have been too tight to inherit at laptop, an
 * explicit `xl:` step was inserted instead. So `2xl:` reads as "restore the
 * measured Figma value" and any `xl:` without a `2xl:` partner means the two
 * regimes deliberately agree.
 *
 * WHY VIEWPORT HEIGHT IS THE REAL VARIABLE HERE, even though these are all
 * width queries: card height was constant across the whole desktop range while
 * laptop viewport height is not -- roughly 670 (1366x768) to 870 (1512x982),
 * against 1000-1300 on an external monitor. The same 882px card is 0.74 of one
 * screen and 1.12 of the other. The widths in these queries are a proxy for
 * "this is a laptop", which is the only signal CSS gives us that correlates
 * with the height without querying it directly. ProjectMedia carries the one
 * genuine height query, because media is the term big enough to need it.
 */

// --- Page rhythm ------------------------------------------------------------

// 200 between every top-level section, and between the last section and the
// footer -- a real auto-layout gap on Figma's `Vertical container`, uniform
// across all four boundaries.
export const PAGE_STACK = 'flex flex-col gap-space-140 2xl:gap-space-200'

// Work opens with 80px of top padding inside its 1280 frame; Approach and
// About have none; Contact is padded 120 top and bottom.
// This padding is the *whole* visible gap between the map and the Work
// heading -- the hero no longer carries bottom padding and the nav no longer
// reserves flow space, so nothing else contributes to it. Flore asked for
// ~78/38; 80 and 40 are the token-scale values either side and 80 is the
// Figma frame's own number, so the gap is one token rather than two magic
// numbers. Deliberately below the ~0.7 mobile ratio the rest of the page
// uses: this is a boundary against the map, not between two text sections.
export const SECTION_PAD_WORK = 'pt-space-40 xl:pt-space-60 2xl:pt-space-80'
export const SECTION_PAD_CONTACT = 'py-space-64 xl:py-space-80 2xl:py-space-120'

// Section header -> first content block, and Wayfinding row -> the content
// beneath it. Both uniform across every section.
//
// Figma had Work tighter than the rest on both (24 vs 48, 48 vs 64). Flore's
// call: those were slips, not intent -- match everywhere else. Deliberately
// one constant each rather than a per-zone pair, so the two can't drift apart
// again without someone choosing to split them.
export const SECTION_HEADER_GAP = 'gap-space-32 xl:gap-space-40 2xl:gap-space-48'
// Mobile 48 measured off the 402 frame (breadcrumb h=69.44 -> content y=117.44),
// where it happens to be *wider* than the 32 guessed here before, not tighter.
export const WAYFINDING_GAP = 'gap-space-48 2xl:gap-space-64'

// Gap between subsections within one section. Work is spaced as widely as the
// top-level sections themselves (200); Approach and About use 120.
export const SUBSECTION_GAP_WORK = 'flex flex-col gap-space-140 2xl:gap-space-200'
export const SUBSECTION_GAP_EDITORIAL = 'flex flex-col gap-space-80 2xl:gap-space-120'

// --- Work grids (6 col / 60px gutter) ---------------------------------------

// Artifakt spans 5 of 6 -- not the full width. Below lg it's a normal block.
// The 6-column grid engages at lg with a 40px gutter rather than 60: at the
// tablet container (942 at a 1024 viewport) a 60 gutter leaves 97px columns,
// and the gutter starts to rival the column. 40 keeps col at 123.67.
//
// SPAN 4, NOT 5, ACROSS THE LAPTOP BAND. Flore's call, 2026-08-25, and it is
// the single biggest change in this pass. The featured card was 977x882 at a
// 1440x790 viewport: put its top edge at the top of the screen and its bottom
// edge lands at 868 with 790 of viewport. It could not be seen as one object,
// which is exactly why it read as a page section rather than as a card.
//
// The card contains a 447px-tall artwork, and that number is the whole reason.
// It could have been fixed by shrinking the artwork inside a full-width card
// -- but the media's internal proportions (artwork 90.10% of the frame, tint
// mat 55px each side) are designed, and shrinking the artwork to ~72% to buy
// height would have spent the design to fix the layout. Dropping a column
// spends the layout instead: 977 -> 649 wide, and because the frame height is
// a RATIO of the card width (see ProjectMedia), the media follows to 399 with
// every internal ratio untouched. Card height lands around 0.8 of a laptop
// screen, so the card, its whitespace and the next row are co-visible.
//
// Hierarchy survives: 649 still clears the 2-up card (562) and the 3-up (355),
// which is what makes it the featured one. It leaves two empty columns to the
// right at laptop -- deliberate, not an oversight. A card with air beside it is
// a card; a card that fills its row is a section.
//
// At 2xl it goes back to 5 and the Figma frame is reproduced exactly.
export const WORK_FEATURED_ROW = 'lg:grid lg:grid-cols-6 lg:gap-x-space-40 xl:gap-x-space-60'
export const WORK_FEATURED_CARD = 'lg:col-span-5 xl:col-span-4 2xl:col-span-5'

// The featured card sits 100 above the 2-up row beneath it (node 2928:73715).
// Was 200, matching the top-level section gap; Flore tightened it to 100 on
// 2026-08-04 so the Work rows read as one group rather than three sections.
// 72 at laptop: at a 790px viewport a 100px gap is an eighth of the screen
// spent on nothing, and this gap is precisely what has to be crossed for the
// next card to become visible alongside the one above it.
export const WORK_FEATURED_STACK = 'flex flex-col gap-space-72 2xl:gap-space-100'

// 2-up: span 6 each. Row gap 100 against a 60 gutter (node 2928:73730) --
// still more vertical air than horizontal, but the same 100 as the featured
// stack above it, so every Work row-to-row gap on the page is one number.
// Was 140; Flore aligned it with the projects on 2026-08-04.
// 72 at laptop, matching WORK_FEATURED_STACK -- the "one number for every Work
// row-to-row gap" property holds in both regimes, which is the point of it.
// The COLUMN gutter deliberately does not move: it is what the card widths are
// derived from, so changing it would resize every card sideways as well.
export const WORK_GRID_2UP =
  'grid grid-cols-1 gap-y-space-72 sm:grid-cols-2 sm:gap-x-space-24 lg:gap-x-space-40 xl:gap-x-space-60 2xl:gap-y-space-100'

// 3-up: span 4 each -- but only from xl. It used to go 3-up at lg, which
// inverted the zone hierarchy this file exists to protect: at a 1024 viewport
// three-across put the project cards at 298 while the editorial cards sat at
// their fixed 320/455, so the secondary content rendered wider than the work
// itself. Measured, not theorised. Staying 2-up through the tablet band puts
// them at ~451 instead, comfortably above the 320 editorial card, and 3-up
// resumes at xl where the container is wide enough to afford it.
// `grid-rows-[auto_auto]` is not decoration: the small cards SUBGRID onto these
// two tracks (media, then text) so that all three media panels take the height
// of the tallest -- Flore, 2026-08-28: "The height of the small cards group
// should adapt to the longest text (number of lines)."
//
// Without it each card sizes its own panel and a caption that wraps to an extra
// line leaves one panel standing proud of its neighbours. Verified in the
// browser: forcing a third line on one caption takes all three panels 255 ->
// 275 together.
//
// Only the 3-up row needs it, because it is the only grid whose cards carry a
// fixed-ratio panel that a caption can push past. See ProjectCard, which opts
// in on `size === 'small'` only.
export const WORK_GRID_3UP =
  'grid grid-cols-1 grid-rows-[auto_auto] gap-y-space-72 sm:grid-cols-2 sm:gap-x-space-24 lg:gap-x-space-40 xl:grid-cols-3 xl:gap-x-space-60'

// --- Editorial grids (12 col / 24px gutter) ---------------------------------

// Four ValueCards at span 3 each: 4*278 + 3*24 = 1184 exactly. On the same
// 12-column grid as the rest of the editorial zone rather than a standalone
// 4-up -- identical pixels either way, but this way the shared system is
// visible in the code instead of being a coincidence.
//
// (Figma briefly had these in a 1208-wide row that overflowed the container
// by 24px, using a 32px gutter. Flore has since removed that wrapper and put
// the cards on a real grid; the two now agree.)
// The card is a fixed 278 at every width, not a share of the container.
//
// It used to be a 1/2/12-column grid with the card filling its column, so the
// illustration ballooned as the viewport narrowed -- 278 at desktop but ~430
// at tablet and full-bleed on a phone, which is backwards: the cards got
// bigger exactly where there was least room. Flore's call 2026-08-04.
//
// auto-fit packs as many 278 columns as fit and reflows on its own: 4-up at
// the desktop frame, then 3, 2, 1 as it narrows, with no breakpoints to keep
// in sync. At 1184 it resolves to exactly the Figma row (4*278 + 3*24 = 1184).
//
// The minmax(min(278px,100%),278px) rather than a bare 278px is a safety
// valve: below a 310-ish viewport a fixed track would overflow the container
// instead of shrinking, and `min(...,100%)` lets the last column give way.
// No cell wrapper: the fixed track sizes the card, so the ValueCard is the
// grid item directly. (There was a wrapper carrying the column span before
// the track became fixed.)
export const VALUE_CARD_GRID =
  'grid grid-cols-[repeat(auto-fit,minmax(min(278px,100%),278px))] gap-y-space-40 gap-x-space-24'

// The Approach and About card blocks are staggered collages in Figma, not
// grids: fixed-width cards hand-placed with horizontal and vertical offsets.
// Per Flore they stay a collage at xl and collapse to a plain grid below,
// since hand-set offsets have nowhere to go on a narrow viewport.
const COLLAGE_BASE = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-space-24'

// Approach's talks/writing collage.
//
// The sm value is the tablet step these gaps were missing: base doubles as the
// phone value and ran unchanged all the way to lg, so the 2-up band inherited
// spacing designed for a single stacked column. Flore's call 2026-08-05, from
// looking at 976 -- the band needs more air between cards than the phone does,
// not the same amount.
//
// Larger at sm than at lg is correct, not a typo. From lg the collage's own
// offsets (mt 200/32) do most of the separating, so the row gap can be small;
// in the flat 2-up band the row gap is the only thing holding the cards apart.
export const COLLAGE_GRID = `${COLLAGE_BASE} gap-space-80 sm:gap-y-space-120 lg:gap-y-space-64`

// About's aside collage sits tighter, Flore's call 2026-08-04: the three cards
// read as one group rather than three separate things. Split from COLLAGE_GRID
// rather than tightening both, since only About was asked for -- the two
// collages were sharing a row gap purely because they happened to match.
//
// Tightened twice. This is now the only thing setting the vertical rhythm
// between the three cards: the per-card stagger offset was removed rather than
// reduced again, because stacking an offset on the row gap is what made the
// first gap 3.5x the second and kept the group from reading as a group. The
// collage character comes from the horizontal placement and the differing card
// widths, which are untouched -- the vertical offset was only adding
// inconsistency.
// Third pass, 24 at xl. This is the floor while AsideCard's own text-to-image
// gap is 16: the gap between two cards has to stay larger than the gap inside
// one, or proximity stops doing its job and it becomes ambiguous which caption
// belongs to which drawing. Tightening further means tightening AsideCard's
// internal gap first, not this number.
// The 32 is the phone value and stays: there the three cards are one stacked
// group, deliberately tight (see the note above about the AsideCard's own 16
// internal gap being the floor). But 32 was also running right through the 2-up
// band, where measured at 976 it left consecutive cards 32px apart with nothing
// else separating them -- by far the tightest gap on the page. 100 at sm, still
// below the media collage's 120 since these cards are shorter and carry no CTA.
export const ASIDE_COLLAGE_GRID = `${COLLAGE_BASE} gap-space-32 sm:gap-y-space-100 lg:gap-y-space-24`

// About only: the gap between the full-width Language River chart and the
// aside cards under it. Wider than the editorial subsection gap because the
// chart is a 1184-wide block butting up against 320-wide cards, and at 120 the
// two read as one run of content. Deliberately not SUBSECTION_GAP_EDITORIAL --
// that one also spaces Approach's two subsections, which weren't asked to move.
export const ABOUT_CONTENT_GAP = 'flex flex-col gap-space-120 2xl:gap-space-160'

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
// Fixed from lg, where the collage engages -- the card is a designed size, not
// a share of the container, so it holds at 320/480 right across the tablet
// band. What fills the extra width there is the staggered placement, not
// bigger cards: growing them would put the editorial cards back above the
// project cards, which is the inversion this file exists to prevent.
// The wide card steps 400 -> 480 across the band, and that step is load-
// bearing rather than cosmetic. The rule these two widths encode is a paired
// one: the normal card must stay under the smallest project card, and the wide
// card under the 2-up project card. In the tablet band the 2-up project card
// bottoms out at 451 (at a 1024 viewport), so a flat 480 would have made the
// widest editorial card the widest card on the page -- the same inversion the
// 3-up fix above removes, just one card along. 400 clears it, and it is the
// width Figma draws this card at, so it's a number already in the system.
// The 1.5x wide-to-normal relation is therefore only exact at xl; below it the
// ceiling set by the project cards wins, which is the right priority.
const EDITORIAL_CARD = 'max-w-[320px] lg:w-[320px]'
// `lg:max-w-none` is required, not tidy-up: max-w applies at every width, so
// leaving the 400 cap in place silently clamped the xl width back to 400 and
// quietly regressed the desktop layout. Caught in the browser, not by reading
// the classes. A max-w cap and a wider w further up the scale can't coexist.
const EDITORIAL_CARD_WIDE = 'max-w-[400px] lg:max-w-none lg:w-[400px] xl:w-[480px]'

// Placement per card, in content order. Column starts and spans are exact;
// the vertical offsets approximate Figma's, since real card heights are
// content-driven and won't match the fixed heights in the design file.
// Placements engage at lg, not xl. The column maths is fractional so the
// starts and spans carry straight over to the narrower tablet container; only
// the absolute offsets needed a second value, since those are real pixels and
// don't scale with the grid. Note the collage is exact only at >= 1280, where
// Container pins the inner box to 1184 (see Container.jsx); across the tablet
// band the inner box grows from 942 to 1184 and the insets drift slightly
// against it. That's fine for insets -- it would not have been for the card
// widths, which is why those stay fixed.
//
// Below lg the 12-column collage can't be used -- at a 640 viewport a span-7
// frame is only 345 wide, narrower than the wide card that has to sit in it,
// so the placements would overflow their own frames. The collage *feel* comes
// down instead as a vertical stagger on the 2-column grid: the right-hand
// column is pushed down so the two columns stop sharing a baseline, which is
// what made the flat band read as a plain table of cards. STAGGER_RIGHT is the
// offset, cleared again at lg where the real collage takes over.
//
// DOM order is what decides which column a card lands in at 2-up (items 0,1 in
// row one; 2,3 in row two), so the stagger goes on the odd indices.
const STAGGER_RIGHT = 'sm:mt-space-80'

// Horizontal half of the same idea. The 2-up columns are wider than the cards
// they hold -- 435 against 320 at a 976 viewport -- and all that slack was
// going unused with every card flush to its column start, which is most of why
// the band read as a table. Alternating justify-self spends it: row one pushes
// its two cards apart to the outer edges, row two pulls them toward the middle,
// so the block zigzags instead of ruling up.
//
// Deliberately NOT the real 12-column collage. That needs frames wider than the
// cards sitting in them, and at 640 a span-7 frame is 345 against a 400 wide
// card -- the placements would overflow themselves. Working inside the existing
// two columns can't overflow, because a card is never wider than its own
// column, and it degrades on its own: by 640 the slack has gone to zero and the
// zigzag simply flattens back to the vertical stagger.
//
// No lg reset needed on these -- every entry sets its own lg:justify-self.
const NUDGE_OUT = 'sm:justify-self-end'
const NUDGE_IN = 'sm:justify-self-start'

// At 2-up the zigzag runs: row one apart (left card left, right card right),
// row two together (left card right, right card left).
export const MEDIA_COLLAGE = [
  // Podcast (embed): right-aligned inside a span-10 frame -> x = 582.67.
  `${NUDGE_IN} lg:col-start-1 lg:col-span-10 lg:row-start-1 lg:justify-self-end ${EDITORIAL_CARD}`,
  // Friends of Figma: flush left. Right-hand column at 2-up, so it carries the
  // stagger -- cleared at lg, which sets no mt of its own here.
  `${STAGGER_RIGHT} ${NUDGE_OUT} lg:mt-0 lg:col-start-1 lg:col-span-6 lg:row-start-2 lg:justify-self-start ${EDITORIAL_CARD}`,
  // Swisscovid: right half, inset 100, and dropped below its row-mate -- 200 at
  // tablet against 300 at desktop, since the same drop against a shorter
  // container reads as a hole rather than a stagger.
  `${NUDGE_OUT} lg:col-start-7 lg:col-span-6 lg:row-start-2 lg:justify-self-start lg:ml-space-100 lg:mt-space-200 2xl:mt-space-300 ${EDITORIAL_CARD}`,
  // 10-year quiz: back to the left half, same 100 inset. Right-hand column at
  // 2-up; lg:mt-space-32 below already overrides the stagger, no reset needed.
  `${STAGGER_RIGHT} ${NUDGE_IN} lg:col-start-1 lg:col-span-6 lg:row-start-3 lg:justify-self-start lg:ml-space-100 lg:mt-space-32 ${EDITORIAL_CARD}`,
]

// Same zigzag, three cards: row one apart, then Papayas pulled in on row two.
export const ASIDE_COLLAGE = [
  // Cold Plunge: right-aligned inside a span-10 frame, same as the podcast.
  `${NUDGE_IN} lg:col-start-1 lg:col-span-10 lg:row-start-1 lg:justify-self-end ${EDITORIAL_CARD}`,
  // Data, Illustrated: flush left, the wide card in a span-7 frame. No vertical
  // offset -- it was 160, then 80, and each time it stacked on the row gap and
  // left the first card-to-card gap much larger than the second. Spacing here
  // is the grid's row gap alone; see ASIDE_COLLAGE_GRID.
  // (At 2-up it's the right-hand card in row one, so it takes the stagger.)
  `${STAGGER_RIGHT} ${NUDGE_OUT} lg:mt-0 lg:col-start-1 lg:col-span-7 lg:row-start-2 lg:justify-self-start ${EDITORIAL_CARD_WIDE}`,
  // Papayas: right-aligned to the full 12-column width -> x = 784.
  `${NUDGE_OUT} lg:col-start-1 lg:col-span-12 lg:row-start-3 lg:justify-self-end ${EDITORIAL_CARD}`,
]
