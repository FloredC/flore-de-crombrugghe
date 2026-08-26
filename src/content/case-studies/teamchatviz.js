/**
 * Teamchatviz — the first of the three PROJECT SNAPSHOTS.
 *
 * A snapshot is a third content tier, below the full case studies (PitchPivot,
 * Artifakt) and deliberately lighter. Flore's own definition, from the Notion
 * brief that produced this copy:
 *
 *   "Snapshots are DESCRIPTIVE, not reflective. State what it is, what was
 *    formally difficult, what it deliberately doesn't do. No 'the turning point
 *    was' — that register belongs to the three real case studies, and reserving
 *    it is what makes the tiering legible."
 *
 * That is a constraint on future edits, not just a description of today's copy.
 * If this page ever grows a Turning Point, a stat grid or a learnings section,
 * the tier has collapsed and the two case studies above it lose their meaning.
 *
 * COPY PROVENANCE: read off the Figma frame (node 4939:5039), which is the
 * authority here rather than the Notion brief. The two disagree in two places
 * and Figma won both, per CLAUDE.md's "Figma leads before a thing is built":
 *
 *   - the six views are PAIRED in a different order than Notion lists them
 *     (Notion: Heartbeat, People Land, Channel Land, Frequent Speakers,
 *     Messages, Emoji). The pairing is a layout decision, so the frame owns it.
 *   - the frame adds a section title, "Slack Stats Visualised", which the brief
 *     has no equivalent for.
 *
 * ASSET PATHS point at `public/images/teamchatviz/`, renamed 2026-08-26 from
 * the delivered filenames, which carried old build hashes
 * (`01-channel-heartbeat-teamchatviz-screenshot.DMGJsYH5_ZWR9Of.webp`). The
 * numeric prefixes went with them: they encoded the brief's order, which is not
 * the order this page renders, so keeping them would have been a second,
 * contradicting source of truth for sequence.
 *
 * Paths are root-absolute and resolved through `assetUrl()` in Media.jsx — see
 * the note there about why a literal `/images/...` would 404 in production.
 */

const M = '/images/teamchatviz'

// Every one of the six view screenshots is exactly 1586x990. Measured off the
// delivered files, not read off the frame — the same discipline the PitchPivot
// content file records, and for the same reason: a ratio guessed from the
// design is a layout shift on load.
const VIEW_ASPECT = 1586 / 990

export default {
  slug: 'teamchatviz',

  frame: {
    // Matches the homepage card's `meta` in projects/teamchatviz.mdx, as of
    // Flore's 2026-08-26 edit — the frame previously read "Data viz / Tool".
    // The two files are NOT wired together (see the note in pitchpivot.js), so
    // this pair has to be changed in both places and can drift again silently.
    category: 'Dataviz • Product design',
    // DELIBERATELY UNLIKE THE CARD TITLE, which is just "Teamchatviz". The card
    // names the product; the page opens with the claim. Flore's frame, kept.
    title: '#teamchatviz, reading a team by its chat',
    // No `oneLiner`: the snapshot hero goes straight from title to credits, and
    // the brief's framing line ("Six ways of reading a year of team chat.")
    // opens the What section instead, where the frame puts it.
    facts: [
      'Concept & visual design — moovel lab, 2016',
      'With Benedikt Groß and Oleksii Rudenko',
      'Fast Company Design · PAGE Online',
    ],
    liveUrl: 'https://github.com/move-lab/teamchatviz',
    liveLabel: 'Github Teamchatviz',
    // `Colors/Surface/grey`, the token Flore added on 2026-08-26 specifically
    // for this stage. Not the case studies' `bg-notebook` graph paper and not
    // Artifakt's yellow — the snapshot tier reads as its own surface.
    stage: 'bg-surface-grey',
    zone: 'Harbour',
    subsection: 'Feature cases',
    // ONE FLATTENED ASSET: the browser chrome is part of the export rather than
    // drawn here.
    //
    // CORRECTED 2026-08-26. This used to claim the export also carried a baked
    // drop shadow, and that a radius here would clip it. Measured, that is
    // false: the file is 99.7% fully opaque with 0% fully-transparent pixels,
    // so there is no soft surround at all — the 0.2% partial alpha is corner
    // anti-aliasing. The claim came from the FIRST hero export (the one with
    // the Slack badge, which did have a shadow blob) and was never rechecked
    // when Flore replaced it.
    //
    // So the frame is drawn here after all: radius 12 and the grey hairline,
    // matching node 4940:5428.
    //
    // THE SLACK BADGE IS GONE, 2026-08-26. The first export composited a white
    // circle holding the Slack mark over the screenshot's top-right corner;
    // Flore removed it in Figma (the `Image mask container` under node
    // 4940:5572 no longer exists) and re-exported. It was covering the app's
    // own hamburger control, so the window now reads as a real screenshot
    // rather than a decorated one.
    //
    // The replacement is a different SHAPE, not just different content —
    // 1362x916 (ratio 1.487) became 1289x805 (ratio 1.601) — which is why
    // `placeholderAspect` below moved with it. Getting that wrong is a layout
    // shift on load, not a cosmetic slip.
    media: {
      kind: 'image',
      src: `${M}/hero.webp`,
      alt: 'The People Land view of teamchatviz, open in a browser, showing team members clustered into coloured groups by shared channel membership.',
      label: '[ hero.webp — 1289x805 ]',
      placeholderAspect: 1289 / 805,
      maxWidth: 600,
    },
    mediaClassName: 'border border-border-grey',
    mediaRadius: 'rounded-radius-12',
  },

  what: {
    title: 'Slack Stats Visualised',
    // 64 of padding either side of a 525-wide frame (node 4957:6776).
    mediaInset: '12.19%',
    body: [
      '**Six ways of reading a year of team chat.**',
      "**Slack is where a company's culture actually happens**, and it's almost entirely unreadable — a year of it is just scroll. Connect the tool to a workspace and it builds **six views of every public channel automatically**. New joiners get an overview that would otherwise take months to absorb. People who've been there for years find out what's been going on two channels over.",
      'The hard part was formal. Six visualization types with **genuinely different grammars** — network clusters, time series, rankings — that **still had to read as one product**, for someone who had never looked at a cluster analysis before.',
      "The tool doesn't tell you what your team is like. **It shows you the shape and leaves the reading to you.**",
    ],
    media: {
      kind: 'image',
      src: `${M}/icons.webp`,
      alt: 'The six teamchatviz view icons, each a small circular line drawing of its visualization type.',
      label: '[ icons.webp — 2000x1501 ]',
      placeholderAspect: 2000 / 1501,
      // No frame at all — node 4940:6513 carries neither a corner radius nor an
      // effect, unlike the other two snapshots' What images. Set explicitly
      // because Media's own default is radius 24, which would clip this
      // transparent PNG's corners for no reason.
      radius: 'rounded-none',
    },
  },

  /**
   * THE SIX VIEWS, in three titled pairs.
   *
   * The pairing is the frame's, and the titles are joins ("Channel Heartbeat &
   * People Land") rather than headings over a group — so each row's title reads
   * left-to-right onto the two images beneath it. That means ORDER IS
   * load-bearing here in a way it usually isn't: swapping the two items in a
   * pair silently makes the title describe them backwards.
   *
   * This exact mistake was already caught once in the design: row one's second
   * caption was Channel Land's text under the People Land image (Flore fixed it
   * on 2026-08-26). Worth a glance whenever this array is edited.
   */
  views: [
    {
      title: 'Channel Heartbeat & People Land',
      items: [
        {
          src: `${M}/channel-heartbeat.webp`,
          alt: 'The Channel Heartbeat view: a dense time series of channel activity across a year, with peaks highlighted.',
          caption: 'Activity over time. Where the peaks were, and what caused them.',
        },
        {
          src: `${M}/people-land.webp`,
          alt: 'The People Land view: team member avatars scattered and enclosed in coloured polygons grouping those who share channels.',
          caption:
            'Team members clustered by what they have in common, starting with shared channels. The clusters only mean something once you make sense of them.',
        },
      ],
    },
    {
      title: 'Channel Land & Messages and Reactions',
      items: [
        {
          src: `${M}/channel-land.webp`,
          alt: 'The Channel Land view: channels plotted as a cluster map, grouped by the members they share.',
          caption:
            'The same analysis turned around: channels grouped by shared members. How teams actually align, rather than how the org chart says they do.',
        },
        {
          src: `${M}/messages-and-reactions.webp`,
          alt: 'The Messages and Reactions view: a ranked list of messages with their reaction counts.',
          caption:
            'The messages that got the most response. Birthdays, releases, the things you missed.',
        },
      ],
    },
    {
      title: 'Emoji Timeline & Frequent Speakers',
      items: [
        {
          src: `${M}/emoji-timeline.webp`,
          alt: 'The Emoji Timeline view: every emoji posted over a year, plotted as small marks along a time axis.',
          caption: 'Every emoji posted, over time. A rough proxy for mood, treated as one.',
        },
        {
          src: `${M}/frequent-speakers.webp`,
          alt: 'The Frequent Speakers view: a grid of coloured blocks sized by how much each person contributed to a channel.',
          caption: 'Who carries a channel, filtered by time. Contribution, not seniority.',
        },
      ],
    },
  ],

  // Applies to all six. One constant rather than a `placeholderAspect` on each
  // item, since they are genuinely one export at one size — six copies of the
  // same number would only create six chances to mistype it.
  viewAspect: VIEW_ASPECT,

  // The shared `Onward` block, same as PitchPivot — Flore's "add same structure
  // as on other projects", 2026-08-26.
  //
  // PitchPivot's shape rather than Artifakt's, which builds its own richer
  // contact section inline (heading, description, LinkedIn button, email copy
  // button). The lighter of the two suits the tier, and it is a shared
  // component rather than page-bespoke markup, so this page inherits fixes to
  // it. Flagged as a choice, since "same as other projects" was true of both.
  onward: {
    heading: 'Next',
    // The next snapshot by `order` in the project frontmatter
    // (sinomocene 1, teamchatviz 2, roche 3), so the three chain in sequence
    // rather than pointing back into the case studies.
    slug: 'roche',
    contact: {
      prompt: 'Curious about how this was built, or want to talk about something similar?',
      cta: 'Say hi',
    },
  },
}
