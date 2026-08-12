# Handoff — current state

**Snapshot taken 6 Aug 2026. Verified against the running site, not from memory.**

## What this file is, and what it isn't

A short orientation for picking the project back up: what's live, what's genuinely
open, what's deliberately parked. That's all.

It is **not** authoritative on anything else. `CLAUDE.md` owns architecture,
conventions and decisions; Figma owns visual values; `process-docs/` holds the
history of how things got decided.

**It used to be a numbered build plan, and that's exactly what went wrong.** The
plan listed passes 3, 5 and 6 as unbuilt long after all three shipped, and on
2026-08-06 that cost real time: the stale "hover/focus/active — not built" line
read as a blocker for user testing, because hotspot discoverability is a core
research question and a missing hover affordance would make a null result
uninterpretable. The affordance was there the whole time. A second status list
that nobody updates is worse than no status list, so this file now says as
little as possible and dates what it does say.

**Write status here in terms of what a visitor sees**, never which code fields
are populated — the same rule the content-wiring log arrived at for the same
reason.

## Live

<https://floredc.github.io/flore-de-crombrugghe/> — deploys automatically on every
push to `main` via `.github/workflows/deploy.yml`.

Homepage is complete and content-real. Deep links to case studies work
(`/work/artifakt` and the other five), including on refresh and when shared.
Favicon and link-preview metadata are live.

**Hover, focus and active states are built**, including on the map hotspots:
hovering a marker opens its popover *and* lights up that hotspot's illustrated
highlight on the map. Keyboard focus works throughout, and every control has a
visible focus ring. Verified 2026-08-06 by hovering a real marker and watching
`aria-expanded` flip, the popover mount, and the highlight become visible.

## Genuinely open

**Flore's, and blocking nothing else**

- The six case-study bodies are still scaffolding prose. Deliberate — the subpages
  haven't been designed yet. `/work/:slug` routes work; the pages are stubs.
- Lab avatar wants re-exporting with Figma's **Include "id" attribute** ticked, from
  the **107×93 frame that contains the halo** (an attempt on 2026-08-06 came from the
  older 275×218 frame and had no halo, so it wasn't used). Until then that component
  identifies its paths by document order, which silently breaks if layers are
  reordered. Its `arm-resting` layer also has two leading spaces in the name.
- The Approach "Selected talks & writing" bubble copy is the one string where the
  **code is ahead of Figma** — a re-pull of node 4494:6497 would reintroduce a typo.
- Map scale floor is unset, so the dev-only readout stays in `Hero.jsx`.

**Code, small**

- `public/language-river.html` loads Chart.js from cdnjs and its font from
  fonts.bunny.net. If either is unreachable the chart renders blank or wrong. It's
  generated elsewhere — fix at the source, don't hand-edit. **The only thing on this
  list that can visibly fail during a testing session.**
- The Guide's speech bubble is a hard `max-w-[300px]`. That, not font size, is what
  crowds the map at small sizes.
- Both animated avatars override their exported stroke to `1.05` in code. Temporary:
  once a weight is settled it belongs in Figma, applied to both, and the overrides
  come out.
- `DEV_LOOP_FOR_REVIEW` in `AvatarRega.jsx` is on, looping the wind reaction for
  review. Dev-only and compiled out of production; set to `false` when done.
- Footer's CV link points at Google Drive — works only while shared publicly.

## Known and accepted

- Between 640 and 1023 the work and editorial cards land within a few pixels of each
  other, so the size hierarchy doesn't read. Structural: both zones fill their 2-up
  columns. Not a bug, a consequence.
- Nav and Footer mobile type is inferred — there is no mobile frame in Figma to
  sample from.
- A base-path bug cannot appear in `npm run dev`, by design. Use
  `npm run preview:pages` to exercise the real thing; it's the only local setup that
  serves under the deployed base path.
