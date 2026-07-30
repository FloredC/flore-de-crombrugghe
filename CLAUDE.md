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

**Pan/Zoom Container (Map Illustration)**
- Wraps the SVG illustration
- Activates only when rendered size exceeds container size (overflow-triggered, not device-based)
- Uses `react-zoom-pan-pinch` library
- Hotspot coordinates stay % of viewBox; pan/zoom is a viewport transform on top
- On mobile: pinch-to-zoom, pan by drag
- On desktop: scroll-to-zoom (if enabled), drag-to-pan

**Nav (Sticky)**
- Minimal below hero; docks to top on scroll
- Links to: Work, Approach, About, Contact (anchor-scroll, not routes)
- No user avatar or profile section in v1

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
| myRIDE | `myride` | `hotspot-myride` | NDA, external link | "myRIDE Website ↗" |
| Redesigning Rega's app | `rega` | `hotspot-rega` | NDA, external link | "Rega App ↗" |
| SAC | `sac` | `hotspot-sac` | NDA, external link | "SAC Website ↗" |
| SBB | `sbb` | none | NDA, external link | "SBB App ↗" |

Non-project hotspots (no Work-grid card): The Future of UX (podcast) → `hotspot-future-of-ux`, "Listen →"; Say hi! → `hotspot-say-hi`, "Say hi →" (Contact anchor); My Language River → `hotspot-language-river`, "Explore →" (About anchor); 333 Saftige Papayas → `hotspot-papayas`, "Read more →" (About anchor).

**Figma layer naming:** Use slugs exactly as above. For markers + highlights, use:
- `hotspot-artifakt` (marker, the interactive dot)
- `hotspot-artifakt-highlight` (accent shape that turns orange on hover, if separate from background illustration)

Note: myRIDE, Rega, SAC, and SBB are NDA projects without dedicated `.mdx` files (see File Structure) — their card content needs a defined home (either give them `.mdx` files with no route, or define in a data file). Open decision, not yet resolved.

---

## Styling & Design System

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

### Breadcrumb Wayfinding

At the top of Work, Approach, About, Contact sections (or per custom placement if removed selectively):

- Avatar illustration (simple line-drawn figure, 40–60px)
- Chat bubble with section-specific copy (2–3 sentences, pulled from MDX frontmatter)
- "You are here: [Zone] — [Subsection]" text, with subsection name in the `--color-accent-orange` token color (do not hardcode a hex value — reference the token so it stays in sync with markers/highlights)

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

1. **Token pull** (15 min) — Copy `primitives.css`/`semantic.css`/`components.css` into `src/styles/tokens/`, fix the underscore/hyphen bug in `semantic.css` (see Design Tokens — Architecture), import into `globals.css`, wire semantic layer into Tailwind `theme.extend`
2. **Content model resolution** (30 min) — Decide the open items before building against them: NDA project content home (`.mdx` vs. data file), media/press entry schema (MediaCard has no frontmatter/JSON home yet), Aside and ValueCard content structure
3. **Skeleton** (3–4 hrs) — Full component hierarchy: Hero, Wayfinding (Guide + Breadcrumb + Avatar + Speech bubble, nested), ProjectCard (+ ProjectImage/ProjectMedia), Popover (Link + Contact variants), MediaCard (Image + Embed variants), Aside, ValueCard, Nav, Button family (Primary/Secondary/Tertiary/Menu/Popover). Placeholder content matching real copy length, no styling.
4. **Typography** (1.5 hrs) — Type scale applied across the full component set, spacing from tokens, breakpoints working
5. **Popover interaction** (2.5 hrs) — Hover/focus → open, click-outside/Escape → close, bridged hit area, keyboard support, plus the Contact variant's copy-to-clipboard behavior
6. **Hotspot wiring** (1.5 hrs) — Marker/highlight positioning from `hero-map-hotspots.json`, tap targets, highlight toggle on hover
7. **Iframe embed** (1 hr) — Language River embed, responsive/aspect-ratio sizing
8. **Content wiring** (2 hrs) — Real copy and images into MDX/JSON for all 10 projects, media entries, Asides, and ValueCards
9. **Styling & layout** (3 hrs) — Colors, visual polish, responsive grid, CTA styling across everything above
10. **Polish & QA** (1 hr) — Link validation, breakpoint spot-check, accessibility spot-check, deploy

**Not in scope for v1 (deferred until post-validation):**
- Figma library reorg (primitives/semantic folder structure)
- Full WCAG accessibility audit (keyboard/focus support built in; full audit separate)
- OG/social preview image
- Dark mode

---

## File Structure (Expected)

```
src/
  components/
    Hero.jsx
    Wayfinding.jsx
    ProjectCard.jsx
    Popover.jsx
    Nav.jsx
  content/
    projects/
      artifakt.mdx
      pitchpivot.mdx
      welcome-to-my-city.mdx
      sinomocene.mdx
      teamchatviz.mdx
      roche.mdx
  pages/
    HomePage.jsx        # root, single-page scroll
    ProjectPage.jsx     # template for case-study sub-routes
  assets/
    fonts/
      HKGrotesk-*.ttf   # local webfont files
    illustrations/
      hero-map.svg
      hero-map-hotspots.json
    images/
      projects/         # project card thumbnails, e.g. artifakt-thumbnail.png (see Project & Hotspot Naming Convention)
  styles/
    tokens/
      primitives.css    # raw values — colors, spacing, radius
      semantic.css      # role-based tokens referencing primitives (fix underscore/hyphen bug before use)
      components.css    # component-level tokens (buttons, navbar) referencing semantic
    globals.css         # @font-face, resets; imports tokens/*.css in cascade order
    tailwind.config.js
  App.jsx
  index.jsx
```

---

## Open Decisions (Out of Scope for `CLAUDE.md`, but Worth Noting)

- Pan/zoom initial zoom level and constraints when overflow is detected
- Type scale compression across mobile breakpoints

---

## Key Principles

- **Componentize early.** Don't build a monolithic page; make Hero, Wayfinding, ProjectCard, Popover, etc. reusable and testable from day one.
- **Content drives structure, not vice versa.** Use real copy (or same-length placeholders) from the start so typography and spacing work first time, not after real copy lands.
- **One feature per commit.** Roll back with `git` instead of arguing a broken session back to working.
- **Accessibility is structural, not polish.** Keyboard support, focus management, semantic HTML go in during Skeleton and Interaction stages, not added after.
- **Tokens are not optional.** Pulling from Figma via MCP and storing as CSS variables is how "change a color everywhere" stays cheap for later.
- **HTML tag follows behavior, not visual style.** Anything that navigates (internal route, external URL, or anchor-scroll) is an `<a>`, regardless of whether it's styled as a filled/outline pill button or plain text — "Read case study," "Rega App ↗," and the anchor-scroll popover CTA are all `<a>` elements. `<button>` is reserved for actions with no navigation at all — in this project, that's only the copy-to-clipboard control in the Say Hi popover. Figma's "Button" vs "Link" component naming is a visual taxonomy (chrome vs. plain text) and does not by itself determine the HTML tag.
