/**
 * trail-app (SAC) — NDA subpage. See rega.js for the tier's conventions and the
 * notes on copy provenance, the baked-in NDA stamp, and the asset paths.
 *
 * COPY PROVENANCE: Figma frame `Subpage_SAC` (node 4969:7564).
 *
 * ---------------------------------------------------------------------------
 * THE CREDIT LINE DIVERGES FROM THE FRAME, ON PURPOSE (2026-08-27).
 *
 * The frame reads "2024 — UX Designer, multi-platform. Ubique for SBB." Both
 * facts in it are wrong, and the page contradicts itself on one of them:
 *
 *   - the YEAR. This page's own Scale line says 2022, and so does
 *     projects/trail-app.mdx. 2024 is myRIDE's year.
 *   - the CLIENT. The work is for the Swiss Alpine Club, which the page title
 *     says outright. SBB is a different client with its own subpage.
 *
 * These four frames were duplicated from PitchPivot and then from each other —
 * every body text layer on all four is still NAMED "PitchPivot helps designers
 * translate design thinki…" — and this line did not get corrected in the pass
 * that fixed myRIDE's. Shipping a wrong client attribution on a real client's
 * project is not a divergence worth deferring, so it is corrected here and
 * flagged. To restore the frame's literal, this is the one line to change.
 *
 * The role wording ("UX Designer, multi-platform") is the frame's and is kept,
 * even though the mdx card says "UX & Visual Designer (iOS & Android)" — those
 * describe the same job at different lengths, which is not a contradiction.
 *
 * FILE NAMING: this is `trail-app`, never `sac` — SAC is the client, the slug
 * is the product. The delivered hero export was `hero-sac.png` and was renamed
 * on conversion for the same reason (CLAUDE.md, Project & Hotspot Naming).
 */

const M = '/images/nda'

const HERO_ASPECT = 1379 / 888

export default {
  slug: 'trail-app',

  frame: {
    // The frame sets this with double spaces around the bullet
    // ("Map-Based UX  •  Search & Filter Design"); normalised to single, which
    // is what the other three frames use.
    category: 'Map-Based UX • Search & Filter Design',
    title: 'Swiss Alpine Club — Trail discovery',
    // CORRECTED FROM THE FRAME — see the header note above.
    facts: ['2022 — UX Designer, multi-platform. Ubique for SAC.'],
    liveUrl: 'https://www.sac-cas.ch/en/sac-cas-app/',
    liveLabel: 'SAC App',
    buttonVariant: 'secondary',
    stage: 'bg-surface-grey',
    tone: 'light',
    zone: 'Harbour',
    subsection: 'Client work at scale',

    media: {
      kind: 'image',
      src: `${M}/hero-trail-app.webp`,
      alt: 'Two SAC app screens side by side: a topographic map with a chosen route, and a filtered list of trails with the search keyboard open.',
      label: '[ hero-trail-app.webp — 1379x888 ]',
      placeholderAspect: HERO_ASPECT,
    },
    mediaClassName: 'mx-auto',
    mediaRadius: 'rounded-none',
  },

  columns: [
    {
      title: 'What was essential',
      body: [
        {
          type: 'p',
          text: "A good route isn't a property of the trail. It depends on who's walking, what they packed, and what the sky is doing. Trail discovery fails when it treats route data as the answer instead of the input — and it gets used one-handed, mid-hike, in conditions the office never simulates.",
        },
      ],
    },
    {
      title: 'What I did',
      body: [
        {
          type: 'list',
          items: [
            "**Search and filter:** two versions, one per platform, each using patterns its users already know. Built around what makes an outing possible — activity, conditions, time — not the route database's own structure.",
            "**Map navigation:** search couldn't filter the map, so the sheet had to carry the link between list and map.",
            '**Design system:** component patterns across devices, built with dev so decisions held in code rather than per screen.',
            '**Visual design:** an icon set that holds from filter size to full-screen map, and an animated chamois.',
          ],
        },
        {
          type: 'p',
          text: '**Scale:** 80k users · Multilingual · 2022',
        },
      ],
    },
  ],
}
