/**
 * Roche Icon System — the third and last PROJECT SNAPSHOT, sharing
 * CaseStudySnapshot with Teamchatviz and Sinomocene (see the Teamchatviz file's
 * header for what the tier is and the register it has to keep).
 *
 * COPY PROVENANCE: read off the Figma frame (node 4962:6957).
 *
 * WHERE THIS PAGE DIVERGES FROM THE OTHER TWO, all from the frame:
 *
 *   1. A THIRD hero stage colour — `Colors/surface/canvas`, the pale blue
 *      (node 4962:6963). Teamchatviz is grey, Sinomocene near-black.
 *   2. A LIGHT stage with a SECONDARY button (node 4962:6974). That pairing is
 *      what forced `tone` and `buttonVariant` apart in Frame.jsx — they had
 *      been one prop on the assumption they always co-vary.
 *   3. The hero media takes radius 16, where Sinomocene's takes 12.
 *   4. Body images take radius 16 where the other two snapshots take 12 —
 *      Flore added the framing on 2026-08-26. Driven by `viewChrome` below.
 *   5. ONE credit line rather than three, so `facts` has a single entry.
 *
 * Structurally it matches Sinomocene: no What title (node 4962:6979 hidden),
 * one titled full-width row, then two untitled pairs (4962:6997, 4962:7012
 * both hidden).
 */

const M = '/images/roche'

// Every icon plate is 2000x1422 — measured off the delivered files, not read
// off the frame, which declares 1586/990 for the paired slots and would reserve
// the wrong box.
const PLATE_ASPECT = 2000 / 1422

export default {
  slug: 'roche',

  frame: {
    category: 'Iconography • Information design',
    title: 'Roche Icon System, a construction kit for complex science.',
    // A single line here, unlike the other two snapshots. Note it opens
    // "Editorial design" where `category` above says "Iconography •
    // Information design" — both are Flore's, from the same frame, and they
    // are describing different things (the discipline of the work vs. the
    // credit for it), so neither is corrected to match the other.
    facts: ['Editorial design · Superdot Studio for Roche · 2018'],
    // Superdot's own project page for the system — Flore, 2026-08-26. The frame
    // draws this as a secondary button with an external-link arrow
    // (node 4962:6974) but carried no URL; this is the destination she gave.
    liveUrl: 'https://www.superdot.studio/project/branding-icon-system',
    liveLabel: 'Roche icons',
    buttonVariant: 'secondary',
    stage: 'bg-surface-canvas',
    tone: 'light',
    zone: 'Harbour',
    subsection: 'Feature cases',

    // THE HERO REUSES A BODY PLATE — `hero.webp` is byte-identical to
    // `Roche-icons-gut-brain.webp` (verified by SHA-256), so the gut and brain
    // icons open the page and appear again in the first pair below. Same
    // pattern as the Sinomocene hero; flagged, not silently resolved.
    //
    // Kept as its own file rather than pointed at the other path, so a distinct
    // hero export later is a one-line change here.
    media: {
      kind: 'image',
      src: `${M}/hero.webp`,
      alt: 'The Roche gut and brain icons, drawn in the system\'s two-colour line style.',
      label: '[ hero.webp — 2000x1422 ]',
      placeholderAspect: 2000 / 1422,
      maxWidth: 600,
    },
    // Radius 16 (node 4962:6973), not Sinomocene's 12, plus the grey hairline
    // every snapshot image now carries.
    mediaClassName: 'border border-border-grey',
    mediaRadius: 'rounded-radius-16',
  },

  what: {
    title: null,
    // 72 either side of a 525-wide frame (node 4962:6983), matching Sinomocene.
    mediaInset: '13.71%',
    body: [
      "**An icon system for people who aren't designers.**",
      "Roche employees needed to explain scientifically complex topics — visually, quickly, and without breaking brand guidelines. Buying stock icons broke the brand. Commissioning new ones every time didn't scale. Neither option survives contact with someone building a deck the night before.",
      "So the deliverable was **a construction logic rather than a library**: **a modular, layered grammar where parts combine into terms that didn't exist when the system was drawn**. Combined further, they build whole infographics.",
      "It has since **grown past 350 icons, extended and maintained by the employees themselves**. **A system's real test is the icon someone else draws two years later.**",
    ],
    // SAME FILE AS THE LAST ITEM ON THE PAGE. The frame fills both this slot
    // and the closing "Working sketches" slot with the same scan, so the
    // drawings appear twice — flagged to Flore 2026-08-26 rather than resolved
    // here, along with the fact that `P163_07_20180607_Arbeistsscanns_01-2.webp`
    // is delivered but placed nowhere. It is a portrait scan of the same working
    // sheets and is the obvious candidate for one of the two slots.
    media: {
      kind: 'image',
      src: `${M}/Roche-icons-drawings.webp`,
      alt: 'Two sheets of hand-drawn working sketches, showing icon forms being tried out and annotated in pen.',
      label: '[ Roche-icons-drawings.webp — 2000x1422 ]',
      placeholderAspect: PLATE_ASPECT,
      // Radius 16 + grey hairline (node 4962:6984).
      radius: 'rounded-radius-16',
      className: 'border border-border-grey',
    },
  },

  // ADDED BY FLORE 2026-08-26, replacing the bare treatment this page shipped
  // with a few hours earlier. Radius 16, not the 12 the other two snapshots
  // use — read off nodes 4962:7001 / 4962:7007 / 4962:6991 rather than assumed
  // to match them.
  //
  // The shadow this originally carried is gone — see FRAME_CHROME in
  // CaseStudySnapshot.jsx. Radius 16 stays, and is still deliberately unlike
  // the other two snapshots' 12.
  viewChrome: { radius: 'rounded-radius-16', border: true },

  views: [
    {
      title: 'A system for 350+ icons',
      items: [
        {
          src: `${M}/Roche-icons-overview.webp`,
          alt: 'A grid of more than fifty finished icons — organs, lab equipment, trial states and disease areas — all drawn in the same two-colour line style.',
          caption: 'The system today. Over 350 icons, most drawn after we left.',
        },
      ],
    },
    {
      items: [
        {
          src: `${M}/Roche-icons-gut-brain.webp`,
          alt: 'The gut and brain icons side by side, showing the shared line weight and construction.',
          caption: 'Base forms. One organ, one construction, reused everywhere.',
        },
        {
          src: `${M}/Roche-icons-heart-breast.webp`,
          alt: 'The heart and breast icons side by side, built from the same parts as the other organs.',
          // DUPLICATE OF THE CAPTION TO ITS LEFT, exactly as the frame has it
          // (nodes 4962:7004 and 4962:7010 carry identical text). Carried over
          // rather than invented around, and flagged to Flore — the same class
          // of slip as the Teamchatviz row-one caption she fixed on 2026-08-26.
          caption: 'Base forms. One organ, one construction, reused everywhere.',
        },
      ],
    },
    {
      items: [
        {
          src: `${M}/Roche-icons-eligibility-criteria.webp`,
          alt: 'Two composed icons reading "Eligibility criteria: age" and "Eligibility criteria: gender", each built by combining a person icon with a second mark.',
          caption: 'Composition. Icons combine into terms nobody specified in advance.',
        },
        {
          src: `${M}/Roche-icons-drawings.webp`,
          alt: 'Two sheets of hand-drawn working sketches, showing icon forms being tried out and annotated in pen.',
          caption: 'Working sketches. The rules were argued out on paper first.',
        },
      ],
    },
  ],

  viewAspect: PLATE_ASPECT,

  onward: {
    heading: 'Next',
    // Closes the snapshot loop: sinomocene 1 -> teamchatviz 2 -> roche 3 ->
    // back to the first.
    slug: 'sinomocene',
    contact: {
      prompt: 'Curious about how this was built, or want to talk about something similar?',
      cta: 'Say hi',
    },
  },
}
