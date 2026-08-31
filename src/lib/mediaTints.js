// Background tint behind each project's artwork, sampled per instance from the
// real ProjectCard nodes on the desktop page frame (not from the ProjectMedia
// component default, which is authored from Artifakt and Sinomocene).
//
// The tint sits on the frame's inner fill, behind the artwork. Because the
// artwork is smaller than the frame, the tint is what reads as the inset --
// without it the media frames look unfinished, which is why they did until now.
//
// THREE of the ten now resolve to real tokens; the other seven are one-off
// fills authored directly on the instance. Kept as literals here rather than
// invented token names, since inventing a token that doesn't exist in Figma
// would be exactly the drift the no-duplication rule guards against. Worth
// raising with Flore as a tokenisation candidate -- seven bespoke pastels is
// a palette whether or not it's currently named as one.
//
// Artifakt joined the tokenised three on 2026-08-21. It was the literal
// #fdffe6, and this file's own note above is what flagged it: the colour DOES
// have a Figma name, `Colors/Surface/yellow`, it just wasn't in the token
// CSS export yet. It is now (see semantic.css), so the duplicate hex is gone
// and the homepage card tint and the Artifakt case-study stages are one value
// in one place. Confirmed identical in the browser, not assumed.
export const mediaTints = {
  artifakt: 'var(--colors-surface-yellow)',
  'welcome-to-my-island': '#f6f9ff',
  // WAS #dfe8fd, the blue sampled from the Figma card. Replaced 2026-08-31 at
  // Flore's call so the card carries the case study's own paper: this plus
  // `bg-notebook-lines` below composes to exactly `.bg-notebook`, the surface
  // every panel on the PitchPivot page uses.
  //
  // I argued for keeping the blue underneath and was wrong about what she
  // wanted -- recorded because the argument still holds and someone may hit it:
  // the artwork is a white browser window, so on this near-white ground its own
  // edge reads faintly and the frame leans on the screenshot's border rather
  // than on an inset. Seen and chosen. Do not "restore" the blue as a fix.
  pitchpivot: 'var(--notebook-ground)',
  rega: 'var(--colors-chart-chart-red-fill)',
  sbb: '#efefef',
  myride: '#e1e2f7',
  'trail-app': '#e5efe1',
  sinomocene: '#ffe4e7',
  // `--blue-10`, Flore 2026-08-28. A PRIMITIVE, referenced knowingly: she named
  // it as the value and flagged the same thing this file's note above already
  // says -- "the color of the teamchatviz background is blue_10, a primitive
  // which is not ideal. i have that problem for all the backgrounds in the
  // cards. i think i'll review all the colors at some point and create semantic
  // tokens."
  //
  // NOT written as `var(--colors-surface-canvas)` even though that token also
  // resolves to `--blue-10` today. They are equal by coincidence, not by
  // meaning: surface-canvas is the page/hero stage, and pointing a card tint at
  // it would silently couple the two, so re-theming one would move the other.
  // The primitive is the honest reference until the semantic pass names it.
  teamchatviz: 'var(--blue-10)',
  roche: 'var(--white)',
}

// Anything not listed falls back to the frame's own surface rather than a
// guessed colour, so a new project reads as "tint not chosen yet".
export const DEFAULT_MEDIA_TINT = 'var(--colors-surface-background)'

// A PATTERN LAID OVER THE TINT, not instead of it -- Flore, 2026-08-31: "for
// PitchPivot, can you use that same graph paper effect as on the page itself".
//
// It sits here rather than in the component because it is the same kind of
// decision as the tint above: a per-project surface choice, made per instance.
// A card either has one or it doesn't.
//
// THE PATTERN IS THE GRID ONLY; the ground is still the tint above. That split
// is what lets PitchPivot land on exactly `.bg-notebook` -- `--notebook-ground`
// as the tint, this class as the lines -- without either file duplicating the
// other's value.
//
// It also means a future card can take the grid over a coloured ground if that
// is ever wanted; the mechanism does not assume near-white.
export const mediaPatterns = {
  pitchpivot: 'bg-notebook-lines',
}
