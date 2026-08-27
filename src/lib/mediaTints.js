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
  pitchpivot: '#dfe8fd',
  rega: 'var(--colors-chart-chart-red-fill)',
  sbb: '#efefef',
  myride: '#e1e2f7',
  'trail-app': '#e5efe1',
  sinomocene: '#ffe4e7',
  teamchatviz: '#d8fbfc',
  roche: 'var(--white)',
}

// Anything not listed falls back to the frame's own surface rather than a
// guessed colour, so a new project reads as "tint not chosen yet".
export const DEFAULT_MEDIA_TINT = 'var(--colors-surface-background)'
