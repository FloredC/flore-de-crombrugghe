/**
 * The case-study page layout system — widths and vertical rhythm for every
 * page under `/work/*`. Companion to `layout.js`, which owns the homepage.
 *
 * WHY THESE ARE JS CONSTANTS AND NOT `:root` TOKENS
 *
 * CASE-STUDY-SYSTEM.md asks for "four widths as tokens". They live here rather
 * than in `src/styles/tokens/*.css` for the same reason the homepage grid does
 * (see layout.js): the token CSS files are a verbatim Figma export, and hand-
 * adding a variable to them puts a value in the export that Figma has never
 * heard of — exactly the drift CLAUDE.md's no-duplication rule exists to stop.
 * Adding to `:root` also needs Flore's sign-off, and nothing here needs to be
 * a CSS custom property: no component reads these at runtime or themes them.
 * They are named, single-source and reused, which is what "as tokens" is for.
 *
 * Every *value* inside them still resolves to a real design token — the widths
 * are the only new numbers, and they are measures, not spacing or colour.
 *
 * ---------------------------------------------------------------------------
 * THE FOUR WIDTHS
 *
 * All four are applied inside `Container`, so they inherit its fluid padding
 * and its 1280 cap — except `bleed`, which deliberately escapes both.
 *
 *   narrow  62ch    the reading measure. `ch` rather than px so it tracks the
 *                   reader's font size instead of fighting it — the same
 *                   reasoning behind the rem-based type scale in
 *                   tailwind.config.js. At the desktop body size this lands
 *                   around 560px.
 *   medium  860px   evidence that wants more room than prose but shouldn't
 *                   span the page. Sits between narrow and wide with a clear
 *                   step either side; a value much closer to either would stop
 *                   reading as its own width, which is what Rule 1 is for.
 *   wide    —       Container's own inner box (exactly 1184 at >= 1280). No
 *                   max-w of its own: adding one would silently diverge from
 *                   the homepage's content width.
 *   bleed   100%    edge to edge, outside Container entirely.
 *
 * ---------------------------------------------------------------------------
 * RULE 1 — no two consecutive blocks share a width
 *
 * Not enforceable by these constants alone; it's a property of the sequence,
 * so `CaseStudy.jsx` checks the rendered order at runtime in dev and throws.
 * A rule nobody can see is a rule that rots.
 */

// --- The width scale --------------------------------------------------------

// `wide` is the empty string on purpose: it means "whatever Container gives
// you", so it can't drift from the homepage's content width by carrying a
// duplicate number.
// LEFT-ALIGNED, not centred. Flore's call, 2026-08-12, and it matches the
// Figma frame: every text container and card group in it starts at the same
// x=171, so the page has one continuous left edge and only the RIGHT edge
// moves as the width changes.
//
// These carried `mx-auto` before, which centred each block inside the
// container. Rule 1 still "held" — the widths did alternate — but centring
// spent the alternation on both edges at once, so the left edge stepped in and
// out down the page and nothing lined up. The rhythm is supposed to come from
// where a block ENDS, against a fixed start.
export const WIDTH = {
  narrow: 'w-full max-w-[62ch]',
  medium: 'w-full max-w-[860px]',
  wide: '',
  bleed: '',
}

export const WIDTHS = Object.keys(WIDTH)

// --- Rule 3: three vertical spacing steps, and only three -------------------
//
// Every value is a real spacing token. The three steps are deliberately far
// apart — a reader should never have to decide whether two things are in the
// same group.
//
//   tight    evidence -> its caption. Matches ProjectMedia's own caption gap,
//            so a caption sits the same distance from its image here as it
//            does on a homepage card.
//   default  between items inside one block.
//   break    between blocks. Same rhythm as the homepage's editorial
//            subsection gap, so a case study breathes like the rest of the
//            site rather than inventing a second tempo.
export const SPACE = {
  tight: 'gap-space-12',
  default: 'gap-space-24',
  break: 'gap-space-80 xl:gap-space-120',
}

// --- Named measures ---------------------------------------------------------
//
// Max-widths that are neither a width-scale step nor a spacing token. They live
// here for the same reason the width scale does: a measure written inline in a
// component is a raw px value nobody can find again, and these two both come
// from somewhere specific.
//
//   guideBubble   the case-study Guide's speech bubble.
//
//                 Figma draws this at 520px (nodes 4774:7579 / 4774:7661) and
//                 it was built at that, but Flore found the result too long on
//                 the page and asked for shorter lines, 2026-08-12 — so this is
//                 a deliberate override of the frame, not a sample from it.
//
//                 In `ch`, not px, and that matters here specifically: the
//                 bubble text was just enlarged from 14px to 16px, which is
//                 what made a 520px box start reading long — the same width now
//                 holds ~58 characters per line. A `ch` cap is a measure of
//                 LINE LENGTH rather than of pixels, so it holds its reading
//                 rhythm if the type changes again, and it scales for anyone
//                 who bumps their browser font size (the same reasoning behind
//                 the rem-based type scale in tailwind.config.js).
//
//                 38ch measures 383px at the desktop text size, down from 520
//                 — a 26% cut. Worth knowing for tuning: HK Grotesk's `0` is
//                 ~10.1px wide at 16px, so 1ch is a little over 10px here, and
//                 44ch (the first attempt) came out at 443px, which still broke
//                 the shorter note at the same 3 lines and so read as no change
//                 at all. Measured, not assumed.
//
//                 This is the number to tune if it wants to be shorter or
//                 longer again — one value, one place. Narrower trades width
//                 for height, and the Process note is the long one, so check
//                 that bubble rather than the Turning Point one when judging.
//   NEXT_CARD     the 2-up project card width from the homepage grid --
//                 (1184 - 5*60)/6 * 3 = 562 exactly. See lib/layout.js, which
//                 documents the same number as `span 3 = 562`. Used so the card
//                 in Onward renders at a real homepage size instead of
//                 stretching to fill whatever block holds it.
export const MEASURE = {
  guideBubble: 'max-w-[38ch]',
  nextCard: 'max-w-[562px]',
}

// --- Media display widths ---------------------------------------------------
//
// How WIDE each asset is drawn, measured off the Figma frame. Flore's call,
// 2026-08-12: assets get standard sizing from the design rather than being
// allowed to fill whatever block holds them.
//
// This is the fix for "the curve images are way too big". The momentum curve is
// 2880x2048, and at the full 1184 content width that resolved to 842px tall --
// taller than most laptop viewports, so it filled the screen on its own. Figma
// draws it at 724, which is 515 tall. The design width was doing real work and
// I had ignored it.
//
// IMPORTANT — these cap the width only. They never crop and never force a
// ratio: the media keeps its own proportions inside the cap (see Media.jsx).
// That is what keeps Flore's earlier point intact for the screencasts, which
// are portrait 1432x1660 and must not be cropped to fit a landscape box.
//
//   hero      449.46  image 8,   right column of the 1232 hero content frame
//   banner   1164.67  image 12,  inset in the 1282x407 stage
//   feature   400     Container, centred in the 617 VisualFrame
//   curve     724     image 9,   in the 1184 Process frame
export const MEDIA_WIDTH = {
  hero: 450,
  banner: 1164,
  feature: 400,
  curve: 724,
}

// A Thesis gets DOUBLE break above and below. Applied as padding on the block
// itself rather than a bigger gap in the stack, because the stack's gap is one
// value for every boundary — special-casing one child from the parent would
// mean the parent knowing which child is a Thesis.
export const THESIS_BREATH = 'py-space-80 xl:py-space-120'
