/**
 * The reading-progress line — 3px along the absolute top edge of the viewport.
 *
 * Figma: `Progress Bar Track` (node 5052:7434). A track and a fill, no
 * container, no label, no percentage. It is meant to be noticed peripherally
 * or not at all.
 *
 * `aria-hidden`, and that is the accessible choice rather than an omission: a
 * `role="progressbar"` here would announce a number on every scroll for
 * information the reader already has from the content. The chapter nav carries
 * the accessible version of "where am I" via `aria-current`.
 *
 * THE FILL IS DRIVEN BY AN INLINE TRANSFORM, written by `useChapterProgress`
 * on a rAF. Safe here because nothing else on this element sets `transform` --
 * the class list contributes `origin-left` and `scale-x-0` (the at-rest state
 * before the first frame), and an inline `transform` cleanly replaces the
 * latter. Worth being explicit about, because the site has already been bitten
 * once by an inline style silently beating a utility class it had to compose
 * with (see the marker focus-ring note in CLAUDE.md). If this element ever
 * needs a second transform, both belong in the same inline string.
 *
 * NO CSS TRANSITION on the fill. It tracks scroll position directly, so it is
 * already as smooth as the scroll is; a transition would only add lag between
 * the page and the line. Nothing here animates on its own, so there is no
 * `prefers-reduced-motion` case to answer -- a bar that moves only because the
 * reader is moving the page is not motion the reader did not ask for.
 *
 * TRACK COLOUR is `surface-subtle` (grey-10, #e6e6e3). Figma paints the track
 * with a raw #f2f2f0 that is not bound to any variable, so there was no token
 * to carry over; grey-10 is the nearest real one and is a shade darker.
 * Flagged to Flore -- at 3px the difference is not visible side by side, but if
 * the track should be lighter than the token, that is a value Figma needs to
 * name.
 */
export default function ReadingProgress({ fillRef }) {
  return (
    <div
      aria-hidden="true"
      data-component="reading-progress"
      // z-40 puts it above the global nav's wrapper (z-30). They never overlap
      // -- the nav pill sits 16px down from the edge and this is the top 3px --
      // but the wrapper itself spans the full width from y=0, so without this
      // the line would be under a transparent element and one future background
      // on that wrapper away from disappearing.
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-surface-subtle"
    >
      {/* `bg-accent` (#321366), not `text-primary` -- Flore, 2026-08-30. The
          fill was the same near-black as the body copy, which made a 3px line
          across the top of a text page read as part of the page furniture. A
          colour that appears nowhere else in the reading column is what makes it
          legible as a measure of something. */}
      <div ref={fillRef} className="h-full w-full origin-left scale-x-0 bg-accent" />
    </div>
  )
}
