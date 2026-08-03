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

**What's missing is the layer underneath.** There was never a global layout system stage —
components got built before the system they sit in. That's why "spacing between sections" and
"card behaviour in CSS grid" are both open: they're one absent layer showing up twice.

---

## Order of work — this order matters

A dependency chain: **image → card → grid → page rhythm → type.** Image dimensions set card
height, card height sets grid behaviour, grid sets where sections begin and end, and all of it
determines where text wraps, which is the input to the type pass. Going the other direction
means redoing each step when the one beneath it moves.

### 0. Global layout system
Containers, max widths, per-section grid definitions, gutters, the section/block spacing scale.
Pull from Figma — most is already readable:

```
page 1622 → content 1280 (171px outer margin) → container 1184 (48px inner padding)
Work section:    6-col grid, 60px gutters. Artifakt spans 6, other cards span 3 (2-up)
Feature cases:   6-col grid, 60px gutters, cards span 2 (3-up)
About:           12-col grid, 24px gap
```

**Ask Flore:** is the 6-col Work vs 12-col About difference intentional, or drift?
**Ask Flore:** above 1622 — proposed is to cap content at 1280, let margins grow, and keep the
map centred at its native 1622 rather than scaling it up. Needs confirming.

### 1. Card media
- **One aspect ratio per size variant, not one for all three.** This is the Artifakt crop: the
  box is forced to 16:10, the file is 1.93, so `object-cover` shaves ~17% off.
- **Per-card background tints**, already in Figma: Artifakt `#fdffe6`, PitchPivot `#dfe8fd`,
  Welcome-to-my-city `#f6f9ff`, Rega + Sinomocene `#ffe4e7`, SBB `#efefef`, myRIDE `#e1e2f7`,
  SAC `#e5efe1`, Teamchatviz `#d8fbfc`, Roche white.
- Min/max widths on the image containers — Flore is adding these in Figma.
- Review the NDA / Case study badges: built 2 Aug from the real Figma treatment, unreviewed.

### 2. Card internals
Component spacing and content rhythm, plus one known bug: **MediaCard buttons stretch to full
width** because the `ButtonLink` is a direct child of a `flex flex-col`, and flex's default
`align-items: stretch` blows out an `inline-flex` element. ProjectCard escapes it only because
its button sits in a block wrapper. Buttons should hug. Fix it so it can't recur in the next
card type.

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

## Subpages — mostly not designed yet

`ProjectPage.jsx` is a stub. Six routes are planned (`artifakt`, `pitchpivot`,
`welcome-to-my-city`, `sinomocene`, `teamchatviz`, `roche`), and in Figma **only PitchPivot has
a subpage design** — node `2928:74096` (`Supage_pitchpivot`: meta, tagline, description, hero,
goals containers).

So:
- **PitchPivot subpage content exists → pull it.** Don't ask Flore to write it.
- **The other five aren't designed.** That's an open design decision for Flore, not missing
  copy. Don't chase her for text that was never meant to exist yet.

The MDX **bodies** — the prose below the frontmatter, which renders on the subpage — are still
scaffolding for all six. Note this is a different thing from the homepage **card** copy, which
is real and final-ish. Be precise about which you mean; conflating the two has already caused
confusion twice.

Subpages are also the natural place to apply the build order properly from the start, since
they're near-greenfield: structure → layout system → components → composition → responsive →
interactions.

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

Dev server: `npm run dev -- --host`. Run `npm run build` before any commit.

**Start with pass 0** — pull the layout system from Figma and show Flore what you found before
implementing.
