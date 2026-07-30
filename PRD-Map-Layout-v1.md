> ✅ **Resolved 2026-07-30.** Popover trigger is confirmed: hover/keyboard-focus opens the popover directly on desktop, tap opens it on mobile. `CLAUDE.md` and the Notion "Dev Handoff" doc previously described a click-to-open variant — both have been updated to match this.

# 🗺️ PRD — Map & Layout (v1)

*Source: Notion, "Dev Handoff — Decisions, To-Do & Open Questions" → "Website 2026" → "Website and Case Studies" → "FLORE UX".*

---

## Goal
- Prove that an illustrated, hotspot-based map reads as an inviting way to explore the work — and that visitors can find and open project details without being told how.
- Prove that it raises curiosity in the viewer to look more into the work in detail.
- Prove that the website is unique and shows more about who I am as a product designer.

## Audience
Design managers and HR at product companies, arriving cold, before they've seen any password-protected case study.

## In scope (v1)
All 9 hotspots on the map (this predates the 10th project / SBB addition visible in `CLAUDE.md` — reconcile before build):
- Artifakt — Tracing Your Way Past the Blank Canvas
- PitchPivot — Design Reasoning for Business Impact
- myRIDE — Pricing UX for a 3,000-person pilot
- Redesigning Rega's app for 1.1M+ users
- Faster trail discovery for 80k users
- The Future of UX — podcast, episode 140
- Say hi!
- My Language River
- 333 Saftige Papayas

- The map illustration with hotspots
- Popover per hotspot: title, one-line hook, "View project" link that anchor-scrolls to the matching card in the Work grid (the card's own CTA then goes to a full case-study route for projects that have one)
- Pan + zoom interaction on the map itself (see Responsiveness)

## Out of scope (v1)
OG image, dark mode, full accessibility audit, font self-hosting (note: `CLAUDE.md` says font self-hosting is actually already resolved/done — this line is stale). **No NDA gating mechanism** — there's no gate at all.

## Success criteria
- Testers discover and open at least 3 hotspots without being prompted.
- Nobody describes the map as confusing or hard to click into unprompted.
- Testers are "hooked" and want to open the case studies.
- Testers can get an understanding of what I do and what projects I've been working on.

---

## Core flow
1. Visitor lands on the map view — full illustration if it fits the viewport, cropped with pan-to-explore if it doesn't.
2. On desktop, hovering or keyboard-focusing a marker opens the popover directly. On mobile, tapping a marker opens it.
3. The popover shows: title, one-line hook, "View project →" link.
4. Visitor clicks "View project," which anchor-scrolls down to that project's card in the Work grid — no gate, but the card's own CTA ("Read case study" etc.) may then navigate to a dedicated route for projects that have one, like PitchPivot.
5. Popover closes on click-outside, Escape, moving off the marker/popover (desktop hover), or tapping the same hotspot again (mobile).

---

## Interaction spec — popover
- **Hit targets:** hotspot's actual clickable area is bigger than its visual dot — minimum 44×44px. Same 44×44px minimum for "View project" and any other interactive element in the popover.
- **Positioning:** popover anchors adjacent to its hotspot, flips to stay on-screen near edges — `@floating-ui/react` for collision handling.
- **Only one popover open at a time.**
- **Dismissal:** click-outside, Escape, moving off the marker/popover (if hover-based), or interacting with the same hotspot again.

(See `CLAUDE.md`'s "Popover" component spec and "Interaction Specifications" section for the fuller, more current version of this — including the desktop hover-highlight → click-open sequence and full keyboard spec.)

---

## Responsiveness (resolved — overflow-triggered pan)
- Pan activates whenever the illustration is cut off by its container — not a hardcoded mobile-vs-desktop split. If the map's natural rendered size exceeds the visible viewport at any breakpoint, panning turns on; if it fits, it's static and centered, no pan controls.
- Hotspot coordinates stay % of viewBox regardless — pan/zoom is a viewport transform on top of that.
- Implementation: `react-zoom-pan-pinch` (confirmed in `CLAUDE.md`), not hand-rolled transform math.
- Still to set: initial zoom/crop level when pan is active, pan boundaries, visual pan affordance/hint.

---

## Work grid — project cards
- The card is not the popover — separate grid section ("Work") below the map, organized into thematic zones with wayfinding captions.
- Grid layout: roughly 2 columns on desktop with one featured full-width card at the top (Artifakt).
- **NDA handling:** NDA'd projects get the same full card treatment as everything else, with a small "NDA" badge, and the CTA swaps from "Read case study" to a link out to the live public product instead of a written case study.
- **Card layout:** Reusable React component, Flexbox-based, `w-full`, media via `aspect-ratio`, text always wraps, CTA pinned via `margin-top: auto`.

**Page types per project — see `CLAUDE.md`'s "Project & Hotspot Naming Convention" table for the current, more complete version (10 projects, including SBB, not reflected here).**

## Open questions specific to this feature
- ⚠️ Popover trigger (hover-opens vs. hover-highlights-then-click-opens) — flagged above, needs confirmation.
- ✅ Zone taxonomy — Lab, Harbour (Client work at scale + Feature cases), Square (Design Principles + Contact), Plaza (Selected talks & writing), House (About).
- ✅ Pan scope — overflow-triggered, not device-based.
- Confirm the CTA label pattern — three variants: "Read case study" (own route), "[Product] Website/App ↗" (NDA'd, external), "View Project" (feature cases, own route).
