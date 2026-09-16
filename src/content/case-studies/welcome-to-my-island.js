/**
 * Welcome to my island — the portfolio site's own case study.
 *
 * A WORK IN PROGRESS, rendered through CaseStudyWip. Copy read off the Figma
 * frame `Subpage_welcome to my island` (node 4969:7203), whose content stops
 * at y=1101 of a 4482-tall frame — the hero is finished, the body is one
 * placeholder line, and the rest is empty canvas.
 *
 * ---------------------------------------------------------------------------
 * THREE THINGS TO SETTLE BEFORE THIS IS FINISHED. All flagged to Flore
 * 2026-08-27; none of them blocks the page from being useful now.
 *
 * 1. RESOLVED — IT IS "ISLAND" EVERYWHERE NOW. Flore, 2026-08-27: "yes city
 *    should be island". The rename went past this page: the slug and route
 *    (`/work/welcome-to-my-island`), the content filenames, the thumbnail, the
 *    mediaTints key, and the two visible strings that carried the old
 *    metaphor — the homepage greeting bubble in Hero.jsx and the og:image:alt
 *    in index.html.
 *
 *    THE OLD URL REDIRECTS rather than 404s (see App.jsx): `/work/welcome-to-
 *    my-city` was live and linkable, so it now forwards here.
 *
 * 2. NO CREDIT LINE. Every other hero on the site closes with one — "2021 —
 *    Lead UX & Visual Designer. Ubique for Rega." The frame's slot for it
 *    (node 4969:7215) currently repeats the meta line above it word for word,
 *    "AI • Claude Code • Personal Branding", which would render the same
 *    string twice ten pixels apart and read as a bug. So it is OMITTED here
 *    rather than duplicated. `Frame` renders nothing when `facts` is absent,
 *    so adding the real line later is one field.
 *
 * 3. THE BODY IS A DELIBERATE PLACEHOLDER, and diverges from the frame.
 *    The frame reads "Working working working on this content :-)", which is
 *    a note to self; the audience for this page is a design manager deciding
 *    whether to keep clicking. Flore chose the line below on 2026-08-27 to
 *    replace it. It says the same thing — not finished — but earns the space
 *    by using the one joke available here that is also true: the reader is
 *    standing inside the thing the case study is about.
 */

const M = '/images/welcome-to-my-island'

// Measured off the delivered file (1289x805 = 1.6012), not read off the frame,
// which draws the slot at 644.36x402.22 (1.6019). They agree to four decimal
// places, which is what you want; the file is still the one that decides,
// because it is what the browser actually reserves space for.
const HERO_ASPECT = 1289 / 805

export default {
  slug: 'welcome-to-my-island',

  frame: {
    category: 'AI • Claude Code • Personal Branding',
    // Matches the homepage card in projects/welcome-to-my-island.mdx exactly,
    // as of the rename. The two files are NOT wired together, so this pair has
    // to be changed in both places and can drift silently.
    title: 'Welcome to my island — The making of a story-first portfolio',
    // No `facts` and no `oneLiner` — see (2) in the header note.
    //
    // The frame's CTA reads "Github" with the external-link arrow but carries
    // no URL, the same way Roche's did. This is the repo that builds and
    // serves the site (github.com/FloredC/flore-de-crombrugghe — the same path
    // the live site is published under at floredc.github.io), so it is wired
    // rather than left dead. Worth confirming it is the destination she means
    // and that the repo is public.
    liveUrl: 'https://github.com/FloredC/flore-de-crombrugghe',
    liveLabel: 'Github',
    // Secondary with the white-fill override, the same treatment every other
    // subpage hero button uses. Frame applies the fill override itself.
    buttonVariant: 'secondary',
    // `Colors/Surface/canvas` (#f0f6ff) — the pale blue, read off the hero
    // section (node 4969:7207). Not the NDA tier's grey and not Artifakt's
    // yellow; this page gets the map's own blue, which is the right call given
    // the hero image is a picture of that map.
    stage: 'bg-surface-canvas',
    tone: 'light',
    zone: 'Lab',
    subsection: 'Own products',

    media: {
      kind: 'image',
      src: `${M}/hero.webp`,
      alt: 'The portfolio homepage: an illustrated island map with coloured hotspot dots, and an avatar introducing Flore de Crombrugghe, Senior Product Designer.',
      label: '[ hero.webp — 1289x805 ]',
      placeholderAspect: HERO_ASPECT,
      // The frame's own slot width. Its own number rather than a reused
      // constant, per the warning on ARTIFAKT.heroMedia: this asset is
      // landscape 1.60 where PitchPivot's hero is portrait 0.80, so borrowing
      // MEDIA_WIDTH.hero would set a completely different height.
      maxWidth: 644,
    },
    // Radius 20 and the grey hairline, both bound on the hero section. Note
    // the asset is a SCREENSHOT OF THE SITE that already contains its own pale
    // background, so the border is what stops it dissolving into the stage —
    // the two blues are close.
    mediaClassName: 'mx-auto border border-border-grey',
    mediaRadius: 'rounded-radius-20',
  },

  // One paragraph, verbatim from node 4969:7310 — see (3) in the header note.
  body: ["Still writing this one. In the meantime, you're standing on it."],
}
