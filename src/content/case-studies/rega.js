/**
 * Rega — the first of the four NDA SUBPAGES.
 *
 * A fourth content tier, below the project snapshots: hero plus two text
 * columns and nothing else. See CaseStudyNda.jsx for what the tier is and what
 * it deliberately leaves out.
 *
 * COPY PROVENANCE: read off the Figma frame `Subpage_Rega` (node 4962:7091) via
 * get_design_context, not transcribed from a screenshot. Per CLAUDE.md's
 * "Figma leads before a thing is built", the frame is the authority — this
 * page had not been built when the copy was pulled.
 *
 * THE HERO ASSET CARRIES ITS OWN NDA STAMP, baked into the export, where every
 * other NDA surface on the site renders the live `Badge` component. That is why
 * this page passes no badge and why `mediaClassName` adds no chrome: the PNG is
 * a transparent composition (artwork + stamp + annotation line) meant to sit
 * directly on the stage. Consequence worth knowing before editing: the stamp
 * scales with the image, so it shrinks with the artwork on a phone, and it can
 * drift from the real Badge without anything failing. Flagged to Flore.
 *
 * ASSET PATHS point at `public/images/nda/`, converted from Flore's delivered
 * PNGs to WebP (2026-08-27) to match every other image on the site — 562KB to
 * 128KB here, and `public/` ships verbatim. Resolved through `assetUrl()` in
 * Media.jsx; a literal `/images/...` would 404 under the Pages base path.
 */

const M = '/images/nda'

// Measured off the delivered file, not read off the frame. The frame draws the
// hero slot at 689x439 (ratio 1.57); the export is 1379x880 (ratio 1.567). Close
// enough to look identical and far enough to shift the layout on load if the
// frame's number were reserved instead.
const HERO_ASPECT = 1379 / 880

export default {
  slug: 'rega',

  frame: {
    category: 'Safety-Critical UX • Emergency Call Flows • Real-Time Data Design',
    // DELIBERATELY THE SAME as the homepage card title in projects/rega.mdx,
    // unlike the snapshot tier where card and page diverge. The frame repeats
    // it, so it is repeated. The two files are NOT wired together — this pair
    // has to be changed in both places and can drift silently.
    title: "Redesigning Rega's app for 1.1M+ users",
    // No `oneLiner`: the frame goes straight from title to credits.
    facts: ['2021 — Lead UX & Visual Designer. Ubique for Rega.'],
    liveUrl: 'https://www.rega.ch/en/our-missions/this-is-how-we-help-you/rega-app',
    liveLabel: 'Rega App',
    // Secondary with the white-fill override, sampled from the real instance
    // (node 4962:7108): `button/secondary/border` + `button/secondary/text`
    // over `Colors/Surface/background`. Frame applies the fill override for
    // every secondary hero button, so only the variant is named here.
    buttonVariant: 'secondary',
    // `Colors/Surface/grey` (#f5f5f5), the stage all four NDA frames share —
    // the same token the snapshot tier's heroes use, not a new value.
    stage: 'bg-surface-grey',
    tone: 'light',
    zone: 'Harbour',
    subsection: 'Client work at scale',

    media: {
      kind: 'image',
      src: `${M}/hero-rega.webp`,
      alt: 'Two Rega app screens side by side: a live-location map, and the same map with an emergency alert panel open.',
      label: '[ hero-rega.webp — 1379x880 ]',
      placeholderAspect: HERO_ASPECT,
    },
    // NO CHROME, unlike every other hero on the site. The export is a
    // transparent composition that already includes its own framing; a border
    // and white fill would draw a card around artwork that is meant to float
    // on the stage. `mx-auto` is kept from Frame's default because it is what
    // centres the floating live-site button on the artwork.
    mediaClassName: 'mx-auto',
    mediaRadius: 'rounded-none',
  },

  columns: [
    {
      title: 'What was essential',
      body: [
        {
          type: 'p',
          text: "Someone terrified needs to act in under three seconds. The hard part wasn't building the emergency flow — it was deciding what the app is allowed to ask of a person who is already panicking. And then the opposite question: what it can do in the hours before anyone panics at all.",
        },
      ],
    },
    {
      title: 'What I did',
      body: [
        {
          type: 'list',
          items: [
            '**Onboarding and update onboarding:** bringing new users in while moving existing ones off the old app — the switch is where you lose people who already rely on the service.',
            '**Visual design for mobile:** a strong brand meeting an emergency screen. Clarity and safety first wherever the two disagreed.',
            '**Alarm (SOS):** what the app asks for before, during and after a call — and what it refuses to ask.',
            '**Map and live location (prevention):** sharing with a trusted contact, which extends the app into the hours before anything goes wrong.',
            '**Information:** what someone needs to know before they need it, and what can wait until after.',
          ],
        },
        {
          type: 'p',
          text: '**Scale:** 1.6M+ downloads · 53K new patrons in 2021 · iOS & Android',
        },
      ],
    },
  ],
}
