# Portfolio Site v1 — Claude Code Handoff

**Project:** Flore de Crombrugghe personal portfolio — illustrated city-map homepage with clickable hotspots, concept validation via real-world testing this week.

**Owner:** Flore de Crombrugghe  
**Audience:** Design managers and HR at product companies (cold arrival, pre-case-study)  
**Success criterion:** Testers discover ≥3 hotspots unprompted, describe map as inviting (not confusing), want to open case studies.

---

## Source of truth & reading order

Read in this order before writing any code:

1. **This file** — architecture, components, content model, build order.
2. **`PRD-Map-Layout-v1.md`** — the map's hotspot/popover interaction spec (what to test, success criteria, scope). Authoritative on interaction behavior specifically.
3. **The Figma file, via the Figma MCP** — authoritative for structure, layout, visual design, and component breakdown. Where Figma and this doc disagree on structure or visuals, **Figma wins**; if Figma and the PRD disagree on hotspot/popover *interaction* specifically, the PRD wins.
4. **`city-plan-wireframe-v9e.html`** — optional background reference only, not a spec. It predates several current decisions (project count/roster, zone taxonomy naming, interaction details) — don't treat anything in it as structural or visual truth. Skip it entirely if it's more confusing than useful.

### The no-duplication rule (added 2026-08-03, after a real drift bug)

**This file must contain no sampled values.** Not colors, not spacing, not radii, not sizes — nothing you could answer by opening Figma. Reference the node instead (`see node 4494:6024`). A value written here is a *copy*, and it goes stale the moment Flore changes her mind in the design file.

"Where Figma and this doc disagree, Figma wins" (below) is not sufficient on its own: a conflict only gets resolved if somebody notices it. The wayfinding subsection color sat here as `--color-accent-orange`, Flore changed her mind in Figma, the code kept following this doc, and nobody caught it until it was on the built page. Don't duplicate, and there's no conflict to notice.

**What belongs where:**
- **Figma** — tokens, component structure, variants and states, grids and constraints, copy, and which color/size any given element is.
- **This file** — stack and routing, file structure, naming conventions, which HTML tag something becomes (Figma's "Button"/"Link" naming is a visual taxonomy, not a semantic one), behaviors with no visual (copy-to-clipboard, anchor targets, tap-target minimums, `svh` vs `vh`), plus decisions, rationale, bug history, and open questions.

If a section here starts listing pixel values, it has drifted out of scope — cut it back to a node reference.

**First task:** don't start building yet. Read the above, review the Figma file, and cross-check what this doc and the PRD describe against what's actually in Figma — structure, zone/component naming, hotspot count and roster, anything else load-bearing. Report any inconsistencies you find before starting implementation, rather than silently resolving them in Figma's favor. Then summarize back what you understand the build to be, so we can confirm alignment before Skeleton starts.

---

## Stack

- **Framework:** Vite + React + React Router (routing needed for case-study sub-pages)
- **Language:** Plain JS/JSX (no TypeScript in v1)
- **Content:** MDX files per project/case study + per-section frontmatter + JSON hotspot manifest per illustration
- **Styling:** Tailwind CSS (core utilities only), with CSS custom properties for design tokens
- **Font:** HK Grotesk (OFL licensed, local webfont)
- **Hosting:** GitHub Pages
- **Animation/interaction:** `@floating-ui/react` for popover positioning, `react-zoom-pan-pinch` for map pan/zoom

---

## Design Tokens — Architecture

**Source of truth:** Already exported directly from Figma as three CSS files — `primitives.css`, `semantic.css`, `components.css` — not a live MCP pull. Copy these verbatim into `src/styles/tokens/` and import in that cascade order from `globals.css`. The "Token pull" build stage is now a file copy, not an MCP query — the export is already done.

**Bug fixed (2026-07-30):** `semantic.css` and `components.css` referenced color primitives with underscores (e.g., `var(--grey_90)`), while `primitives.css` defines them with hyphens (`--grey-90`) — these were different, unrelated CSS custom properties, so every color reference resolved to nothing. All underscore references in `semantic-mode-1.css` and `components-mode-1.css` have been renamed to hyphens to match `primitives-mode-1.css`. Spacing/radius references were unaffected (correctly hyphenated on both sides already). No further action needed here — this was a naming-convention mismatch between the two exported files, not a Figma variable-scope or visibility issue.

**Structure:**
- `primitives.css` — raw values: color scales (blue/yellow/green/red/purple/orange, each with light/mid/dark steps, plus black/white/grey), a spacing scale (29 values), a radius scale.
- `semantic.css` — role-based tokens referencing primitives: text, border, chart (data-viz colors — used by the Language River / Belonging charts), action (primary/secondary/accent/link, each with hover/pressed/disabled states), surface, focus ring. Re-exports only a subset of the primitive spacing/radius scale — build Tailwind's `theme.extend` from this semantic subset, not the full primitive list, since primitives include scale steps that aren't meant to be used directly.
- `components.css` — component-specific tokens (button variants × states, navbar) referencing semantic tokens. Note the loose mapping to the Button family naming used elsewhere in this doc: `action-accent` ≈ the orange Popover/hotspot elements, `action-link` ≈ Tertiary, `action-primary`/`action-secondary` map directly.

**Tailwind integration:** reference the semantic layer in `theme.extend`, not primitives directly, e.g. `colors: { text: { primary: 'var(--colors-text-text-primary)' } }` — component code should never hardcode a primitive.

**Resolved from Open Decisions:** token structure is semantic + primitives (not flat-primitives-only), and all previously-flagged spacing values (10, 14, 40, 100, 200) are real, defined primitives already in use at the semantic layer — keep them, nothing to merge or drop.

---

## Content Model

### MDX Structure (per project/case study)

Each project gets one `.mdx` file in `src/content/projects/`. Frontmatter contains structured data; body contains prose/JSX.

**Frontmatter fields (minimum set for v1):**

```yaml
---
title: "Artifakt — Tracing Your Way Past the Blank Canvas"
slug: "artifakt"
status: "full-case-study"  # or "feature-case" or "nda-project"
tags: ["Public", "Product Design", "0→1", "2024"]
description: "One-line hook for the work grid card"
cta: "Read case study"  # or "View Project" or "[Product Name] ↗"
externalLink: null  # used only for NDA projects linking to live product
hotspotId: "hotspot-artifakt"
breadcrumbZone: "Lab"
breadcrumbSubsection: "Own products"
breadcrumbBubbleCopy: "These are my latest projects, where I dig deeper into AI workflows by creating my own products."
---
```

**Body:** Markdown/JSX prose. For case studies with their own routes, this is the full content. For work-grid cards only (no sub-page), keep it short (one paragraph).

### Hotspot JSON Manifest

One `.json` file per illustration (e.g., `hero-map-hotspots.json`). Structure:

```json
[
  {
    "id": "hotspot-artifakt",
    "label": "Artifakt",
    "description": "Tracing Your Way Past the Blank Canvas",
    "x": 28,
    "y": 42,
    "slug": "artifakt"
  },
  ...
]
```

**Coordinates:** `x` and `y` as integers (0–100, percentage of viewBox). These map directly to SVG/viewport units.

**Flow:** Hover/keyboard-focus hotspot (desktop) or tap (mobile) → popover opens (title + description + "View project →") → click/tap link → anchor-scroll to matching card in Work grid → card's CTA may then navigate to dedicated route.

---

## Component Architecture

### Core Components

**Hero**
- Renders intro headline + illustrated map SVG + CTAs
- Contains the PopoverContainer that manages all hotspots + popovers for this illustration
- Import hotspot JSON manifest; pass to PopoverContainer

**Wayfinding (Breadcrumb with Avatar & Chat Bubble)**
- Rendered above every major section (Work, Approach, About, Contact)
- Structure: avatar illustration + speech bubble (copy from MDX frontmatter) + "You are here: [Zone] — [Subsection]" text, with subsection name in orange
- `breadcrumbZone`, `breadcrumbSubsection`, `breadcrumbBubbleCopy` pulled from section-level frontmatter or passed as props
- Can be hidden per instance via optional `hidden` prop (default: show)

**ProjectCard**
- Reusable grid cell component
- Props: title, description, tags, cta label, link (internal route or external URL)
- Media (illustration/screenshot) handled via MDX frontmatter `thumbnail` field (path relative to public)
- Text wraps; CTA pinned to bottom via `margin-top: auto`
- Spacing via Flexbox gaps, not padding on individual text elements
- NDA projects show a small "NDA" badge near the title

**Popover (Hover-Triggered, Click-Dismissible)**
- Triggered by mouse hover or keyboard focus on a hotspot marker (desktop) — hover opens the popover directly, not just a highlight
- Opened by tap on hotspot marker (mobile)
- Content: single `title` field (already contains "Name — tagline" where applicable, e.g. "Artifakt — Tracing Your Way Past the Blank Canvas") — no separate description field
- Two variants by action type:
  - **Link** (used by all project hotspots + podcast + anchor hotspots): title + CTA link ("View project →", "Listen →", "Explore →", etc.) — link always anchor-scrolls to the matching Work-grid card for project hotspots; for non-project hotspots (podcast, Language River, Papayas) it goes directly to its own target (external URL or named anchor) since there's no card to scroll to
  - **Contact** (Say hi only): title + email address + copy-to-clipboard button, no link
- Positioning via `@floating-ui/react` with bridged hit area (`safePolygon`) so moving toward the popover doesn't close it
- Dismissed by: mouse-leave, blur/Escape, outside-click, clicking the same marker again
- Only one popover open at a time
- Link is semantic and keyboard-focusable (meets accessibility requirement from day one)
- **Background blur:** Figma's "Background blur" effect (not layer blur) maps to CSS `backdrop-filter: blur(Npx)` (with `-webkit-backdrop-filter` for Safari), not `filter: blur()` — those are different effects and using the wrong one either blurs the card's own content instead of what's behind it, or does nothing visible. Requires the popover's background fill to be semi-transparent (opacity < 100%) for the effect to be visible at all — check the actual fill opacity set in Figma and carry that value over, not just the blur radius.

**Contact Section** — the full-page section (`id="contact"`), distinct from the map's "Say hi" popover above even though both are contact-flavored
- Real content, not placeholder: heading "Say Hi!", real body copy (both sampled from the Contact Section node — present twice in the Figma file before the duplicate-frame cleanup, now once)
- Two buttons, not a generic link list: LinkedIn as the filled primary `ButtonLink`, and the email as a **secondary-chrome button that copies to clipboard on click**, not a mailto link — same interaction pattern as the map popover's Contact variant, applied here too. Built as `ContactEmailButton.jsx` (a real `<button>`, per the tag-follows-behavior principle below) rather than a `ButtonLink` instance, but sharing `SECONDARY_BUTTON_CLASS` so it can't drift from the real secondary button. Copy logic lives in `src/lib/useCopyToClipboard.js`, shared with the popover's own `CopyButton`.
- **Open:** LinkedIn URL is a literal `PLACEHOLDER_LINKEDIN_URL` in `contact.mdx` — Figma's button has no URL attached to it. Needs the real profile URL from Flore.

**Pan/Zoom Container (Map Illustration)** — resolved, no longer "if enabled"
- Wraps the SVG illustration (`PanZoomContainer.jsx`)
- Overflow-triggered per axis independently, not one width breakpoint: crop viewport width follows the map's native 1622px vs. available width; crop height follows `h-[min(982px,70svh)]` (native height capped by a viewport budget) vs. available height. A viewport that's wide-but-short crops only vertically; one that's narrow-but-tall crops only horizontally.
- **No zoom at all** — `minScale={1} maxScale={1}`, deliberate (Flore wants to avoid a zoom control). `wheel={{ disabled: true }}` — the library's wheel handler is a zoom gesture and calls `preventDefault` unconditionally even when scale can't change, which was silently blocking desktop page-scroll over the map.
- **Touch: two-finger pan, not one-finger.** `panning={{ disabled: coarsePointer }}` (via `(pointer: coarse)` media query) turns off the library's default single-finger drag-to-pan, because mobile browsers synthesize compatibility mouse events after a one-finger touch that drove a real pan regardless of touch-event handling — disabling `panning` at the config level is what actually stops it. Two-finger pan still works because it runs through the library's separate pinch path, gated only on `pinch.disabled` (left enabled). Desktop keeps mouse-drag pan (a different, unaffected code path).
- **`svh` not `vh`** for the crop viewport height — `vh` tracks the *largest* mobile viewport and changes as the browser chrome collapses/expands during scroll, which was re-triggering re-centering mid-scroll and reading as random jumps.
- Re-centering on resize: a `ResizeObserver` on the crop container calls `centerView()` imperatively when the container's own measured size changes — not a `window.resize` listener (which fires on mobile URL-bar collapse even though the container didn't change size) and not a remount (which threw away pan state unnecessarily).
- Hotspot coordinates stay % of viewBox; pan/zoom is a viewport transform on top.

**Nav (Sticky)** — resolved, four states across two components (`Nav.jsx`)
- Hidden until the Hero (`#hero`) scrolls out of view (`IntersectionObserver`, not a scroll-position guess); always visible on subpages (no `#hero` to key off).
- **Breakpoint: 768px (Tailwind `md`).** Not sampled from Figma — the frames given are 402px and 1622px with nothing in between — this is a judgment call, flagged to Flore, no objection raised. Revisit if it ever feels wrong on a real device.
- **Desktop homepage:** home avatar + Work/Approach/About anchor links + Contact button. The link whose section is currently in view gets a persistent underline (`aria-current`, driven by an `IntersectionObserver` over the section elements with a `-20% 0px -70% 0px` root margin band) — this ships in Figma's own default navbar state (`NavbarDesktop placement=Homepage` shows "Work" pre-underlined), not something layered on separately.
- **Mobile homepage:** closed = home avatar + hamburger in a pill; open = the pill squares off and grows a stacked Work/Approach/About/Contact menu with dividers, hamburger swapped for a close icon. Sample radii/dividers from the NavbarMobile component (node `4494:18117`) — its variants are the spec. Same rows use the same component/states as the desktop links (confirmed with Flore they're ButtonLink instances Figma flattened into loose text on export, not a separate unstyled thing) — including the current-section underline.
- **Subpage (desktop and mobile, identical):** "← Back to Portfolio" + Contact only. No hamburger, no section anchors — per Flore, "it's on a different page," a deliberate dead end by design, not a state to fill in later.
- Toggle is a real `<button>` (no navigation); every menu row is a real `<a>`.

### Button Component Architecture (resolved)

One component, `ButtonLink.jsx`, not one component per variant. A `variant` prop (`primary` / `secondary` / `tertiary` / `menu` / `popover`) selects a class string; every button on the site — ProjectCard CTAs, Nav links, Footer, Popover CTA — renders through this one file. Fixing a state (e.g. a missing focus ring) means fixing it once, here, not per call site.

- `FOCUS_CLASS` — the blue focus-visible ring, applied to **every** variant (Figma's `state=focus` row shows it on all four ButtonLink variants + ButtonAction).
- `LINK_CLASS` — the plain-text "menu" link treatment (color dims grey-90 → grey-80 → grey-70 on hover/pressed, no underline). Used for Footer's "View CV", the subpage nav's "Back to Portfolio", and the navbar's Work/Approach/About links — confirmed with Flore these are literally the same Figma component regardless of where they appear, so they must carry identical states. (An earlier pass split this into two classes on the theory that the navbar links had no sampled hover state — wrong; same component, same states.)
- `LINK_UNDERLINE_CLASS` — the underline, used **only** for the navbar's current-section indicator, never by hover/pressed on `LINK_CLASS`.
- `SECONDARY_BUTTON_CLASS` — the secondary variant's class, exported standalone so `ContactEmailButton` (a real `<button>`, not an `<a>`) can look identical to the secondary `ButtonLink` without duplicating its styling.
- **Icons** are imported straight from the exported SVG assets in `src/assets/icons/*.svg` via `vite-plugin-svgr`'s `?react` suffix (see `icons.jsx`, `vite.config.js`) — compiled into real inline `<svg>` components, not hand-copied path data. The plugin rewrites Figma's hardcoded `fill="#0E0E0E"` to `currentColor` so icons can follow hover/pressed/focus colors. If a new icon is needed, export the asset from Figma into that folder and re-export it from `icons.jsx` — never paste SVG markup directly into a component.
- **NDA project cards use `secondary` (outline), all other ProjectCards use `primary` (filled)** — sampled directly from a real NDA card instance in Figma, not assumed. NDA CTAs also open in a new tab (`target="_blank"`), since they send the reader off-site.
- **Open naming duplicate:** Figma calls the plain-text variant "menu"; this doc's older text below calls the same visual treatment "Tertiary." Both names currently map to `LINK_CLASS` so nothing is broken, but it's worth collapsing to one name in Figma at some point.

---

## Project & Hotspot Naming Convention

10 projects total; only 5 have a map hotspot. The other 5 are Work-grid cards only (`hotspotId: null` in frontmatter). Consistent slugs across Figma, JSON, and code:

| Project | Slug | Hotspot | Page Type | CTA |
|---------|------|---------|-----------|-----|
| Artifakt | `artifakt` | `hotspot-artifakt` | Full case study | "Read case study" |
| PitchPivot | `pitchpivot` | `hotspot-pitchpivot` | Full case study | "Read case study" |
| Welcome to my city | `welcome-to-my-city` | none | Full case study | "Read case study" |
| Sinomocene | `sinomocene` | none | Feature case | "View Project" |
| Teamchatviz | `teamchatviz` | none | Feature case | "View Project" |
| Roche Icon System | `roche` | none | Feature case | "View Project" |
| myRIDE | `myride` | `hotspot-myride` | NDA, external link | "myRIDE Website" |
| Redesigning Rega's app | `rega` | `hotspot-rega` | NDA, external link | "Rega App" |
| Faster trail discovery for 80k users (client: SAC) | `trail-app` | `hotspot-trail-app` | NDA, external link | "SAC App" |
| SBB | `sbb` | none | NDA, external link | "SBB App" |

**Correction:** "SAC" as a standalone project/slug doesn't exist — resolved earlier in this build. The real project is `trail-app` (title "Faster trail discovery for 80k users"); SAC is the *client name*, "SAC App" is the CTA label. Don't reintroduce a `sac` slug.

CTA labels above are the literal string, no arrow character baked in — the external-link arrow is a separate `ExternalLinkIcon` component rendered alongside the label, since the exported arrow SVG can't be embedded in a plain string.

Real external URLs (confirmed by Flore, wired into each project's `externalLink` frontmatter field):
- myRIDE → `https://www.myride.ch/de/index.html`
- Rega → `https://www.rega.ch/en/our-missions/this-is-how-we-help-you/rega-app`
- SAC (trail-app) → `https://www.sac-cas.ch/en/sac-cas-app/`
- SBB → `https://www.sbb.ch/en/travel-information/apps/sbb-mobile.html`

Non-project hotspots (no Work-grid card): The Future of UX (podcast) → `hotspot-future-of-ux`, "Listen →"; Say hi! → `hotspot-say-hi`, "Say hi →" (Contact anchor); My Language River → `hotspot-language-river`, "Explore →" (About anchor); 333 Saftige Papayas → `hotspot-papayas`, "Read more →" (About anchor).

**Figma layer naming:** Use slugs exactly as above. For markers + highlights, use:
- `hotspot-artifakt` (marker, the interactive dot)
- `hotspot-artifakt-highlight` (accent shape that turns orange on hover, if separate from background illustration)

**Resolved:** myRIDE, Rega, trail-app (SAC), and SBB each have a real `.mdx` file in `src/content/projects/` like every other project — no route (`ProjectCard` links straight to `externalLink` instead of `/work/:slug` when `status: "nda-project"`), but same content-model home as everything else. No separate data file needed.

---

## Styling & Design System

### Layout System (resolved 2026-08-03)

Lives in **`src/lib/layout.js`** — grid definitions, gutters, and the section/block
spacing rhythm, each constant carrying the Figma node it was measured from. Components
import from there rather than writing spacing utilities inline. Per the no-duplication
rule, the numbers are in that file and in Figma, not here.

Measured from the two page frames: `bp-1622-desktop` (node `2928:73693`) and
`402-mobile` (node `2928:78203`). There was never a layout stage before this one —
components were built before the system they sit in, which is why section spacing and
card grid behaviour were both open.

**Decisions confirmed with Flore:**

- **Every section is a 12-column grid on the same container. Only the gutter differs**
  between the Work zone and the Approach/About zone, and that difference is deliberate
  — project cards get more air than the smaller editorial cards. Reading Work as a
  6-column grid (as an earlier handoff did) makes it look like a second, incompatible
  system; it isn't. Twelve columns reproduces every Work card width exactly.
- **The 12-column grid only engages at `xl`**, where `Container` resolves to its exact
  Figma width. The Work gutter across twelve columns leaves ~5px columns at tablet
  widths. Below `xl`, sections fall back to plain N-up grids.
- **Approach and About are staggered collages in Figma, not grids** — fixed-width cards
  hand-placed with horizontal and vertical offsets. They stay a collage at `xl` and
  collapse to a plain grid below, since hand-set offsets have nowhere to go on a narrow
  viewport.
- **Above the desktop frame width, page content stays capped and the margins grow, and
  the map does the same** — capped at its native width and centered, not scaled up. This
  was tried the other way (map filling the viewport) and Flore rejected it on sight; the
  map is not a background that should grow with the window. Don't re-propose it.
- **`Container` padding is fluid (`clamp`), not stepped through breakpoints.** Both ends
  are the real Figma anchors and everything between is interpolation. Fluid for a
  concrete reason, not neatness: with breakpoint steps the inner content width ran
  *backwards* at each one — it got narrower as the window got wider, because padding
  jumped faster than the viewport grew. A clamp can't do that. If you ever replace this
  with steps, check monotonicity of the inner width across the breakpoint.

**Both of the slips this pass surfaced are now resolved, in Figma rather than in code:**
the ValueCard row had a wrapper frame wider than its container (Flore removed it and put
the cards on a real grid), and Work's section-header and first-Wayfinding gaps were
tighter than everywhere else (Flore confirmed slips — they're uniform now, and the
spacing constants are deliberately single rather than per-zone so they can't drift apart
again silently).

### Typography

Single typeface, no secondary/display/handwritten fonts: **HK Grotesk**, used across all text roles (headings, prose, UI, breadcrumbs, illustration annotations). Defined in Figma as text styles by weight/size role; imported into code as Tailwind `@layer components` or CSS classes, all referencing the one font-family.

**Scale:** Confirm breakpoints and type scale compression for mobile in Figma before build starts.

Font self-hosting is already resolved, not deferred: HK Grotesk is the only typeface, included as a local webfont asset (no CDN dependency).

### Color Tokens

Resolved — see Design Tokens — Architecture above. Source of truth is `semantic.css` (`colors-text-*`, `colors-border-*`, `colors-chart-*`, `colors-action-*`, `colors-surface-*`, `colors-focus-ring`), not a hardcoded list here.

*Note: Red and blue used sparingly in illustrations only, not as system tokens (chart colors are the exception — see `colors-chart-*`).*

### Spacing Scale

Resolved — see Design Tokens — Architecture above. Full scale lives in `primitives.css` (29 values); the subset actually exposed for component use is re-exported in `semantic.css`. Build against the semantic subset.

---

## Routing & Pages

### Single-Page (Anchor-Navigated Sections)

All visitors land here first. Sections: Work, Approach, About, Contact.

**Routes:** `/` (root, the full single page)

### Sub-Routes (Case Studies)

For projects with substantial content:

**Full case studies (own route, full prose):**
- `/work/artifakt`
- `/work/pitchpivot`
- `/work/welcome-to-my-city`

**Feature cases (own route, lighter content):**
- `/work/sinomocene`
- `/work/teamchatviz`
- `/work/roche`

**NDA projects:** No dedicated route. Card on main page links out to public product (`rega.swiss`, etc.).

**Other hotspots (no dedicated page):**
- Podcast → external link to The Future of UX, ep. 140
- Say hi → anchor-scroll to Contact section
- Language River → anchor-scroll to About section
- Papayas → anchor-scroll to About section

---

## Interaction Specifications

### Hotspot Popover (Refined)

**Desktop (mouse):**
1. Hover over marker → marker highlights, cursor changes to pointer, popover opens directly (no separate click needed)
2. Move away from marker or popover → popover closes
3. Click "View project" → anchor-scroll to matching card (or navigate to route if applicable)
4. Popover area has a bridged hit area so cursor movement toward it doesn't close it
5. Keyboard-focusing a marker (see Keyboard below) opens the popover the same way hover does

**Mobile (touch):**
1. Tap marker → popover opens (same content as desktop)
2. Tap "View project" → anchor-scroll or navigate
3. Tap outside popover → popover closes

**Keyboard:**
1. Tab to marker → marker focuses (visible focus ring)
2. Enter/Space → popover opens
3. Tab within popover → focus cycles through link
4. Escape → popover closes

**Accessibility notes (built-in from day one):**
- Markers are actual `<button>` elements (or focusable roles), not divs with click handlers
- Link inside popover is a real `<a>` element
- Focus management: focus moves to "View project" link when popover opens (optional, can also stay on marker)
- Popover positioned absolutely but not off-screen; ARIA attributes optional for v1 but structure is semantic
- **Marker tap target: minimum 44×44px** (WCAG 2.2 / Apple HIG), independent of visual dot size (18px). Implement as button padding/min-width/min-height around the dot, not a scaled-up dot — the visual mark stays 18px, only the invisible hit area grows. Fixed pixel size regardless of illustration scale/viewport (does not shrink with the SVG on mobile). Not represented in the Figma export — code-only concern; positioned via the same marker `x`/`y` from the JSON manifest.
- **Focus ring gotcha (real bug, now fixed):** the marker dot's drop-shadow was originally set as an inline `style={{ boxShadow }}`. Inline styles always beat stylesheet rules regardless of specificity, so it silently overrode the focus ring's `box-shadow` composition on every render — the ring's CSS variables were computing correctly, but the paint never reflected them. Since markers are the *first* focusable elements in the page's tab order (before the Nav), this made it look like no focus states existed anywhere on the site. Fixed by moving the shadow to a Tailwind `shadow-[...]` class instead of inline style, so it composes with the ring rather than clobbering it. If a future component needs both a static shadow and an interactive ring, use classes for both — never mix one inline style with the other's utility class.

### Breadcrumb Wayfinding

At the top of Work, Approach, About, Contact sections (or per custom placement if removed selectively):

- Avatar illustration (variants per placement — sample the Wayfinding section, node `4494:6080`)
- Chat bubble with section-specific copy (2–3 sentences, pulled from MDX frontmatter)
- "You are here: [Zone] — [Subsection]" text. **Sample the colors from Figma (node `4494:6080`), don't take them from here.** This line previously specified the subsection in accent-orange; Flore has since changed it in Figma and the built page is currently wrong — orange because this doc said so. First instance of the drift the no-duplication rule above exists to prevent. Fixing it is a task in the Wayfinding pass.

---

## Git Workflow & Commits

**One commit per completed stage:**

1. `feat: set up token architecture (CSS vars + Tailwind theme)`
2. `feat: add content model (MDX + hotspot JSON structure)`
3. `feat: build component skeleton (no styling)`
4. `feat: typography pass`
5. `feat: popover interaction + keyboard support`
6. `feat: component styling & responsive layout`
7. `feat: polish & deploy to GitHub Pages`

**Before each commit:** `git status` to confirm no extraneous files; avoid mid-stage commits.

---

## Build Order

Revised estimate — original 6-hour estimate below was written before the Popover variants, MediaCard family, Wayfinding hierarchy, and iframe embed were designed. Realistic total is closer to 16 hours across multiple sessions, not a single sitting.

**Status as of 2026-08-02** (end of the session covering Nav/Footer/Button states and the Contact section):

1. ✅ **Token pull** — done.
2. ✅ **Content model resolution** — done (NDA projects get real `.mdx` files, no route; see Naming Convention above).
3. ✅ **Skeleton** — done.
4. 🟡 **Typography** — partially done, **deliberately deferred to last**, see reordering note below.
5. ✅ **Popover interaction** — done, including the Contact variant's copy-to-clipboard.
6. ✅ **Hotspot wiring** — done, including the 44×44px tap target and the keyboard focus ring (see Interaction Specifications below — this needed a real bug fix, not just implementation).
7. ⬜ **Iframe embed** — not started. Blocked on Flore confirming the real Language River hosting URL.
8. 🟡 **Content wiring** — partially done. **Describe status by what a visitor sees, never by which code fields are populated.** The previous note here said "all project frontmatter is real," which was both false (four `description:` fields were still scaffolding) and useless as a status — a claim about internal fields says nothing about body prose, and nothing at all about content slots that were never modelled. Trusting it over the Figma file is why the ProjectCard nodes went unpulled for a whole round.

   **Content wiring means, per Flore: the media (images, iframes, embeds) + the actual written content.** Both come out of Figma. Missing copy means *not yet pulled*, not *not yet written* — check Figma before ever asking Flore to write or approve copy.

   Done: all 10 project cards (meta, title, description, image caption, CTA), Approach ValueCards + MediaCards, About AsideCards, NDA external links, the Language River embed.

   Still outstanding: all six case-study/feature-case **bodies** are scaffolding prose; Contact bubble copy; the Approach "Selected talks & writing" bubble (marked `TO COMPLETE`); the LinkedIn URL; and four cards whose Figma instances still hold unedited component defaults, shipped as visible `REVIEW —` markers (Artifakt caption, PitchPivot caption, Rega meta + caption).
9. 🟡 **Styling & layout** — the global layout system is in (see below); card refinements and responsiveness are not.
10. ⬜ **Polish & QA** — not started.

**Work done outside this strict order, folded back into the stages above:** the Nav rebuild (mobile hamburger, subpage variant, current-section state), Footer content, and the full button-state audit (hover/pressed/focus across every variant) all came out of Flore's own review pass rather than a scheduled stage — but they're really stage 4 (Typography/states) and stage 9 (styling) work that happened early because it's what she was actively testing. Treat them as done, not as scope creep to redo.

**Execution order reordered — content wiring, then styling, then typography, per Flore:** the numbered list above is the stage *definitions*, not a strict sequence to follow top-to-bottom. The actual next-up order is **8 (Content wiring) → 9 (Styling & layout) → 4 (Typography, done last, combined with a final responsiveness check)**. Flore's reasoning, and it matches this doc's own "Content drives structure, not vice versa" principle further down: real copy and real card layout should exist *before* doing a systematic type-scale/breakpoint pass, not after — checking type sizes against placeholder-length text risks re-checking everything once real content changes wrapping and spacing. Do not default back to numeric order.

**Not in scope for v1 (deferred until post-validation):**
- Figma library reorg (primitives/semantic folder structure)
- Full WCAG accessibility audit (keyboard/focus support built in; full audit separate)
- OG/social preview image
- Dark mode

---

## File Structure (Expected)

Actual structure as of this session (supersedes the aspirational version below where they differ):

```
src/
  components/
    Hero.jsx
    PanZoomContainer.jsx
    Hotspot.jsx
    Wayfinding.jsx
    DistrictBreadcrumb.jsx
    ProjectCard.jsx
    ProjectMedia.jsx
    ValueCard.jsx
    MediaCard.jsx
    AsideCard.jsx
    Popover.jsx
    CopyButton.jsx             # icon-only copy button, used by the map popover
    ContactEmailButton.jsx     # full secondary-chrome copy button, Contact section
    ButtonLink.jsx             # single button component, variant prop (see Button Component Architecture)
    Nav.jsx                    # Desktop/Mobile homepage nav + Subpage nav, all in one file
    Footer.jsx
    Badge.jsx
    Avatar.jsx
    SpeechBubble.jsx
    icons.jsx                  # re-exports from assets/icons/*.svg via vite-plugin-svgr, no hand-copied paths
    Container.jsx
  lib/
    content.js                 # reads MDX/JSON via import.meta.glob, exposes projects + section frontmatter
    hotspotHighlights.js
    useCopyToClipboard.js      # shared idle/copied/failed hook (CopyButton + ContactEmailButton)
  content/
    projects/                  # one .mdx per project, including NDA ones (myride/rega/sbb/trail-app)
    sections/                  # work.mdx, approach.mdx, about.mdx, contact.mdx — section-level frontmatter
  pages/
    HomePage.jsx        # root, single-page scroll
    ProjectPage.jsx     # template for case-study sub-routes
  assets/
    fonts/
      HKGrotesk-*.ttf   # local webfont files
    icons/
      ic-*.svg          # source of truth for every icon; icons.jsx just re-exports these
    illustrations/
      hero-map-background.svg
      hero-map-hotspots.json
    images/
      projects/         # project card thumbnails, e.g. artifakt-thumbnail.png (see Project & Hotspot Naming Convention)
  styles/
    tokens/
      primitives.css    # raw values — colors, spacing, radius
      semantic.css      # role-based tokens referencing primitives (underscore/hyphen bug already fixed)
      components.css    # component-level tokens (buttons, navbar) referencing semantic
    globals.css         # @font-face, resets; imports tokens/*.css in cascade order
  App.jsx
  index.jsx
vite.config.js           # includes vite-plugin-svgr, configured to rewrite Figma's #0E0E0E fill to currentColor
tailwind.config.js       # custom spacing/radius keys are prefixed space-N/radius-N, not bare numbers
```

---

## Open Decisions (Out of Scope for `CLAUDE.md`, but Worth Noting)

**Resolved this session** (kept here briefly so it's clear these aren't open anymore):
- ~~Pan/zoom initial zoom level and constraints~~ → no zoom at all, `centerOnInit` + `limitToBounds`, see Pan/Zoom Container above.
- ~~NDA project content home~~ → real `.mdx` files, no route.

**Still open:**
- **LinkedIn URL** — Contact section's primary button has no URL in Figma. Currently `PLACEHOLDER_LINKEDIN_URL` in `contact.mdx`. Needs Flore's real profile URL.
- **Type scale compression across mobile breakpoints** — not yet audited as a dedicated pass (see Build Order stage 4).
- **Nav breakpoint (768px)** — my judgment call, not a Figma sample (the file only has 402px and 1622px frames). No objection raised, but not explicitly confirmed either — revisit if it feels wrong on a real device.
- **"menu" vs "Tertiary" naming** — same button treatment, two names (Figma vs. this doc). Both map to the same code today; worth collapsing to one in Figma eventually.
- **Real copy for Approach/About cards** — ValueCards, MediaCards, AsideCards are still placeholder text. Flore's recent Figma instance renames surfaced real titles (e.g. AsideCard "Cold plunge," "Data illustrated") that aren't wired into the content files yet — signal that real copy exists and is coming in the Content Wiring stage.
- **CV hosting** — footer's "View CV" currently points at a Google Drive share link (works only while shared as "anyone with the link," and Drive may show a scan interstitial for larger files). Self-hosting the PDF in `/public` would remove both risks before launch.

**Figma file hygiene, worth keeping in mind going forward:**
- **Code Connect is unavailable** — Flore is on a Figma Professional plan; Code Connect (mapping a Figma component directly to its real code implementation) requires Organization or Enterprise. Not worth pursuing unless the plan changes.
- **Instance naming convention adopted:** Figma instances that repeat with different content are now named `ComponentName — Content` (e.g. `ProjectCard — Rega`, `ValueCard — Editing`). This is genuinely load-bearing for future sessions — it's the difference between one direct lookup and opening several instances to find the right one. Keep using it for any new repeating component.
- **Duplicate-frame risk:** earlier in this build the file had a full duplicate of the entire page (`Welcome to my city_on scroll`, a scrolling-prototype frame wrapping a second copy of every section) sitting alongside the real page frame (`bp-1622-desktop`). It had drifted from the original in at least one place (a font-weight difference on the Contact section body copy) before being found and deleted. If a similar duplicate frame gets created again for prototyping, treat its contents as reference only, not a second source of truth — or delete it once the prototype's served its purpose.

---

## Key Principles

- **Componentize early.** Don't build a monolithic page; make Hero, Wayfinding, ProjectCard, Popover, etc. reusable and testable from day one.
- **Content drives structure, not vice versa.** Use real copy (or same-length placeholders) from the start so typography and spacing work first time, not after real copy lands.
- **One feature per commit.** Roll back with `git` instead of arguing a broken session back to working.
- **Accessibility is structural, not polish.** Keyboard support, focus management, semantic HTML go in during Skeleton and Interaction stages, not added after.
- **Tokens are not optional.** Pulling from Figma via MCP and storing as CSS variables is how "change a color everywhere" stays cheap for later.
- **HTML tag follows behavior, not visual style.** Anything that navigates (internal route, external URL, or anchor-scroll) is an `<a>`, regardless of whether it's styled as a filled/outline pill button or plain text — "Read case study," "Rega App," and the anchor-scroll popover CTA are all `<a>` elements. `<button>` is reserved for actions with no navigation at all — in this project, that's the copy-to-clipboard controls (the Say Hi popover's `CopyButton`, and the Contact section's `ContactEmailButton`). Figma's "Button" vs "Link" component naming is a visual taxonomy (chrome vs. plain text) and does not by itself determine the HTML tag.
- **Enumerate a component's full state matrix before building it, don't sample reactively.** `get_metadata` on a Figma component set returns every variant/state symbol by name (e.g. `variant=secondary, state=hover`) — read that list first and treat any state you haven't built as unfinished, not out of scope. Sampling only the state needed for the immediate layout and waiting to be told what's missing wastes the work Flore already put into defining those states. Two specific traps this caused: applying a hover treatment sampled from one component onto a different (if visually similar) one — check whether two things are actually the *same* Figma component before assuming they share states, and ask if it's ambiguous rather than infer; and trusting a state-grid screenshot's colors by eye instead of sampling the real node (a hover label that looks black is actually grey-80, `#494747`).
- **Verify in the browser, not by reading the code back.** `getComputedStyle`, a real keyboard `Tab` press (not a scripted `.focus()`, which doesn't reliably trigger the same `:focus-visible` browser heuristic), an actual click — not just "the class name looks right." Several real bugs this session were invisible from the code alone: a Tailwind spacing key silently colliding with the default scale, an inline style permanently overriding a CSS ring despite the ring's variables computing correctly, a gradient overlay literally painting over content it wasn't supposed to touch.
