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
//   chapter  between BLOCKS INSIDE one chapter. Added 2026-08-14 after Flore
//            reported the chapters were hard to tell apart, and it is the step
//            the scale was missing rather than a tweak to the others.
//
//            Every block used to be a flat sibling at `break`, so a section
//            header sat exactly as far from its own prose as from the next
//            chapter — there was no distance that meant "these belong
//            together", so nothing grouped. Measured off the Figma frame
//            (4774:7504), where consecutive blocks inside a section are 40
//            apart: title frame ends 110, speech bubble starts 150; bubble ends
//            288, quotes start 328.
export const SPACE = {
  tight: 'gap-space-12',
  default: 'gap-space-24',
  chapter: 'gap-space-40',
  // Raised from 120 to 140 at xl, also from the frame: content-to-content
  // across a section boundary measures 130-144 there (e.g. the What image ends
  // at 650 and the Why title starts at 794). 80 stays at small sizes -- the
  // frame is a desktop layout and 140 is too much of a hole on a phone.
  break: 'gap-space-80 xl:gap-space-140',
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
//                 Figma draws this at 520px (nodes 4774:7579 / 4825:2590) and
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
  // RE-DERIVED 2026-08-14 for the bubble's new 18px text, matched to a real
  // node: Flore's mock (4825:2590) draws the bubble 396.5 wide.
  //
  // Still `ch` rather than px, for the reason the long note above gives -- but
  // the number had to move, because `ch` scales with the font and the font
  // just changed. Two things made that harder than it sounds, and both were
  // only visible by measuring in the browser:
  //
  //  1. `ch` resolved in the WRONG font size. The cap sits on SpeechBubble's
  //     outer wrapper, which inherited the body's 16px while the text rendered
  //     at 18. Fixed there by moving the size class onto that same element;
  //     until that fix, no value here could be reasoned about.
  //  2. HK Grotesk's `0` is ~0.56em, not the ~0.63em an earlier probe in this
  //     file's history suggested. So 1ch is ~10.1px at the 18px desktop end,
  //     and the mock's 396.5 is ~39ch -- NOT the 35ch a naive rescale of the
  //     old 38ch gives, which measured 342 and pushed the Process note from
  //     7 rendered lines to 8.
  //
  // Measure, don't rescale: a ch value carried across a type change is a
  // different width, and it looks untouched in the diff.
  guideBubble: 'max-w-[39ch]',
  nextCard: 'max-w-[562px]',
}

// The case-study Guide's avatar width, in px.
//
// Now sampled: the Avatar instance in Flore's mock (node 4825:2590) is 106
// wide. This was briefly 112, a judgment call made before the Figma MCP was
// available in the session.
//
// KNOWN DISCREPANCY, flagged. Figma draws that avatar 106 x 78.5 -- ratio
// 1.35 -- while `avatar-sections-left.svg` is 80 x 75, ratio 1.07. Same width
// therefore does NOT give the same height: at 106 wide this renders ~99 tall
// against the mock's 78.5. Either the mock uses a different illustration, or
// it was scaled non-proportionally when it was detached. Width is matched
// here because squashing the SVG to hit both numbers would distort the
// drawing, which is never the right trade. Worth Flore confirming which
// avatar the mock is using.
//
// Homepage avatars are untouched: they pass no `width` at all and keep
// rendering at their natural 80 (see Avatar.jsx).
export const GUIDE_AVATAR_WIDTH = 106

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
//   feature   560     Was 400, measured from Figma's VisualFrame. Raised on
//                     2026-08-14 at Flore's request: the two screencasts are
//                     the only place the product's actual UI is shown at size,
//                     and at 400 the panel's own type was too small to read.
//                     560 fills the FeatureBlock's half of the 1184 `wide`
//                     block (two columns, 48 gap => 568 each), so the video now
//                     uses its column rather than sitting small inside it.
//                     A deliberate divergence from the frame, not a sample.
//
// `curve` is GONE, deliberately. It was 724 when the momentum graphic was a
// single asset. Flore split it into chart + legend on 2026-08-14 so the two can
// be arranged by screen size, and they are now sized by the grid that holds
// them (CaseStudy.jsx, 65/35 after Figma) rather than by a fixed cap. A cap
// here would fight that grid. Nothing else referenced it.
export const MEDIA_WIDTH = {
  hero: 450,
  banner: 1164,
  feature: 560,
}

// A Thesis gets DOUBLE break above and below. Applied as padding on the block
// itself rather than a bigger gap in the stack, because the stack's gap is one
// value for every boundary — special-casing one child from the parent would
// mean the parent knowing which child is a Thesis.
export const THESIS_BREATH = 'py-space-80 xl:py-space-120'
