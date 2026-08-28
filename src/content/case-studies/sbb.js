/**
 * SBB — NDA subpage. See rega.js for the tier's conventions and the notes on
 * copy provenance, the baked-in NDA stamp, and the asset paths.
 *
 * COPY PROVENANCE: Figma frame `Subpage_SBB` (node 4969:7628).
 *
 * THIS IS THE ONE NDA PROJECT WITH NO MAP HOTSPOT (`hotspotId: null` in
 * projects/sbb.mdx), so the only routes to this page are the Work grid card and
 * a direct URL. Nothing to do about it here; worth knowing when checking that
 * the page is reachable.
 *
 * THE STAMP FLOATS FREE ON THIS ONE. In the frame the NDA label is anchored to
 * the 689-wide hero slot rather than to the artwork, and the SBB composition is
 * a single narrow phone — so the stamp sits in empty space well to the right of
 * it, where Rega's and myRIDE's overlap their artwork. It is baked into the
 * export, so it cannot be nudged in code; it needs a re-export from Figma with
 * the label moved. Flagged to Flore, not worked around.
 */

const M = '/images/nda'

const HERO_ASPECT = 1379 / 888

export default {
  slug: 'sbb',

  frame: {
    category: 'Motion Design · Microinteractions · Perceived Performance',
    title: 'Branded motion for a 3M+ user booking flow',
    facts: ['2024 — Motion & UX Designer, solo. Ubique for SBB.'],
    liveUrl: 'https://www.sbb.ch/en/travel-information/apps/sbb-mobile.html',
    liveLabel: 'SBB App',
    buttonVariant: 'secondary',
    stage: 'bg-surface-grey',
    tone: 'light',
    zone: 'Harbour',
    subsection: 'Client work at scale',

    media: {
      kind: 'image',
      src: `${M}/hero-sbb.webp`,
      alt: 'An SBB app booking screen in dark mode showing a loading animation, with the animation frame enlarged beside it.',
      label: '[ hero-sbb.webp — 1379x888 ]',
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
          text: 'Perceived wait time is as real as actual wait time. A booking flow that feels sluggish loses trust regardless of what the server logs say — which makes motion a performance decision rather than a decorative one.',
        },
      ],
    },
    {
      title: 'What I did',
      body: [
        {
          type: 'list',
          items: [
            '**Motion across platforms:** one export serving all of them, so the same behaviour had to hold everywhere — search, reservation and payment reading as one product, not three flows stitched together.',
            '**Booking flow:** a different animation at each step of the booking process — so the wait tells you where you are in the flow rather than just filling the gap.',
            '**Modes:** the system holds in light and dark, where the same transition has to stay legible against inverted contrast.',
            '**Iconography:** a custom set built to move — icons that animate are constructed differently from icons that sit still.',
          ],
        },
        {
          type: 'p',
          text: '**Scale:** 3M+ users · Light & dark · 2024',
        },
      ],
    },
  ],
}
