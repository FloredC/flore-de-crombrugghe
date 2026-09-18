# MEMORY.md

Behaviour rules live in CLAUDE.md. Only facts that change belong here (source and date in brackets; if the code disagrees, the code wins; not committed to git).

## ACTIVE PROJECTS

- Workforce setup on branch docs-housekeeping: CLAUDE.personal.md, docs/ARCHITECTURE.md and MEMORY.md done. (2026-09-17)
- Workforce setup, next: swap and test, voice-principles.md, review-questions.md, skills. (2026-09-17)
- Welcome to my island: the making-of case study, the last page to build. (Flore, 2026-09-17)
- Welcome to my island: no draft yet. Flore writes it from the process logs. (Flore, 2026-09-17)
- Welcome to my island: new Figma page, reusing the Artifakt or PitchPivot layout as much as possible. (Flore, 2026-09-17)
- Welcome to my island: online end of next week at the latest (2026-09-25). Directional. (Flore, 2026-09-17)
- Welcome to my island is the first test of the workforce setup. The setup comes first. (Flore, 2026-09-17)
- Language check of all site copy, including em dashes: case study pages first, then the homepage. (Flore, 2026-09-17)
- Language check starts once voice-principles.md exists. (Flore, 2026-09-17)
- "Open for work" badge near the top avatar: waiting for Flore's design. (Flore, 2026-09-17)

## THE FACTS

### Site

- Live on floredecrombrugghe.com since 2026-09-01. (code, public/CNAME)
- Full case studies: PitchPivot, Artifakt. (code, ProjectPage.jsx)
- Snapshot pages: Sinomocene, Teamchatviz, Roche. (code, ProjectPage.jsx)
- NDA pages: Rega, myRIDE (SwissPass + SBB), SAC trail app, SBB (loading animations). (code; Flore, 2026-09-16)
- All four NDA pages are fully written. (Flore, 2026-09-16)
- Welcome to my island is live as a work-in-progress page, hidden from other pages' next/previous links. (code, welcome-to-my-island.mdx)

### Audience and success

- Audience: hiring managers first, design peers second. (Flore, 2026-09-17)
- Success signal: visitors open at least one case study. (Flore, 2026-09-17)
- Success signal: hiring managers mention a case study. (Flore, 2026-09-17)

### Numbers

- GA4 is rarely checked so far. (Flore, 2026-09-17)
- Visitor numbers:

### Publishing and testing

- Pages go live on Flore's judgment. No review step. (Flore, 2026-09-17)
- User testing round 1: done on the first live version. (Flore, 2026-09-17)
- User testing round 2: once the island page and the edits are online. (Flore, 2026-09-17)

### Files and assets

- Old project material: Dropbox folder "Flore UX website (Claude)". Historical, not a source. (Flore, 2026-09-16)
- Raw material and making-of material: 01_Input/, not committed. (Flore, 2026-09-16)
- Flore delivers images as PNG and SVG. (Flore, 2026-09-17)
- Claude converts images to WebP and compresses videos. (Flore, 2026-09-17)
- App used for illustrations:
- Tool used for screen recordings:
- Process logs are private working notes: design decisions, technical tracking, retrospectives. (Flore, 2026-09-17)
- Process logs get consolidated before any are published. (Flore, 2026-09-17)

### Tools

- Figma, Professional plan, so no Code Connect. [confirm] (Flore, 2026-09-16)
- Figma file key: 8T6lwxjUm5PjWAir4X0d5d. (old CLAUDE.md)
- Shipped Figma frames are marked [BUILT]. [confirm] (Flore, 2026-09-16)
- Figma MCP, Notion for drafting copy, Lottie for animation. (Flore, 2026-09-16)
- GitHub Pages, deploys on every push to main. (code, deploy.yml)

### Decisions

- Analytics (GA4) run without a cookie banner: "ship, then decide". (Flore, 2026-09-01)
- The map never zooms. (code, PanZoomContainer.jsx)
- The map sits 75% to the right, not centred. (code, Hero.jsx)
- Subpage nav shows only "← Work" and Contact. (code, Nav.jsx)
- Contact section has no avatar and no speech bubble. (Flore, 2026-08-05)

### Figma and code differences we accept

- Two colours (yellow surface, grey) are added by hand in semantic.css. Changing them in Figma won't reach the site. (code, semantic.css)
- Avatar line weight: 0.95 in code (the decision), thicker in Figma. A new avatar export would bring back the thick line. (code; Flore, 2026-09-16)
- "menu" and "tertiary" are the same button with two names. (code, ButtonLink.jsx)

### Tried and rejected (don't propose again)

- Map scaling up with the window. [confirm] (old CLAUDE.md, 2026-08-03)
- Figma's image proportions on laptop screens. [confirm] (old CLAUDE.md, 2026-08-25)
- Map centred, and map flush right. [confirm] (old CLAUDE.md, 2026-08-31)
- An automatic checker for Figma values. [confirm] (old CLAUDE.md, 2026-08-19)

### Future opportunities

-

### Known and accepted

- Nav breakpoint (768px) and the 1600px boundary are judgment calls: Figma has no frame in between. [confirm] (old CLAUDE.md)
- Nav and Footer text sizes on mobile are guessed, for the same reason. [confirm] (old HANDOFF.md)

## OPEN DECISIONS

| Decision | Status | Since |
|---|---|---|
| Cookie consent for Swiss and EU visitors | Open | 2026-09-01 |
| Self-host the CV (the Google Drive link only works while shared publicly) | Open | 2026-09-16 |
| Two screencasts of about 6 MB load as soon as the page opens (artifakt.mp4, pushback-pivot.mp4) | Open, low priority | 2026-09-16 |
| Language River loads its library and font from outside servers | Open | 2026-09-16 |
| Which consolidated process logs to publish on the island page | Open | 2026-09-17 |
