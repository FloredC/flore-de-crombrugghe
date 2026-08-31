# Vertical density — "everything is too big on a laptop"

**Status: PARKED, 2026-08-21.** Flore's call — content editing comes first, and
on a second look the problem felt smaller than it did on the Friday it was
raised. Nothing in this document has been acted on. No pixels changed.

This is Phase 0 of a plan that was written and then postponed: the measurement,
the findings, and the dependency map. It exists so that resuming does not mean
re-deriving. **If you are picking this up, read the Findings before the Plan —
two of the original premises turned out to be wrong, and the plan is built on
the corrected ones.**

---

## The report

> "I'm looking at this on my laptop (1500) and the text takes up too much space
> and is too big. Can we add more type sizes at different breakpoints, or even
> make it dynamic? It's generally good to have each chapter visible in the
> viewport... The cards, for instance, are too big on that breakpoint, and you
> don't see the card fully on 100vh."

— Flore, 2026-08-21

---

## Findings

### 1. The type scale is already dynamic. Breakpoints would add nothing.

Every step in `tailwind.config.js` is a `clamp()`, fluid between anchors at
**402px and 1622px** — Figma's two frame widths. There are no steps to add;
the mechanism is already the one the report asks for.

What that means at each width (measured, homepage):

| viewport | h1 | h2 | body-lg | body |
|---|---|---|---|---|
| 1280×800 | 33.8 | 26.9 | 18.9 | 17.4 |
| 1500×850 | 35.2 | 27.6 | 19.6 | 17.8 |
| 1728×1080 | **36.0** | **28.0** | **20.0** | **18.0** |

At 1500 the scale is ~97% of maximum. So the real question is not "add
breakpoints", it is **"are the desktop anchor values right"** — a different
question, with a different answer, and one that means diverging from Figma.

### 2. The constraint is viewport HEIGHT. Type scales on WIDTH.

This is the finding that reframes the whole thing. Type is sized in `vw`; the
complaint ("chapter visible in viewport", "card not fully visible on 100vh") is
vertical. A 1500×850 laptop and a 1500×1200 desktop monitor render **byte-
identical type** and have completely different experiences.

The featured project card makes it unarguable — its height barely moves with
width at all:

| viewport | card height | as a fraction of the window |
|---|---|---|
| 1280×800 | 878px | **1.10** — does not fit |
| 1500×850 | 883px | **1.04** — does not fit |
| 1728×1080 | 887px | **0.82** — fits |

Nine pixels of variation across a 450px width range. The card is not too big;
**laptops are short.** No width-keyed breakpoint can express that, because the
variable it needs is not in the query.

### 3. Type is a weak lever, and weaker on the homepage than on case studies.

Measured by scaling the root font size, which is the single global dial for a
rem-based scale (`scripts/measure-density.js` does not do this; it was a
one-off experiment, reproducible by setting `document.documentElement.style
.fontSize`):

| change | homepage height | case-study height |
|---|---|---|
| type −12% | **−3.9%** | −8.0% |
| spacing −30% | — | −8.8% |
| type −6% **and** spacing −20% | — | −10.0% |

Spacing is a comparable or better lever than type, and it is independent (the
spacing tokens are px, the type scale is rem, so the two do not interact).

### 4. Cards are 52–68% media. Type cannot fix them.

Every project card, measured at 1500×850:

| card | height | media | media share |
|---|---|---|---|
| Artifakt (featured) | 883 | 600 | **68%** |
| Welcome to my city | 738 | 385 | 52% |
| PitchPivot | 738 | 385 | 52% |
| Rega | 700 | 385 | 55% |
| SBB | 700 | 385 | 55% |
| myRIDE | 738 | 385 | 52% |
| trail-app | 738 | 385 | 52% |
| Sinomocene | 668 | 385 | 58% |
| Teamchatviz | 668 | 385 | 58% |
| Roche | 668 | 385 | 58% |

The featured card is 600px media + 260px text + 24px gap. A 12% type cut takes
it from 883 to 861 — still over one viewport on a laptop. **The image is the
only lever that moves this card.**

### 5. "Every chapter in one viewport" is not reachable by scaling.

Most chapters already nearly fit. Two on each case study do not, and they are
far out — not 10% out:

**Artifakt** @ 1500×850 (page total 15.4 viewports)

| chapter | height | viewports |
|---|---|---|
| what | 634 | 0.75 |
| what-it-is | 608 | 0.72 |
| screencast | 714 | 0.84 |
| question | 689 | 0.81 |
| **reveal** | 1696 | **1.99** |
| **scaffold** | 1845 | **2.17** |
| defaults | 796 | 0.94 |
| testing | 892 | 1.05 |
| reflection | 356 | 0.42 |
| how-i-worked | 821 | 0.97 |
| final-product | 547 | 0.64 |

**PitchPivot** @ 1500×850 (page total 12.6 viewports). No `data-section`
attributes on this page, so blocks are identified by child index:

| block | height | viewports |
|---|---|---|
| 0 (hero, bleed) | 959 | 1.13 |
| 1 | 923 | 1.09 |
| 2 | 603 | 0.71 |
| 3 | 630 | 0.74 |
| **4** | 2065 | **2.43** |
| **5** | 2048 | **2.41** |
| 6 | 1032 | 1.21 |
| 7 (onward, medium) | 1046 | 1.23 |

Getting a 2.2-viewport chapter to 1.0 needs −54%. Type and spacing together
give −10%. **Those chapters need structural change — shorter lists, smaller
media, or a split — not a smaller type scale.** Both offenders on Artifakt are
the long bullet-list sections with a full-width media stage under them.

---

## Homepage section baseline

@ 1500×850, page total 15.0 viewports.

| section | height | viewports |
|---|---|---|
| hero | 802 | 0.94 |
| work | 5073 | 5.97 |
| approach | 2950 | 3.47 |
| about | 2262 | 2.66 |
| contact | 655 | 0.77 |

Section-level numbers are of limited use here — `work` is six screens by design
and always will be. The card table above is the meaningful unit.

---

## The dependency map — why this is delicate

Type tokens are shared across every page. There is no "just fix the case study"
change available.

| token | uses | files | notable co-tenants |
|---|---|---|---|
| `display` | 2 | 1 | case-study hero only — the one safe token to move |
| `h1` | 7 | 4 | section headers, hero, homepage |
| `h2` | 10 | 7 | see below |
| `body-lg` | 17 | 10 | see below |
| `body` | **54** | **25** | nav, footer, buttons, popover, bubbles, every card |
| `body-sm` | 20 | 13 | |
| `caption` | 12 | 9 | |
| `caption-sm` | 2 | 2 | flat 12px, no clamp |

**`h2` lands in seven places at once:** `ProjectCard`, `SectionHeader`,
`CaseStudyArtifakt`, `LearningBlock`, `FeatureBlock`, `StatGrid`, `HomePage`.
So the card titles and the Contact "Say Hi!" heading move together — that is
already recorded in `tailwind.config.js`, where they were stepped down together
once before (Flore, 2026-08-04, 32 → 28).

**`body-lg` lands in ten:** all case-study prose *and* the homepage card
descriptions.

**`body` is effectively global.** Treat any change to it as a site-wide change.

Two operational notes:

- **`tailwind.config.js` needs a dev-server restart to take effect.** Tailwind 3
  resolves the ESM config once per Node process and Vite's own restart does not
  clear it. `npm run dev` handles this (see `scripts/dev.mjs`); the symptom
  otherwise is a page that renders plausibly using the *previous* type scale.
- **PitchPivot is reviewed and signed off.** Any movement on that page counts as
  a regression until Flore re-approves it.

---

## The plan, for when this resumes

Ordered by dependency, not by size of effect. Re-run the baseline after each
phase and diff it.

**Phase 0 — instrument.** ✅ Done, 2026-08-21. `scripts/measure-density.js` plus
the tables above.

**Phase 1 — turn the goal into a number.** Flore's decision, and it blocks
everything else. "Chapter visible" has to become a testable rule, e.g. *at
1500×850, no ProjectCard exceeds 0.85; no case-study chapter exceeds 1.2 except
a named exemption list.* Also: pick the one reference viewport that wins ties.
Given Finding 2, the budget must be expressed against a viewport **height**.

**Phase 2 — type.** First, not because it is the biggest lever (it is not) but
because it changes wrapping, and wrapping changes every height downstream.
Measuring media before type means measuring twice. Lower the desktop anchors one
step; **freeze the 402 anchors** so the phone layout, which is designed and
tested, cannot regress. Needs sign-off: it is a deliberate divergence from Figma.

**Phase 3 — vertical rhythm.** Independent of Phase 2 and comparable in effect.
Mostly `SPACE.break` and the section padding in `lib/layout.js`.

**Phase 4 — media.** The dominant lever on cards (Finding 4), now measurable
against whatever budget Phases 2–3 left.

**Phase 5 — structure.** Only for what is still over: the two long chapters on
each case study.

### If you only do one thing

Phase 4 on the featured card. It is the single worst offender (1.10 viewports at
1280×800), it is 68% image, and it is isolated — `ProjectCard`'s featured
variant, which nothing else uses. It does not need Phases 1–3 to be worth doing.

---

## Re-running the baseline

No dependency, no build step:

```
npm run dev
```

Then in the browser console on any page:

```js
const s = await (await fetch('/scripts/measure-density.js')).text(); (0,eval)(s);
measureDensity();
```

`measureDensity({ json: 1 })` returns a string instead, for diffing runs.

The matrix used above: **1280×800, 1500×850, 1728×1080** on `/`,
`/work/artifakt`, `/work/pitchpivot`. 1500×850 is Flore's own laptop and is the
one that matters; 1728×1080 is included because it is where the design passes,
which is what isolated height as the variable.
