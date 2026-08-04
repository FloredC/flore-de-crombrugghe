# Handoff — next sessions

Continuing the portfolio site (branch: `feature/site-build`).

Read `CLAUDE.md` first. Note the **no-duplication rule** at the top — it's new and it's
load-bearing. That file must contain no sampled values; Figma owns anything visually
specifiable, and you reference nodes rather than restating them. It exists because the
wayfinding colour drifted: the doc said accent-orange, Flore changed her mind in Figma, the
code kept following the stale doc, and nobody noticed until it was live.

---

## Where we are

Content wiring is done for everything on the homepage: all 10 project cards, Approach, About,
and the Language River embed. Nav, footer, buttons, popovers, hotspots and the map all work.
Image aspect ratios are settled across all three card types (see pass 1).

**What's missing is the layer underneath.** There was never a global layout system stage —
components got built before the system they sit in. That's why "spacing between sections" and
"card behaviour in CSS grid" are both open: they're one absent layer showing up twice.

**Start with pass 0.** The card work below is deliberately *not* the starting point — the
ratios were settled early because Flore specified them directly, but the remaining card items
(tints, insets, min/max) all depend on the layout system being in place first.

---

## Order of work — this order matters

A dependency chain: **image → card → grid → page rhythm → type.** Image dimensions set card
height, card height sets grid behaviour, grid sets where sections begin and end, and all of it
determines where text wraps, which is the input to the type pass. Going the other direction
means redoing each step when the one beneath it moves.

### 0. Global layout system — **DONE.** Don't re-derive it.

Measured from `bp-1622-desktop` (`2928:73693`) and `402-mobile` (`2928:78203`), and now
lives in **`src/lib/layout.js`**, each constant annotated with the node it came from.
Verified in the browser against Figma: container chain, section rhythm, every card width
and collage offset match to sub-pixel. See CLAUDE.md → Layout System for the decisions.

One correction to what this file used to say here:

- **Artifakt spans 5 of 6, not the full width.** The old note said 6-of-6, i.e. full
  bleed. It isn't — there's a deliberate gap on the right.

The original "6-col Work vs 12-col About" reading in this file was **right**, and a
later pass wrongly "corrected" it to 12-and-12. Work's widths land on both grids at the
same gutter, so the pixels are identical either way and the error rendered fine — but it
doubled every Work span relative to what Figma shows, which is exactly the kind of thing
nobody can reconcile six weeks later. The grids are declared in the file; read them from
there rather than deriving them from card widths.

**Answered by Flore this pass:** the gutter difference is intentional; Approach/About
stay a collage at desktop and collapse to a grid below; mobile side margin follows Figma
(the code's old comment disagreed); and above the desktop frame **the map stays capped at
its native width and centred**, as originally proposed here. Letting it scale to fill the
viewport was tried and rejected — don't re-propose it.

**The two slips this pass surfaced are both closed, fixed in Figma rather than worked
around in code:** Flore removed the over-wide ValueCard wrapper frame and put those cards
on a real grid, and confirmed Work's tighter section-header and Wayfinding gaps were
unintentional — all sections now use the same values.

### 1. Card media

**Aspect ratios — DONE (commit `244aec2`), don't re-derive these.** Flore's rule, confirmed:
the ratio is a property of the card *variant*, sampled from the component set, never from an
instance. Verified in the browser at exactly these values:

| Card type | Rule | Source node |
|---|---|---|
| ProjectCard | one ratio per size: large `880/447`, medium `530/315`, small `320/278` | `2928:78077` |
| MediaCard | all images 4:3. The podcast is the `Embed` variant — an iframe, keeps its own height | `4522:18868` |
| AsideCard | all three variants are 4:3 (400×300 / 500×375 / 600×450), so `size` picks a **max width**, not a ratio | `4533:19992` |

**Tints, insets and badges — DONE.** The important structural correction: the artwork is
**not** inset by padding. The media frame is the card's full width at a fixed height, and the
artwork is a fixed size centred inside it — the "inset" is just the tinted background showing
around it. That's why the frames looked unfinished before: the tint was the missing piece, not
the spacing. All of it now lives in `ProjectMedia.jsx` as ratios and percentages (exact at the
desktop frame, scales below it) with the per-project tints in `src/lib/mediaTints.js`.

Two things about the tints worth carrying forward:

- **The list that used to sit here was wrong for Rega** — it had `#ffe4e7` shared with
  Sinomocene, but Rega is the `chart-red-fill` **token**. Roche is the `white` token. The other
  eight are one-off instance fills. Pulled per-instance rather than trusting the copy.
- **Eight bespoke pastels is a palette whether or not it's named as one.** Worth asking Flore
  whether they should become tokens.

**Still open in this pass:**
- **Min/max widths on the image containers** — Flore said she was adding these in Figma; they
  are still not there (the artwork is fixed-size in every variant). The percentage model works
  without them, so this is only worth revisiting if the artwork misbehaves during pass 3.
- **The dashed border is on the ProjectMedia component itself**, not just on pending-asset
  placeholders — so cards with real artwork get it too. Built as Figma has it, but worth
  confirming that's intended rather than a leftover of the `[ img ]` convention.
- **`--white-transparent` is broken in the exported tokens**: `#ffffff`, fully opaque, where
  Figma has 33% white. The NDA badge sidesteps it with `bg-white/[0.33]`. Fix the export.
- **Artifakt thumbnail is 1.933, its frame is 1.969**, so ~1.9% (≈8px) still crops. Invisible in
  practice; only worth a re-export at 880×447 if Flore wants it pixel-exact.

**Found while verifying, fixed here:** card order came out alphabetical-by-filename, so all
three Work groups were shuffled against Figma. Nothing in the frontmatter had ever encoded
reading order. Added an explicit `order` field per project, sorted in `getProjectsFor`.

### 2. Card internals
Component spacing and content rhythm.

**Button stretch — FIXED (commit `244aec2`).** Recorded because it will recur: an `inline-flex`
button as a direct child of a `flex flex-col` gets blown out to full width by flex's default
`align-items: stretch`. MediaCard hit it; ProjectCard escaped only because its button sits in a
block wrapper. Buttons hug their label. Any new card type needs `self-start` or a block wrapper.

### 3. Responsive
See the working method below.

### 4. Wayfinding
The subsection text should **not** be orange — sample the real colours from node `4494:6080`.
The code is currently wrong because `CLAUDE.md` used to specify orange. Plus responsiveness of
the breadcrumb / avatar / bubble group.

### 5. States & interactions
Hover/focus/active sweep across everything built since the button audit — cards, badges,
captions, the embed.

### 6. Typography
All breakpoints, once wrapping is final.

**Where the scale is today:** seven styles in `tailwind.config.js` → `theme.extend.fontSize`,
**all in px, no rem anywhere**, across ~25 call sites. `h1` 36 / `h2` 32 / `body-lg` 20 /
`body` 18 / `body-sm` 16 / `caption` 14 / `caption-sm` 12. Sampled from Figma's Desktop text
styles only.

**Agreed approach:**

- **Convert to rem.** px ignores the reader's browser font-size setting entirely, so the site
  currently can't be scaled up by anyone who needs that.
- **Fluid `clamp()` per style, not breakpoint steps**, anchored at the two real Figma frames
  (402 and 1622) so both ends are exact and only the middle interpolates. Same reasoning as
  `Container` padding — stepping that through breakpoints made the value run *backwards* at
  each boundary. A clamp can't.
- **All of it in the token layer**, so components keep writing `text-body` and none of the ~25
  call sites change. No `md:text-*` scattered around to drift.
- **Pull Figma's `Mobile/*` text styles — don't invent them.** They exist: `Mobile/caption` (12)
  and `Mobile/body-bold` (16) have both come back in design-context pulls. Flore's "body text
  around 16px on mobile" matches what's already in the file.

**Two things this pass owns that are currently unresolved elsewhere:**

- **The Guide's speech bubble is a hard `max-w-[300px]`.** That, not font size, is what crowds
  the map at small sizes — smaller text in a fixed-width box just means more words per line.
  The Guide is still 258px against a 768px map (33.6%) at iPad portrait. Make the bubble width
  responsive here, then re-measure. **Only if it's still above ~30% should stacking the Guide
  below ~1000px be revisited** — Flore's read, which the numbers support, is that it probably
  won't be needed.
- **A scale transform on the Guide was removed on 2026-08-04, deliberately.** It shrank the
  whole group with the map, which silently reset every type size inside it: the bubble's 14px
  painted at 12, the name and role at 15.5. It looked like an avatar-sizing change and was
  actually an undocumented mobile type scale. **Don't reintroduce a container transform to
  solve a type problem** — if the Guide's text should be smaller at small viewports, that
  belongs in the scale here, where it's visible and named. The hero avatar keeps its own
  explicit `w-[70px] lg:w-[108px]`, which is the only thing shrinking the Guide now.

### 7. Quality
Content polish, a11y audit, cross-browser (Safari first), performance, launch QA.

---

## Working method for responsiveness

Figma has 402 and 1622 frames only. Everything between is interpolation — that's where the
current unconfirmed 768px nav breakpoint came from.

**The loop:** propose the candidate breakpoints, implement, then send Flore a screenshot set
per section at each one, and she validates them **one by one**. Derive candidates from where
the grid actually breaks — the width at which cards drop below a sensible minimum — not from
device fashion. 1024 is likely identical to desktop; 768 is genuinely undecided.

Reflow intent per section (3-up → 2-up → 1-up, or straight to 1-up) is **not yet defined**.
Propose it with screenshots rather than guessing silently.

---

## Subpages — all six are blocked on design. Do not start them.

`ProjectPage.jsx` is a stub. Six routes are planned (`artifakt`, `pitchpivot`,
`welcome-to-my-city`, `sinomocene`, `teamchatviz`, `roche`).

**None of them are ready to build.** Figma contains one subpage frame — `Supage_pitchpivot`,
node `2928:74096` — but Flore is **still designing it**. Treat it as work in progress, not a
spec: do not pull content or layout from it, and do not implement against it. The other five
have no design at all.

So there is nothing to chase Flore about here. This is not missing copy and not an oversight —
the pages simply haven't been designed yet. Wait until she says a subpage is ready.

The MDX **bodies** — the prose below the frontmatter, which renders on the subpage — are still
scaffolding for all six, and should stay that way until the designs land. Note this is a
different thing from the homepage **card** copy, which is real and final-ish. Be precise about
which you mean; conflating the two has already caused confusion twice.

When the designs do land, subpages are the natural place to apply the build order properly from
the start, since they're near-greenfield: structure → layout system → components → composition
→ responsive → interactions.

---

## Still outstanding

- Contact bubble copy, the Approach "Selected talks & writing" bubble (marked `TO COMPLETE`),
  and the LinkedIn URL. Flore will do a content pass at the very end, once layout is stable.
- Four cards show visible `REVIEW —` markers where the Figma instances still hold unedited
  ProjectCard component defaults: Artifakt caption, PitchPivot caption, Rega meta + caption.
  Ask whether they've been fixed in Figma before re-pulling.
- `public/language-river.html` loads Chart.js and HK Grotesk from CDNs — contradicts the
  self-hosted-font rule and renders blank if cdnjs is unreachable. It's generated from a
  separate source project: **never hand-edit it**, flag it to Flore.

---

## How to work

- **Content wiring means media + the actual written content, both pulled from Figma.** Missing
  copy means *not yet pulled*, not *not yet written* — check Figma before ever asking Flore to
  write or approve copy. (This went wrong: a session offered to draft text that was already in
  the file it had been reading all afternoon.)
- **Pull whole components, not the node you think you need.** Worrying about Figma MCP cost
  made things *more* expensive — four partial pulls plus rounds of Flore reporting gaps, when
  one complete pass would have caught everything.
- **Diff the component's layers against the content model**, asking "what does Figma have that
  my model has no field for?" — never the reverse. Asked the wrong way round, `meta`, the image
  captions and the ValueCard image slot were all missed. A grep for `PLACEHOLDER` cannot catch
  a slot that was never modelled.
- **Enumerate the full variant × state matrix before building any component.**
- **Verify in the browser** — `getComputedStyle`, a real Tab press, a real click. Two silent
  failures: `-rotate-15` isn't a real Tailwind class (the scale jumps 12 → 45) and rendered
  `transform: none`; and stale console errors pointed at an already-fixed bug — a fresh tab
  proved the buffer was lying.
- **Describe status by what a visitor sees**, never by which code fields are populated.
- Repeating Figma instances are named `ComponentName — Content` (e.g. `ProjectCard — Rega`) so
  you can go straight to the right one. Flore is on Figma Professional — no Code Connect.
- `[ img ]` in a dashed box is Flore's convention for "this image slot is real, asset pending" —
  render `ImagePlaceholder`, don't omit the element.
- **Be precise about which thing you mean.** Three separate misunderstandings in two days came
  from one word covering two referents: "content wiring" (frontmatter vs the words a visitor
  reads), "placeholder" (Flore's `[ img ]` convention vs scaffolding text in the MDX files vs
  dashed boxes in code), and "bodies" (the homepage card copy vs the prose that renders on the
  case-study page). Name the artefact — "the card on the homepage", "the /work/artifakt page" —
  rather than the code structure.

Dev server: `npm run dev -- --host`. Run `npm run build` before any commit.

Background on how this state was reached — the misunderstandings, what caused them, and the
rules that came out of them — is in `process-docs/content-wiring/content-wiring.html`.

**Start with pass 0** — pull the layout system from Figma and show Flore what you found before
implementing.
