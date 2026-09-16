/**
 * myRIDE — NDA subpage. See rega.js for the tier's conventions and the notes on
 * copy provenance, the baked-in NDA stamp, and the asset paths.
 *
 * COPY PROVENANCE: Figma frame `Subpage_myRIDE` (node 4969:7313).
 *
 * THE PAGE TITLE IS NOT THE CARD TITLE, unlike Rega's. The card in
 * projects/myride.mdx names the product ("myRIDE — Pricing UX for a
 * 3,000-person pilot"); the frame opens with the claim instead. Flore's frame,
 * kept — the same split the snapshot tier makes deliberately.
 */

const M = '/images/nda'

const HERO_ASPECT = 1379 / 884

export default {
  slug: 'myride',

  frame: {
    category: 'Platform UX · Pricing Models · Cross-Functional Alignment',
    title: 'A pricing pilot tested with 3,000+ people',
    facts: ['2024 — UX Designer, multi-platform. Ubique for SBB and Swisspass.'],
    liveUrl: 'https://www.myride.ch/de/index.html',
    // Capital W, from the frame. The homepage card's `cta` in myride.mdx reads
    // "myRIDE website" — the two are separate strings in separate files and
    // the frame owns this one.
    liveLabel: 'myRIDE Website',
    buttonVariant: 'secondary',
    stage: 'bg-surface-grey',
    tone: 'light',
    zone: 'Harbour',
    subsection: 'Client work at scale',

    media: {
      kind: 'image',
      src: `${M}/hero-myride.webp`,
      alt: 'The myRIDE cost calculator in a browser window, comparing two travel passes against a monthly price.',
      label: '[ hero-myride.webp — 1379x884 ]',
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
          text: 'Pricing looks like a business problem and behaves like a design one. Nobody wants a better tariff — they want to know, before they commit, whether this is a good deal for them. Until you can answer that in the interface, no pricing model is legible enough to test.',
        },
      ],
    },
    {
      title: 'What I did',
      body: [
        {
          type: 'list',
          items: [
            '**Cost calculator:** the comparison built into the moment before purchase rather than the receipt after it — something people could argue with.',
            "**Community and survey:** an in-app layer where testers answered and saw each other's answers. A pilot needs somewhere to talk back.",
            '**Onboarding:** where price comparison, personal circumstances and authentication collide — the messiest stretch, and the one that decides whether anyone reaches the product.',
            "**Web design and development:** designed and built the pilot's site in Webflow. For the testers it was the first version of the product that existed.",
          ],
        },
        {
          type: 'p',
          text: '**Scale:** 3,000+ pilot testers · Multi-platform · 2024',
        },
      ],
    },
  ],
}
