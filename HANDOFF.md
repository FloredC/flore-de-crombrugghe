# Handoff — next sessions

Continuing the portfolio site (branch: `feature/site-build`).

Read `CLAUDE.md` first. Note the **no-duplication rule** at the top — it's load-bearing. That
file must contain no sampled values; Figma owns anything visually specifiable, and you
reference nodes rather than restating them. It exists because the wayfinding colour drifted:
the doc said accent-orange, Flore changed her mind in Figma, the code kept following the stale
doc, and nobody noticed until it was live. **That bug is still in the code** — see pass 4.

---

## Where we are

The homepage is content-complete and now sits on a real layout system. Nav, footer, buttons,
popovers, hotspots and the map all work. Cards have their media, tints and badges. The hero and
map are responsive; nothing else is yet.

**Next up is pass 2 (card internals), then pass 3 (responsive).** Passes 0 and 1 are done and
should not be re-derived — see below for what was settled and what it cost to get wrong.

---

## Order of work — this order matters

A dependency chain: **image → card → grid → page rhythm → type.** Image dimensions set card
height, card height sets grid behaviour, grid sets where sections begin and end, and all of it
determines where text wraps, which is the input to the type pass. Going the other direction
means redoing each step when the one beneath it moves.

### 0. Global layout system — **DONE** (`8353c6b`, `7e173cd`). Don't re-derive it.

Measured from `bp-1622-desktop` (`2928:73693`) and `402-mobile` (`2928:78203`), and lives in
**`src/lib/layout.js`**, each constant annotated with the node it came from. Verified in the
browser: container chain, section rhythm, every card width and collage offset match Figma to
sub-pixel. See CLAUDE.md → Layout System for the decisions.

**Read the grids off the Figma frames, not off card widths.** Work is 6 columns / 60px gutter
(Artifakt spans 5, 2-up spans 3, 3-up spans 2); Approach and About are 12 columns / 24px. Work's
widths happen to land on a 12-column grid at the same gutter too, so it can be described either
way with identical pixels — one pass documented it as 12 and had every Work span at double what
Figma shows. Rendered fine, reconciled with the design file never.

**Answered by Flore:** the gutter difference is intentional; Approach/About stay a staggered
collage at desktop and collapse to a grid below `xl`; mobile side margin follows Figma; above
the desktop frame the map stays capped at native width and centred (letting it scale to fill
the viewport was tried and rejected — don't re-propose).

**Two Figma slips surfaced and were fixed in the file rather than worked around:** the over-wide
ValueCard wrapper frame, and Work's tighter section-header and Wayfinding gaps.

### 1. Card media — **DONE** (`244aec2`, `c0f030d`, `74784ab`, `5161a48`).

Aspect ratio is a property of the card *variant*, sampled from the component set, never from an
instance:

| Card type | Rule | Source node |
|---|---|---|
| ProjectCard | large `880/447`, medium `530/315`, small `320/278` | `2928:78077` |
| MediaCard | all images 4:3. The podcast is the `Embed` variant — an iframe, keeps its own height | `4522:18868` |
| AsideCard | all three variants are 4:3, so `size` picks a **max width**, not a ratio | `4533:19992` |

**The structural correction worth remembering: the artwork is not inset by padding.** The media
frame is the card's full width at a fixed height, with fixed-size artwork centred inside it —
the "inset" is the tinted background showing around it. The tint was the missing piece that made
frames look unfinished, not the spacing. Now in `ProjectMedia.jsx` as ratios and percentages
(exact at the desktop frame, scales below it), with per-project tints in `src/lib/mediaTints.js`.

Three implementation traps recorded because they were invisible from the code:

- **The frame's border is an overlay, not a real border.** As a real border it shrank the box
  the artwork percentages resolve against — every artwork came out ~0.4% narrow and the small
  variant's deliberate right-bleed stopped reaching the edge.
- **Frame height comes from a grid ratio spacer, not `aspect-ratio`.** `aspect-ratio` makes the
  height exact, so at 402 the large card's caption ran past the bottom edge and was clipped.
- **Small ProjectCards bleed their artwork off the right edge** with tint only on the left.
  Verified against the rendered Figma frame — deliberate, not a slip.

**Card order was alphabetical-by-filename**, so all three Work groups were shuffled against
Figma. Nothing in the frontmatter had encoded reading order. There is now an explicit `order`
field per project, sorted in `getProjectsFor`.

**Still open here:**
- **Min/max widths on the image containers** — Flore mentioned adding these in Figma; they are
  still not there. The percentage model works without them; only revisit if artwork misbehaves
  during pass 3.
- **Artifakt thumbnail is 1.933 against a 1.969 frame**, so ~1.9% (≈8px) still crops. Invisible
  in practice; only worth a re-export at 880×447 if Flore wants it pixel-exact.

### Map & hero — **DONE** (`8274f30`, `6ee1d81`, `12f6365`, `ec1cc80`, `1fdf732`).

Not a numbered pass — this is pass 3 work pulled forward because it's what Flore was testing.
The rest of the page is still unresponsive.

The old rule was binary: native at ≥1622, crop + pan below. 1622 is the map's own width, wider
than any real laptop, so nearly every desktop cropped. **The binding constraint turned out to be
height, not width** — at 1500×820 the width is 92% adequate and it's the height that forces the
map to 0.74. Width survives only as the phone cutoff (768), where it genuinely is about width.

- Map scales to fit both axes via CSS `max-width`/`max-height`, **never `transform: scale()`** —
  a transform scales the hotspots' 44×44 hit areas with the artwork (33px at 0.75, under the
  WCAG minimum). Checked first: the closest hotspot pair is 153px apart at native, so 44px
  targets don't collide until scale 0.288. Tap targets never limit how far the map can scale.
- Hero height comes from the map, not the viewport. `min-h-svh` parked a band of empty canvas
  above the map on tall windows and pushed the next section off screen.
- Below 768 the crop + two-finger-pan branch is unchanged, and the Guide stacks above the map as
  the 402 frame has it. Above 768 the Guide overlays the map's empty top-left corner — which is
  what makes the empty top-right band disappear. It was never a z-index problem.
- **A dev-only scale readout is currently in `Hero.jsx`** (`import.meta.env.DEV`, confirmed
  stripped from `dist`). It exists to set the scale floor from an observed number rather than a
  guess. **The floor is still not set** — remove the readout once it is.

### 2. Card internals — **NEXT.**

Component spacing and content rhythm inside ProjectCard, MediaCard, AsideCard, ValueCard.

Pull each as a **whole component set**, enumerate the full variant × state matrix, then diff
Figma's layers against the content model asking *"what does Figma have that I have no field
for?"* — that direction is what caught `meta`, the image captions and the ValueCard image slot.
Asked the other way round they were all missed.

**Button stretch — fixed, but it will recur.** An `inline-flex` button as a direct child of a
`flex flex-col` gets blown out to full width by flex's default `align-items: stretch`. MediaCard
hit it; ProjectCard escaped only because its button sits in a block wrapper. Any new card type
needs `self-start` or a block wrapper.

### 3. Responsive

Everything except the hero and map. See the working method below.

### 4. Wayfinding — **contains a live bug.**

`DistrictBreadcrumb.jsx:32` renders the subsection in `text-action-accent-foreground` (orange).
Figma shows no orange — sample the real colours from node `4494:6080`. The comment above that
line still cites `CLAUDE.md` as the authority, which is now inverted; rewrite it.

This is the original drift the no-duplication rule was written for, still sitting in the code.
It's small and standalone — worth doing whenever, not blocked on anything. Breadcrumb / avatar /
bubble responsiveness stays part of this pass.

### 5. States & interactions

Hover/focus/active sweep across everything built since the button audit — cards, badges,
captions, the embed.

### 6. Typography

All breakpoints, once wrapping is final.

**Where the scale is today:** seven styles in `tailwind.config.js` → `theme.extend.fontSize`,
**all in px, no rem anywhere**, across ~25 call sites. `h1` 36 / `h2` 32 / `body-lg` 20 /
`body` 18 / `body-sm` 16 / `caption` 14 / `caption-sm` 12. Figma's Desktop styles only.

**Agreed approach:**

- **Convert to rem.** px ignores the reader's browser font-size setting entirely, so the site
  currently can't be scaled up by anyone who needs that.
- **Fluid `clamp()` per style, not breakpoint steps**, anchored at the two real Figma frames
  (402 and 1622) so both ends are exact and only the middle interpolates. Same reasoning as
  `Container` padding — stepping that through breakpoints made the inner width run *backwards*
  at each boundary. A clamp can't.
- **All of it in the token layer**, so components keep writing `text-body` and none of the ~25
  call sites change. No `md:text-*` scattered around to drift.
- **Pull Figma's `Mobile/*` text styles — don't invent them.** They exist: `Mobile/caption` (12)
  and `Mobile/body-bold` (16) have both come back in design-context pulls. Flore's "body text
  around 16px on mobile" matches what's already in the file.

**Two things this pass owns:**

- **The Guide's speech bubble is a hard `max-w-[300px]`.** That, not font size, is what crowds
  the map at small sizes — smaller text in a fixed-width box just means more words per line. The
  Guide is 36.4% of the map at 824px. Make the bubble width responsive here, then re-measure.
  **Only if it's still above ~30% should stacking the Guide below ~1000px be revisited** —
  Flore's read, which the numbers support, is that it probably won't be needed.
- **A scale transform on the Guide was removed on 2026-08-04, deliberately.** It shrank the whole
  group with the map, which silently reset every type size inside it: the bubble's 14px painted
  at 12, the name and role at 15.5. It looked like an avatar-sizing change and was in fact an
  undocumented mobile type scale. **Don't reintroduce a container transform to solve a type
  problem** — if the Guide's text should be smaller at small viewports, that belongs in the
  scale, where it's visible and named. The hero avatar keeps its own explicit
  `w-[70px] lg:w-[108px]`, the only thing shrinking the Guide now.

### 7. Quality

Content polish, a11y audit, cross-browser (Safari first), performance, launch QA.

---

## Working method for responsiveness

Figma has 402 and 1622 frames only. Everything between is interpolation — that's where the
current unconfirmed 768px nav breakpoint came from.

**The loop:** propose the candidate breakpoints, implement, then send Flore a screenshot set per
section at each one, and she validates them **one by one**. Derive candidates from where the
grid actually breaks — the width at which cards drop below a sensible minimum — not from device
fashion. 1024 is likely identical to desktop; 768 is genuinely undecided.

Reflow intent per section (3-up → 2-up → 1-up, or straight to 1-up) is **not yet defined**.
Propose it with screenshots rather than guessing silently.

---

## Subpages — all six are blocked on design. Do not start them.

`ProjectPage.jsx` is a 40-line stub. Six routes are planned (`artifakt`, `pitchpivot`,
`welcome-to-my-city`, `sinomocene`, `teamchatviz`, `roche`).

**None are ready to build.** Figma has one subpage frame — `Supage_pitchpivot`, node
`2928:74096` — but Flore is **still designing it**. Treat it as work in progress, not a spec: do
not pull content or layout from it. The other five have no design at all.

There is nothing to chase Flore about here. Not missing copy, not an oversight — the pages
simply haven't been designed. Wait until she says one is ready.

The MDX **bodies** — the prose that renders on the subpage — are still scaffolding for all six
and should stay that way. That is a different thing from the homepage **card** copy, which is
real. Conflating the two has caused confusion twice.

---

## Open questions for Flore

Batched so they don't block mid-pass:

1. **Eight bespoke pastel media tints** — should they become real tokens? Two of the ten already
   are (`chart-red-fill`, `white`).
2. **Have the four `REVIEW —` cards been fixed in Figma?** Artifakt caption, PitchPivot caption,
   Rega meta + caption still hold unedited ProjectCard component defaults. Re-pull only if yes.
3. **The map's scale floor is still unset.** Below what scale should the map crop + pan instead
   of shrinking? The dev readout exists to answer this; it comes out once she has.
4. **The case-study badge diverges from Figma on purpose** — Flore asked for a `border-grey`
   rule, Figma still has `text-primary`. Also, her transparent-badge change was made on the
   *instance* in the Badges section, not the main component, so the ProjectCard instances in
   Figma still show the old dark tab. Worth pushing to the component.

## Known defects not yet scheduled

- **`--white-transparent` is broken in the exported tokens**: `#ffffff`, fully opaque, where
  Figma has 33% white. Both badges sidestep it with `bg-white/[0.33]`. Fix at the export.
- **`public/language-river.html` loads Chart.js and HK Grotesk from CDNs** — contradicts the
  self-hosted-font rule and renders blank if cdnjs is unreachable. Generated from a separate
  source project: **never hand-edit it**, flag it to Flore.
- Contact bubble copy, the Approach "Selected talks & writing" bubble (marked `TO COMPLETE`),
  and the LinkedIn URL. Flore will do a content pass at the end, once layout is stable.

---

## How to work

- **Content wiring means media + the actual written content, both pulled from Figma.** Missing
  copy means *not yet pulled*, not *not yet written* — check Figma before ever asking Flore to
  write or approve copy.
- **Pull whole components, not the node you think you need.** Worrying about Figma MCP cost made
  things *more* expensive — four partial pulls plus rounds of Flore reporting gaps, when one
  complete pass would have caught everything.
- **Diff the component's layers against the content model**, asking "what does Figma have that
  my model has no field for?" — never the reverse. A grep for `PLACEHOLDER` cannot catch a slot
  that was never modelled.
- **Enumerate the full variant × state matrix before building any component.**
- **Verify in the browser** — `getComputedStyle`, a real Tab press, a real click. Silent failures
  so far: `-rotate-15` isn't a real Tailwind class (the scale jumps 12 → 45) and rendered
  `transform: none`; a stale console buffer pointed at an already-fixed bug; and a Tailwind
  config change never reached a dev server that had been started before the edit.
- **Two dev servers can both hold port 5173** if one binds `[::1]` and the other `*` — macOS
  routes `localhost` to the more specific bind, so you silently get the older server. If
  something looks stale, `lsof -nP -iTCP:5173 -sTCP:LISTEN` first; more than one line is the
  answer.
- **Describe status by what a visitor sees**, never by which code fields are populated.
- Repeating Figma instances are named `ComponentName — Content` (e.g. `ProjectCard — Rega`).
  Flore is on Figma Professional — no Code Connect.
- `[ img ]` in a dashed box is Flore's convention for "this image slot is real, asset pending" —
  render `ImagePlaceholder`, don't omit the element. Note the ProjectMedia frame's own stroke is
  **solid** now; dashed survives only on `ImagePlaceholder`, where it means what it says.
- **Figma access:** the local desktop MCP is unavailable, but the remote Figma server works —
  every pull on 2026-08-04 went through it.
- **Be precise about which thing you mean.** Repeated misunderstandings came from one word
  covering two referents: "content wiring", "placeholder", "bodies". Name the artefact — "the
  card on the homepage", "the /work/artifakt page" — rather than the code structure.

Dev server: `npm run dev -- --host`. Run `npm run build` before any commit.

Background on how this state was reached is in `process-docs/`. Screenshots for the
map-and-layout write-up are in `process-docs/map-and-layout/images/` (still unrenamed; the
documentation pass hasn't started).
