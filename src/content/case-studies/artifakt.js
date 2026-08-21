/**
 * Artifakt case study content.
 *
 * All copy lives here; the components stay content-agnostic and the page just
 * maps over this — the same arrangement as pitchpivot.js, and the same reason
 * (see content.js on why case studies are .js modules rather than MDX).
 *
 * COPY PROVENANCE: every string below was read off the Figma frame
 * (node 4897:4510, `Subpage_artifakt`) on 2026-08-21, after Flore restyled it.
 * That restyle matters and is the reason to re-pull rather than trust an
 * earlier read: the frame originally held raw Markdown pasted into text layers
 * — `- ` and `> ` and `**` rendering as literal characters — and it now holds
 * real bullet lists, real bold and italic runs, and italic asides. The typed
 * block structure in `body` below mirrors that restyle one-to-one.
 *
 * NOT taken from `~/Downloads/artifakt-case-study-narrative.md`, which is the
 * earlier draft. Where the two disagree the frame wins, per CLAUDE.md: this
 * page is not built yet, so Figma is the brief. The differences are real and
 * deliberate — the draft's three `<details>` drawers are gone, its artist grid
 * and stat band are gone, and its hero tagline ("Guided DIY for personal
 * gifting") was rewritten. Don't reconcile them.
 *
 * INLINE MARKERS: `**bold**`, `*italic*` and `[label](href)` are rendered by
 * emphasis.jsx. Block structure — paragraph, list, quote, aside — is the
 * `type` field on each node, rendered by Prose.jsx. A `- ` at the start of a
 * string does nothing; use `{ type: 'list' }`.
 *
 * ASSET PATHS are root-absolute and resolved at render time through
 * `assetUrl()` inside Media.jsx, which prefixes Vite's configured base. A
 * literal `/images/...` would 404 in production under /flore-de-crombrugghe/
 * and work fine in dev, so this cannot be caught by `npm run dev` — see
 * assetUrl.js.
 */

import { ARTIFAKT } from '../../lib/caseStudyLayout'

// The live prototype. From Flore's narrative draft and confirmed by the hero
// button's own label in Figma ("Try it out"), which carries no URL of its own —
// the link is content, and content lives here rather than in the design file.
const LIVE_URL = 'https://floredc.github.io/Artifakt/'

// Directory root for this project's media. One constant so a move is one edit,
// and so every path below is visibly the same shape.
const M = '/images/artifakt'

export default {
  slug: 'artifakt',

  frame: {
    // SPELLED CORRECTLY HERE. The Figma meta line read "UX Rearch", then "UX
    // Rsearch"; Flore fixed it in the file on 2026-08-21. Written out in full
    // so a future re-pull that catches a third variant has something to
    // disagree with visibly.
    //
    // Separator is Figma's " / ". The homepage card
    // (projects/artifakt.mdx) uses " • " for the same three words — the two
    // are NOT wired together and can drift; left as each file has it rather
    // than unified, since neither is obviously the mistake.
    category: 'AI Prompt Engineering / Gen Design / UX Research',
    // Matches the homepage card's `title` in projects/artifakt.mdx, so a
    // reader clicks one promise and lands on the same one. The two files are
    // not wired together — changing this means changing both. Same known
    // fragility as PitchPivot; see the note there.
    title: 'Artifakt — Tracing your way past the blank canvas',
    oneLiner: 'Guided DIY — a trace, an artist, an artifact',
    role: '0→1 designer, from research to final product',
    date: 'Jun 2026',
    liveUrl: LIVE_URL,
    liveLabel: 'Try it out',
    zone: 'Lab',
    subsection: 'Own products',
    // The hero stage is `surface-highlight`, not the graph-paper `bg-notebook`
    // the PitchPivot hero uses. Sampled (node 4897:4515) — a deliberate
    // divergence between the two case studies, flagged to Flore rather than
    // quietly unified.
    stage: 'bg-surface-highlight',
    // Grey border + soft shadow + radius 16, sampled from the phone screenshot
    // in the hero (node 4897:4524). PitchPivot's hero media takes a hard black
    // border instead, which is why this is a prop rather than baked into Frame.
    mediaClassName:
      'mx-auto border border-border-grey rounded-radius-16 shadow-[0_0_12px_0_rgba(0,0,0,0.25)]',
    media: {
      kind: 'image',
      src: `${M}/hero.png`,
      label: '[ hero.png — 545x1185 portrait product screenshot ]',
      // The delivered file's REAL pixel dimensions, read off the asset rather
      // than guessed from the design frame, so the space reserved before load
      // is exactly the space the media takes and there is no layout shift.
      placeholderAspect: '545 / 1185',
      maxWidth: ARTIFAKT.heroMedia,
      alt: 'The Artifakt result screen: a traced figure rendered in Louise Bourgeois’s style, titled “THE JOY”, addressed from Flore to Jo',
    },
  },

  // Every section below is one entry in `body`, rendered in order. The page is
  // a sequence, not a fixed set of named slots — see CaseStudyArtifakt.jsx on
  // why this differs from pitchpivot.js's named keys.
  body: [
    // 1 --------------------------------------------------------------------
    {
      id: 'what',
      title: 'Made by you. Finished by an artist.',
      prose: [
        {
          type: 'p',
          text: 'You type a word, trace a loose scaffold by hand, and your line comes back transformed through the style of a real artist. The AI does the finishing — it never touches the making.',
        },
      ],
      // FULL CONTENT WIDTH, matching Figma's 1282 stage (node 4897:4533).
      //
      // Briefly capped at 888 (3/4 of the column) on 2026-08-21 and reverted
      // the same day — Flore looked at it and preferred the original. Noted
      // rather than silently undone, so nobody re-proposes it: the core-flow
      // banner is the page's establishing image and it reads better filling its
      // stage, even though the final-product panel below does take a smaller
      // artwork on a full-width mount. The two are not inconsistent; they are
      // doing different jobs.
      media: {
        layout: 'full',
        src: `${M}/how-it-works.png`,
        label: '[ how-it-works.png — 2457x820 core flow banner ]',
        placeholderAspect: '2457 / 820',
        alt: 'The core flow across five phone screens: the Joy logo, a traced sketch, five artist style cards, the finished artwork addressed to Jo, and the result shared in a chat',
      },
    },

    // 2 --------------------------------------------------------------------
    {
      id: 'what-it-is',
      title: 'What it is',
      prose: [
        {
          type: 'p',
          text: 'Artifakt is a mobile tool that turns a typed intention into a hand-drawn artwork in the style of a real artist. It’s built to spark creativity rather than stand in for it: every result is unique to the person who traced it, and every result arrives with an artist worth being curious about.',
        },
        {
          type: 'p',
          text: '**Lower the barrier.** A scaffold to trace, so "I can’t draw" doesn’t end the gesture before it starts.',
        },
        {
          type: 'p',
          text: '**Keep it yours.** Style is applied *after* tracing, never during. Your line stays the structure of the final piece — even the loading screen shows your sketch turning, not the artist’s photo.',
        },
        {
          type: 'p',
          text: '**Bring an artist in.** A fixed, curated roster — Louise Bourgeois, Kara Walker, Niki de Saint Phalle, Naoko Takeuchi, Keith Haring. Most people will meet at least one of them here for the first time. It’s also the part that would make this work in a museum: the exhibition already supplies the artist — Artifakt gives visitors something to make with them.',
        },
      ],
    },

    // 3 --------------------------------------------------------------------
    // No title and no prose in Figma — the screencast stands alone, sized 400
    // and pushed to the right edge of the content column (node 4897:4547).
    //
    // The ONLY asset on this page that is not a tinted MediaStage: Figma gives
    // it the site's product-screencast treatment instead (canvas fill, radius
    // 24, caption below the box), the same one PitchPivot's feature videos use.
    // See SCREENCAST_CLASS in CaseStudyArtifakt.jsx.
    {
      id: 'screencast',
      media: {
        layout: 'aside-right',
        // No `maxWidth` here on purpose. Figma's container is 400 wide (node
        // 4897:4548), but this asset is capped by HEIGHT so the figure fits the
        // viewport — Flore, 2026-08-21 — and the width is derived from that.
        // See SCREENCAST_MAX_WIDTH in CaseStudyArtifakt.jsx, which keeps 400 as
        // the ceiling.
        //
        // Because the cap is a viewport-relative expression rather than a
        // number, it belongs to the layout and not to the content: this file
        // should not have to know what `svh` is.
        kind: 'video',
        src: `${M}/artifakt.mp4`,
        poster: `${M}/artifakt-poster.png`,
        label: '[ artifakt.mp4 — portrait UI screencast ]',
        placeholderAspect: '1206 / 2622',
        alt: 'A screen recording of Artifakt: typing an intention, tracing the scaffold, and the finished artwork appearing',
        caption: 'state 21.08.26',
      },
    },

    // 4 --------------------------------------------------------------------
    {
      id: 'question',
      title: 'The question: made by me — but make it good',
      prose: [
        {
          type: 'p',
          text: 'I started with a practical question: how do you help someone make a unique visual for another person, when most people freeze the moment they’re asked to create something themselves? Interviews across ages 28 to 75 sharpened it — people aren’t reluctant, they’re blocked by *what* to make, not *how*.',
        },
        {
          type: 'p',
          text: 'Then an early test contradicted me. I showed people three versions of the same drawing — rough, refined, finished — and asked which felt like it came from someone who cared. The most finished one won, from people who had just told me they valued imperfection in gifts. My stimulus was flawed (only one version had colour), but the contradiction held up in every session afterwards:',
        },
        {
          type: 'p',
          text: '**People want to have made it, and they want it to look good. They don’t want to choose.**',
        },
        {
          type: 'p',
          text: 'That’s why the reveal became my first design focus, ahead of the drawing tool itself — and it turned the project’s question into a narrower one:',
        },
        {
          type: 'aside',
          text: '**When AI helps you make something, at what point does it stop being yours?**',
        },
      ],
    },

    // 5 --------------------------------------------------------------------
    {
      id: 'reveal',
      title: 'The reveal: separating structure from style',
      prose: [
        {
          type: 'p',
          text: 'I built the transformation before the drawing tool. It didn’t work the way I expected.',
        },
        {
          type: 'list',
          items: [
            '**Wanted:** the traced line still legible, the artist’s hand clearly present, enough surprise that it reads as a gift and not a filter.',
            '**Got:** spiders. Ask for Louise Bourgeois and the model draws her most famous motif instead of treating your lines in her manner. Every artist had a version of this — the model reaches for the icon, not the technique.',
            '**Dead ends:** Replicate + ControlNet, dropped after ~$10 of credit. Then Flux Pro Redux — which failed because the sketch was never actually being sent in the request. I judged the output for a full phase before checking the payload.',
            '**Fix 1 — describe the material, not the artist.** Thread, tension, stitched surface, instead of the name. Naming an artist summons their greatest hits.',
            '**Fix 2 — split the pipeline in two.** Pass 1 builds structure and material with no artist named at all. Pass 2 applies the artist and colour. Eight phases of sweeping a single strength value came first: low values gave my sketch back untouched, high values gave a beautiful image that wasn’t mine.',
          ],
        },
        {
          type: 'aside',
          text: '**Lesson:** when the same trade-off appears at every value you test, the problem is structural. Change the shape of the pipeline, not the dial.',
        },
      ],
      link: { label: 'The 14 phases behind this pipeline' },
      // TWO EMBEDS, NOT YET BUILT. Figma draws both as empty dashed
      // placeholders (nodes 4897:4571 / 4897:4577) and Flore confirmed
      // 2026-08-21 that they are iframes or similar, to be done later. They
      // render through the site's existing ImagePlaceholder convention, so the
      // gap is visible and self-documenting on the page rather than an
      // unexplained blank — the same way PitchPivot handled its missing assets.
      // `src` is deliberately absent; that is what triggers the placeholder.
      embeds: [
        { layout: 'full', label: '[ How the pipeline works — embed ]', placeholderAspect: '1282 / 406' },
        {
          layout: 'full',
          label: '[ Two-pass progression strip — embed ]',
          placeholderAspect: '1282 / 406',
        },
      ],
    },

    // 6 --------------------------------------------------------------------
    {
      id: 'scaffold',
      title: 'The scaffold: leaving room to make it yours',
      prose: [
        { type: 'p', text: 'Testing gave me the sharpest question of the project:' },
        {
          type: 'quote',
          text: '"Why do I have to trace something when it’s already there?" — Jules',
        },
        {
          type: 'p',
          text: 'The scaffold was too finished. It had already made every decision, so tracing felt like busywork rather than authorship. All four testers hit this.',
        },
        {
          type: 'list',
          items: [
            '**First instinct — fix it with UX tools.** Softer copy, reworded instruction, looser prompt. I tried art-school language: *think in volumes first*. The model has no idea what that means.',
            '**Expensive detour:** generating the scaffold by running img2img over an SVG motif. Largest single chunk of credit in the project, and it produced a *more* finished illustration.',
            '**The reframe:** "make this less detailed" is a subtraction problem, not a generation problem. Image-to-image transforms style; it doesn’t remove structure.',
            '**The fix, in code not prompts:** generate a normal sketch, then subtract — grayscale → blur → Canny → flood-fill → keep only the outer contours. Prototyped in Python, ported to browser Canvas so it runs on static hosting with no backend.',
            '**Still open:** the flood-fill assumes a closed contour. Give it a bicycle and it fills the canvas black.',
          ],
        },
        {
          type: 'p',
          text: 'Once the scaffold gave people less, tracing started to feel like a decision. The wording mattered too: "trace the image" implied accuracy, and testers asked whether they had to follow it. Softening the instruction changed behaviour more than the interface did.',
        },
        {
          type: 'aside',
          text: '**Lesson:** when a UX complaint won’t resolve with UX tools, look upstream. This one was a generation problem wearing an interaction problem’s clothes.',
        },
      ],
      link: { label: 'The contour-reduction experiments' },
      // FULL WIDTH, a deliberate override of the frame — Flore, 2026-08-21
      // ("the scaffold image should be bigger"). Figma draws this stage at 720
      // (node 4897:4590), matching the text above it, and at that size the
      // contour-reduction sheet inside it — eight horse sketches with labels —
      // rendered too small to read, which defeats the point of showing it.
      // `full` takes it to the 1184 content column like the other evidence
      // stages on the page.
      media: {
        layout: 'full',
        src: `${M}/the-scaffold.png`,
        label: '[ the-scaffold.png — 1334x753 scaffold + contour experiments ]',
        placeholderAspect: '1334 / 753',
        alt: 'The Artifakt scaffold screen beside a sheet of contour-reduction experiments showing a horse sketch reduced to progressively simpler outlines',
      },
    },

    // 7 --------------------------------------------------------------------
    {
      id: 'defaults',
      title: 'Designing against the model’s defaults',
      prose: [
        {
          type: 'p',
          text: 'Type "swimmer" and Flux gives you a white man. Ask Naoko Takeuchi for a character and you get a blonde, blue-eyed one regardless of the keyword. The defaults are thin, white and European, and they hold until you actively displace them.',
        },
        {
          type: 'list',
          items: [
            '**Doesn’t work:** negation. "Not white" or "diverse" collapses straight back to the average.',
            '**Works:** explicit attribute language — skin tone, hair, body type — plus foreground anchoring and a rotating subject pool so one default can’t dominate.',
          ],
        },
        {
          type: 'p',
          text: 'The harder part wasn’t technical. More than once the model suggested a better-known reference — Picasso came up repeatedly — because it would generate more reliably and save me hours. It was right about that. But if the roster collapses to whoever the model already knows best, the product argues the opposite of what it exists to do.',
        },
        {
          type: 'aside',
          text: '**Honest note:** I built this as a remediation pass after noticing skewed output, not as a first-draft requirement. Given that representation is a stated value here, it should have been in the first prompt I wrote, not the twentieth.',
        },
      ],
      link: { label: 'The per-artist prompt table' },
      media: {
        layout: 'beside',
        src: `${M}/against-the-defaults.png`,
        label: '[ against-the-defaults.png — 694x910 generated-figure comparison ]',
        placeholderAspect: '694 / 910',
        alt: 'Two generated figures showing the model’s default output: a pale swimmer sketch and a muscular light-skinned male figure',
        caption: 'Representation biases',
      },
    },

    // 8 --------------------------------------------------------------------
    {
      id: 'testing',
      title: 'Hesitation, then delight',
      prose: [
        { type: 'p', text: 'Four moderated in-person sessions.' },
        {
          type: 'p',
          text: '**Every single person hesitated before tracing. Every single person lit up at the result.** Four out of four said they’d send it — and every one of them wanted to immediately make another.',
        },
        {
          type: 'p',
          text: 'That gap is the finding. People don’t understand why they’re drawing until they see what it becomes, so the product front-loads uncertainty and back-loads the payoff. A consistently good ending doesn’t validate the path to it.',
        },
        {
          type: 'p',
          text: 'It also answered the question I started with. Ownership turned out to be partial: testers said *it’s my idea* but not *my drawing*. For a scaffold model, that’s the honest ceiling — and it was enough to make them want to send it.',
        },
        {
          type: 'p',
          text: 'The testing also killed something. The onboarding animation confused three testers in a row, so I removed it rather than redesigning it a fourth time.',
        },
        {
          type: 'p',
          text: 'Still unresolved: the artist bio — the most culturally meaningful moment in the product — was the least discovered thing in it. And erase clears everything, where testers expected stroke-by-stroke undo.',
        },
        {
          type: 'p',
          text: '**Next test:** promise the reveal before the trace, and see whether the hesitation drops.',
        },
      ],
      media: {
        layout: 'beside',
        src: `${M}/user-testing.png`,
        label: '[ user-testing.png — 923x584 test session photos ]',
        placeholderAspect: '923 / 584',
        alt: 'Two photographs from a moderated session: a tester tracing on a phone held in one hand',
        caption: 'User testing session',
      },
    },

    // 9 --------------------------------------------------------------------
    {
      id: 'reflection',
      title: 'What this changed about how I work',
      prose: [
        {
          type: 'p',
          text: 'Everything that moved this project forward came from changing the question rather than the setting. Two passes instead of a better strength value. Subtraction instead of a better prompt. Each time I got there after two or three rounds of tuning that felt productive and weren’t.',
        },
        {
          type: 'p',
          text: 'AI output arrives looking finished, which makes it easy to accept as a given and tune around the edges. The design work is in refusing that — knowing what the model is actually doing, and noticing where its convenience is quietly making a decision that should have been yours.',
        },
      ],
    },

    // 10 -------------------------------------------------------------------
    {
      id: 'how-i-worked',
      title: 'How I worked',
      prose: [
        {
          type: 'p',
          text: 'Four weeks, solo, built during cohort 6 of Patricia Reiners’ AI for Designers. Same timeline as PitchPivot, considerably heavier underneath — most of those hours went into the image pipeline, not the interface.',
        },
        {
          // "5 in-person test sessions", NOT Figma's literal "5 moderated
          // in-person test sessions". The frame contradicted itself: this line
          // said five *moderated* sessions while the Testing section says
          // "Four moderated in-person sessions" and "All four testers hit
          // this". Flore adjudicated on 2026-08-21 — it is five sessions, four
          // moderated plus one informal — so the word "moderated" is what was
          // wrong here, not either number. Both sections are now true as
          // written and neither number had to move.
          type: 'p',
          text: '4 weeks end to end. 14 documented prompting phases. 6 process logs kept during the build. 5 artists, after two were cut for technical reasons. 5 in-person test sessions.',
        },
        {
          type: 'p',
          text: 'Single index.html, no backend, static hosting. Image generation via [fal.ai](https://fal.ai) / Flux. Built in Claude Code.',
        },
      ],
      // MAPPED BY CONTENT, NOT BY FILENAME — and two of the six do not agree.
      // Each thumbnail was opened and read before being placed here, because
      // the delivered names cross over: `card-final-product.png` is a page of
      // loading-state and animation-sequence specs, and
      // `card-loading-animations.png` is the "one shell, five faces" page of
      // final-screen design decisions. So the two files are swapped relative
      // to their names.
      //
      // The Figma labels are the source of truth for the ORDER and the WORDING
      // (nodes 4897:4631-4637); the files are matched to them by what is
      // actually pictured. Flagged to Flore — if the intended pairing is the
      // other way round for these two, it is a one-line swap here.
      //
      // `href` is deliberately absent on all six: the logs need somewhere to
      // live first (Flore, 2026-08-21). ProcessLogCards renders an unlinked
      // card when there is no href, rather than a dead anchor.
      logs: [
        {
          title: 'Reveal & AI integration',
          src: `${M}/card-reveal.png`,
          label: '[ card-reveal.png ]',
          alt: 'First page of the “Reveal — AI Integration Visual Process” log',
        },
        {
          title: 'Prompting process',
          src: `${M}/card-two-pipeline.png`,
          label: '[ card-two-pipeline.png ]',
          alt: 'First page of the “Image Generation & Prompting Process” log, showing the two-pass pipeline diagram',
        },
        {
          title: 'Visual system',
          src: `${M}/card-visual-system.png`,
          label: '[ card-visual-system.png ]',
          alt: 'A page of design tokens, type scale and icon decisions',
        },
        {
          title: 'Loading animations',
          src: `${M}/card-final-product.png`,
          label: '[ card-final-product.png ]',
          alt: 'Loading-state screen specs and a five-step animation sequence',
        },
        {
          title: 'Scaffold process',
          src: `${M}/card-scaffold.png`,
          label: '[ card-scaffold.png ]',
          alt: 'Experiment 006, contour reduction variants of a horse sketch',
        },
        {
          title: 'Final screen redesign',
          src: `${M}/card-loading-animations.png`,
          label: '[ card-loading-animations.png ]',
          alt: 'The “one shell, five faces” page showing the five artist portraits and copy decisions',
        },
      ],
    },

    // 11 -------------------------------------------------------------------
    // The closing gallery. Figma composes four separate phone screenshots
    // (node 4897:4641); Flore delivered them as one composite, so this is a
    // single asset in a radius-60 panel rather than a four-up grid.
    {
      id: 'final-product',
      media: {
        layout: 'showcase',
        // Smaller than the panel that holds it — Flore, 2026-08-21 ("the final
        // product image should be a bit smaller"). The radius-60 panel still
        // spans the full content column; only the artwork inside it shrinks, so
        // the tinted surround reads as a mount rather than a thin border.
        // MediaStage centres it (`items-center`), so the margin is even.
        maxWidth: 880,
        src: `${M}/final-product.png`,
        label: '[ final-product.png — 2432x1282 four-screen gallery ]',
        placeholderAspect: '2432 / 1282',
        alt: 'Four Artifakt screens side by side: the traced scaffold, the artist picker, the finished artwork, and the share view',
        caption: 'Final product',
      },
    },
  ],

  // The page's exit. ADDED 2026-08-21 at Flore's request — the Figma frame
  // goes straight from the gallery to the contact block, with no next-project
  // card. Her call is that the card should be there and should point at
  // Welcome to my city, so this diverges from the frame deliberately.
  //
  // The slug is looked up against the real project list at render time, so the
  // card is the same object the homepage renders and can't drift from it.
  onward: {
    heading: 'Next project',
    slug: 'welcome-to-my-city',
  },

  // Sampled from the frame's own Contact Section (node 4897:4650). Note this
  // is NOT the homepage's contact copy — the homepage says "Say Hi!" and
  // describes where Flore is based; the case-study version is scoped to this
  // page ("Feedback or comments?"). Both are real and neither is a copy of the
  // other, so this lives here rather than reading contact.mdx.
  //
  // The email and LinkedIn URL DO come from contact.mdx, wired in
  // CaseStudyArtifakt.jsx — those are facts about Flore, not about this page,
  // and duplicating them here is how one of them goes stale.
  contact: {
    heading: 'Feedback or comments?',
    description: 'Always happy to connect, whether remotely or in person.',
  },
}
