/**
 * Sinomocene — the second PROJECT SNAPSHOT, sharing CaseStudySnapshot with
 * Teamchatviz (see that file's header for what the tier is and the register it
 * has to keep).
 *
 * COPY PROVENANCE: read off the Figma frame (node 4940:6607). Where the frame
 * and the Notion brief differ, the frame wins per CLAUDE.md's "Figma leads
 * before a thing is built" — and here it genuinely adds something. The frame
 * carries a paragraph the brief does not:
 *
 *   "So each country is drawn as a shape cut from the initiative's own name.
 *    一带一路 — 'One Belt, One Road' — dissected tangram-style, one piece per
 *    indicator, sized to the scale of Chinese presence."
 *
 * That is the paragraph that explains what the reader is actually looking at in
 * the four stills below, so it is not an optional flourish. Kept verbatim,
 * Chinese characters included.
 *
 * WHERE THIS PAGE DIVERGES FROM TEAMCHATVIZ, all four from the frame:
 *
 *   1. The hero stage is DARK (`Colors/surface/inverted`, node 4940:6613) with
 *      inverted text and a white secondary button, where Teamchatviz is a pale
 *      grey stage with a filled dark button. Driven by `tone` below.
 *   2. The What section has NO title — the title layer is hidden in the frame
 *      (node 4940:6703).
 *   3. The first row is a SINGLE full-width item (the video), not a pair.
 *   4. The last two rows have no titles (nodes 4940:6724, 4940:6739, both
 *      hidden), so only "How it works" is titled.
 */

const M = '/images/sinomocene'

// All four stills are 2000x1225 after the 2026-08-26 optimisation pass —
// measured off the delivered files, not read off the frame, so the box reserved
// before load is the box the image takes and nothing shifts.
const STILL_ASPECT = 2000 / 1225

export default {
  slug: 'sinomocene',

  frame: {
    category: 'Data visualization • Editorial',
    title: "Sinomocene, China's reach in nine datasets",
    facts: [
      'Data visualization — Interactive Things for Davide Monteleone, 2019–2020',
      'With Peter Gassner',
      "Prix Pictet · National Geographic · Rencontres d'Arles",
    ],
    liveUrl: 'https://davidemonteleone.com/sinomocene',
    // The frame labels this button with the project name alone, not a verb —
    // it goes to Monteleone's own site, so the label names the destination.
    liveLabel: 'Sinomocene',
    stage: 'bg-surface-inverted',
    tone: 'dark',
    // Explicit since 2026-08-26: `tone` used to imply this, until Roche turned
    // up with a light stage and a secondary button.
    buttonVariant: 'secondary',
    zone: 'Harbour',
    subsection: 'Feature cases',

    // THE HERO IS THE SAME FILE AS THE FIRST STILL BELOW — `hero.webp` is
    // byte-identical to `chinese-worldide-footprint.webp` (verified by SHA-256,
    // not by filename), so the Belt-and-Road network diagram appears twice on
    // this page: once as the hero, once in the first pair captioned "Chinese
    // worldwide economic, sociocultural, political, and technological
    // footprint".
    //
    // Kept as a separate file rather than pointed at the other path. If Flore
    // later exports a distinct hero, it drops in here with no reference change;
    // aliasing them now would make that a two-file edit and would also assert
    // the duplication is intentional, which is exactly what is still open.
    //
    // Flagged 2026-08-26, not silently resolved.
    media: {
      kind: 'image',
      src: `${M}/hero.webp`,
      alt: 'The Sinomocene interface showing the Belt and Road network as a radial diagram, with flows out of China annotated by category.',
      label: '[ hero.webp — 2000x1225 ]',
      placeholderAspect: 2000 / 1225,
      maxWidth: 600,
    },
    // Radius 12 with a grey hairline border (node 4940:6623), where Teamchatviz
    // carries its chrome baked into the export. Different because this artwork
    // is a flat screenshot rather than a composited browser window.
    mediaClassName: 'border border-border-grey',
    mediaRadius: 'rounded-radius-12',
  },

  what: {
    // No title — see divergence 2 in the header.
    title: null,
    // 72 of padding either side of a 525-wide frame (node 4957:6770), against
    // Teamchatviz's 64. Flore's own values; not normalised to one number,
    // because the two artworks are different shapes and the inset is doing
    // different work in each.
    mediaInset: '13.71%',
    body: [
      '**Nine incompatible datasets, one photographic argument.**',
      "Davide Monteleone spent seven years documenting China's Belt and Road Initiative. The data behind it came from nine sources that don't share a unit: infrastructure finance, diplomatic missions, Confucius Institutes, trade flows, tourism, corruption indices. **Chinese influence isn't measurable in one currency**, which is precisely the point — and precisely what makes it hard to draw.",
      'So each country is drawn as **a shape cut from the initiative’s own name**. 一带一路 — "One Belt, One Road" — dissected tangram-style, one piece per indicator, sized to the scale of Chinese presence. **Measures that can’t be added together sit side by side in a single form**.',
      'It runs alongside large-format documentary photography and satellite analysis, in books and exhibitions where people are standing up.',
      "**The photography makes the argument. The data had to be the part you couldn't dismiss.**",
    ],
    media: {
      kind: 'image',
      src: `${M}/legend-white.webp`,
      alt: 'The Sinomocene legend: a key showing the nine indicator categories, each with its own tangram piece, and how piece size maps to the scale of Chinese presence in a country.',
      label: '[ legend-white.webp — 1336x1890 ]',
      placeholderAspect: 1336 / 1890,
      // BORDER, NO RADIUS — node 4957:6772 carries the grey hairline and no
      // corner rounding. It is the one framed image in the tier with square
      // corners, which is Flore's, not an oversight.
      radius: 'rounded-none',
      className: 'border border-border-grey',
    },
  },

  views: [
    {
      title: 'How it works',
      items: [
        {
          kind: 'video',
          // https://vimeo.com/600885161 — the id alone rather than the share
          // URL, since the embed needs player.vimeo.com and building that from
          // a pasted watch URL at render time is how the wrong host ends up in
          // an iframe.
          videoId: '600885161',
          title: 'Sinomocene Data',
          // RESOLVED 2026-08-26. The frame's caption described the whole piece
          // as if it were the embed: "a 42-minute two-channel video". The Vimeo
          // runs 5:02 (302s, per its oEmbed endpoint), so a reader who pressed
          // play met something 8x shorter than promised.
          //
          // Flore's call was to mark it as a snippet rather than change the
          // number, so the 42 minutes stays -- it is a true fact about the work,
          // and dropping it would lose the scale of the piece. Only the
          // relationship between the two is now stated.
          caption:
            'Data Sinomocene, 2020 — an excerpt from the 42-minute two-channel video tracing money flow from China and the resulting footprint in each country.',
        },
      ],
    },
    {
      // Untitled in the frame.
      items: [
        {
          src: `${M}/chinese-worldide-footprint.webp`,
          alt: 'A dark screen showing the Belt and Road network as a radial diagram, with flows out of China annotated by category.',
          caption:
            'Chinese worldwide economic, sociocultural, political, and technological footprint, 2010-2017',
        },
        {
          src: `${M}/chinese-influence-landscapes.webp`,
          alt: 'A dark screen showing a dense grid of satellite and documentary photographs of sites across the initiative.',
          caption: 'Chinese geographical footprint.',
        },
      ],
    },
    {
      items: [
        {
          src: `${M}/least-economical-presence.webp`,
          alt: 'A dark screen ranking countries by Chinese economic presence within their region, each drawn as a tangram shape.',
          caption:
            'Countries with the most or least Chinese economic presence in a region, 2010-2017 aggregate.',
        },
        {
          src: `${M}/most-chinese-presence.webp`,
          alt: 'A dark screen showing the countries with the greatest overall Chinese presence, each drawn as a tangram shape.',
          caption: 'Countries featuring the most Chinese presence, 2010-2017 aggregate.',
        },
      ],
    },
  ],

  viewAspect: STILL_ASPECT,

  onward: {
    heading: 'Next',
    // The snapshots chain in `order` (sinomocene 1, teamchatviz 2, roche 3).
    slug: 'teamchatviz',
    contact: {
      prompt: 'Curious about how this was built, or want to talk about something similar?',
      cta: 'Say hi',
    },
  },
}
