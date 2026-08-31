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
 * RE-PULLED 2026-08-31, after Flore's tightening pass on the frame. Six of the
 * ten body sections changed. The shape of the edit is the same everywhere:
 * sentences compressed, lead-ins pulled out of their bullets and promoted to
 * bold headings over lists, and one aside un-italicised into a bold paragraph.
 * Two of the three sections that did NOT change are the establishing ones
 * ("Made by you", "What it is"); the third is this section's own reflection,
 * which gained a picture instead.
 *
 * WHERE THIS FILE STILL DIVERGES FROM THE FRAME, each flagged at its own line:
 * British spelling (the frame now has "color"/"behavior" in two places), the
 * capital in "Canny", a dropped article in one reveal bullet, "5 in-person test
 * sessions" (the frame says "moderated", which contradicts the Testing section
 * — Flore adjudicated on 2026-08-21 and the number was never the problem), and
 * the Jules quote's attribution, which the frame sets upright inside an
 * otherwise italic line. Fix them in the frame and these notes can go.
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

// Route root for the process logs. NOT the files themselves: the documents live
// in public/process/artifakt/*.html, but every link goes through
// /work/artifakt/process/:log, which frames them with the site's navigation
// (see ProcessLogPage.jsx). Linking straight to the .html would drop the reader
// into a document with no way back.
const LOGS = '/work/artifakt/process'

// The six process logs, as data rather than as six card literals.
//
// ONE LIST, TWO CONSUMERS: the thumbnail grid in "The Process" above, and the
// `/work/artifakt/process/:log` route that frames each document with the site's
// navigation (see ProcessLogPage.jsx). The route validates its `:log` param
// against these slugs, so an unknown slug redirects instead of framing an
// arbitrary path.
//
// `slug` is the URL and `file` is the document on disk; they match today but
// are separate fields on purpose — the files are Flore's generated exports and
// their names belong to that export, while the slugs are public URLs that
// should not churn if a filename does.
//
// THUMBNAIL NAMES DO NOT MATCH THEIR CONTENT for two of the six, and that is
// not a mistake to tidy: `card-final-product.webp` pictures loading-state specs
// and `card-loading-animations.webp` pictures the final-screen "one shell, five
// faces" page. Each thumbnail was opened and matched to what it actually shows.
// Renaming the files is the real fix; pairing them by filename is the bug.
export const processLogs = [
  {
    slug: 'reveal-ai-integration',
    file: 'reveal-ai-integration.html',
    title: 'Reveal & AI integration',
    thumb: 'card-reveal.webp',
    alt: 'First page of the “Reveal — AI Integration Visual Process” log',
  },
  {
    slug: 'prompting-process',
    file: 'prompting-process.html',
    title: 'Prompting process',
    thumb: 'card-two-pipeline.webp',
    alt: 'First page of the “Image Generation & Prompting Process” log, showing the two-pass pipeline diagram',
  },
  {
    slug: 'visual-system',
    file: 'visual-system.html',
    title: 'Visual system',
    thumb: 'card-visual-system.webp',
    alt: 'A page of design tokens, type scale and icon decisions',
  },
  {
    slug: 'loading-animations',
    file: 'loading-animations.html',
    title: 'Loading animations',
    thumb: 'card-final-product.webp',
    alt: 'Loading-state screen specs and a five-step animation sequence',
  },
  {
    slug: 'scaffold-process',
    file: 'scaffold-process.html',
    title: 'Scaffold process',
    thumb: 'card-scaffold.webp',
    alt: 'Experiment 006, contour reduction variants of a horse sketch',
  },
  {
    slug: 'final-screen-redesign',
    file: 'final-screen-redesign.html',
    title: 'Final screen redesign',
    thumb: 'card-loading-animations.webp',
    alt: 'The “one shell, five faces” page showing the five artist portraits and copy decisions',
  },
]

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
    // The hero stage is `surface-yellow`, not the graph-paper `bg-notebook`
    // the PitchPivot hero uses. Sampled (node 4897:4515) — a deliberate
    // divergence between the two case studies, flagged to Flore rather than
    // quietly unified.
    stage: 'bg-surface-yellow',
    // Grey border + soft shadow + radius 16, sampled from the phone screenshot
    // in the hero (node 4897:4524). PitchPivot's hero media takes a hard black
    // border instead, which is why this is a prop rather than baked into Frame.
    mediaClassName:
      'mx-auto border border-border-grey rounded-radius-16 shadow-[0_0_12px_0_rgba(0,0,0,0.25)]',
    media: {
      kind: 'image',
      src: `${M}/hero.webp`,
      label: '[ hero.webp — 545x1185 portrait product screenshot ]',
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
          text: 'You type a word, **trace a loose scaffold by hand**, and your line comes back transformed through the style of a real artist. **The AI does the finishing — it never touches the making.**',
        },
        {
          // THE STAKES, added by Flore in the frame 2026-08-24 after the
          // narration review flagged that the page had no problem statement —
          // every problem in it was a design problem she hit, not a human one
          // the product solves. This is the reader's problem, and it belongs in
          // the establishing section rather than in a section of its own.
          //
          // Its other half ("effort only counts if the recipient can see it")
          // deliberately does NOT live here: it motivates the reveal, so it
          // opens that section instead.
          type: 'p',
          text: 'Digital gifting has an effort problem. When sending costs nothing, it reads as nothing — and the obvious fix is to make something by hand, except **most adults stopped drawing at eleven** and have no intention of starting again in front of someone they love.',
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
        // One of the four stages that KEPT the yellow when Flore stripped it
        // off the rest, 2026-08-24 (node 4897:4533 still binds
        // Colors/Surface/highlight at Radius/4).
        tint: 'bg-surface-yellow',
        radius: 'rounded-radius-4',
        src: `${M}/how-it-works.webp`,
        label: '[ how-it-works.webp — 2000x667 core flow banner ]',
        placeholderAspect: '2000 / 667',
        alt: 'The core flow across five phone screens: the Joy logo, a traced sketch, five artist style cards, the finished artwork addressed to Jo, and the result shared in a chat',
      },
    },

    // 2 --------------------------------------------------------------------
    {
      id: 'what-it-is',
      title: 'What it is',
      // THE SCREENCAST LIVES HERE NOW — Flore's layout pass, 2026-08-24. It was
      // its own untitled section directly below this one; Figma has merged the
      // two into a single row (node 4897:4535 now holds both the text container
      // and a `video wrapper` beside it). One fewer section, and the video
      // finally has a caption above it that says what it is showing.
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
      media: {
        layout: 'split',
        // `plain` opts out of the tinted stage: this keeps the site's
        // product-screencast treatment (canvas fill, radius 24, caption below),
        // which is what Figma still binds on its container (node 4897:4548) and
        // what PitchPivot's feature videos use.
        plain: true,
        kind: 'video',
        src: `${M}/artifakt.mp4`,
        poster: `${M}/artifakt-poster.webp`,
        label: '[ artifakt.mp4 — portrait UI screencast ]',
        placeholderAspect: '920 / 2000',
        alt: 'A screen recording of Artifakt: typing an intention, tracing the scaffold, and the finished artwork appearing',
        caption: 'state 21.08.26',
      },
      // THE ARTIST ROSTER, added 2026-08-24. The narration review's biggest
      // gap: "Bring an artist in" is one of the three stated goals and the page
      // argued most readers would meet one of these artists for the first time
      // here — while showing nothing but five names in a bullet.
      //
      // Placed INSIDE this section rather than in one of its own, which is
      // Flore's call and the tighter answer: the roster now appears directly
      // under the goal that claims it, and it is a premise for "Designing
      // against the model's defaults" much later — that section's argument
      // (the roster is deliberately not Picasso) only lands once the reader
      // has seen the roster.
      //
      // WHITE STAGE, sampled: node 4931:4525 is `bg-white`, not the page's
      // yellow. Same reasoning as the cake panel — the outputs are artwork and
      // a tint would sit on top of five artists' colour.
      extraMedia: {
        layout: 'full',
        // A plain white band, no radius at all (node 4931:4525 is `bg-white`
        // with no corner rounding) -- the only stage on the page without one.
        radius: 'rounded-none',
        src: `${M}/five-artists.webp`,
        label: '[ five-artists.webp — 2000x875 one sketch, five artist styles ]',
        placeholderAspect: '2000 / 875',
        alt: 'One traced sketch rendered five ways, labelled Louise Bourgeois, Kara Walker, Niki de Saint Phalle, Naoko Takeuchi and Keith Haring',
        // Figma has a double space after the comma (node 4931:4523); single here.
        caption: 'Five artists, a fixed curated roster',
      },
    },

    // 4 --------------------------------------------------------------------
    {
      id: 'question',
      title: 'The question: made by me — but make it good',
      // THE GUIDE IS AN ASIDE AGAIN, not narration — Flore, 2026-08-24, after
      // the narration review. It briefly carried this section's opening
      // question, which left the prose starting on "sharpened *it*" with the
      // referent living inside a speech bubble a skimmer would skip.
      //
      // Now it does what PitchPivot's Guide does: react to prose that already
      // stands alone. Compare that page's Turning Point note, "I went in
      // convinced this was a presentation problem. It wasn't." Same register on
      // purpose — one Guide contract across both case studies.
      //
      // Figma has a stray closing quote mark on this line ("It wasn't."");
      // dropped here. Fix the frame so a re-pull doesn't restore it.
      note: 'I went in assuming the barrier was emotional. It wasn’t.',
      prose: [
        {
          // The opening question is BACK in the prose, which is what makes the
          // next sentence's "it" resolve without reading the bubble.
          type: 'p',
          text: 'How do you help someone make a visual for another person, when most people freeze the moment they’re asked to create something?',
        },
        {
          // The age range and the *what*/*how* italics both went in Flore's
          // 2026-08-31 tightening pass; the frame now draws this line plain
          // apart from the bold lead-in.
          type: 'p',
          text: '**Six interviews** sharpened it — people aren’t reluctant, they’re blocked by what to make, not how.',
        },
        {
          type: 'p',
          text: 'Then an early test contradicted me. Three versions of one drawing — rough, refined, finished — which felt like it came from someone who cared? The finished one won, from people who had just told me they valued imperfection. My stimulus was flawed (only one version had colour), but the contradiction held in every session after:',
        },
        {
          type: 'p',
          text: '**People want to have made it, and they want it to look good. They don’t want to choose.**',
        },
        {
          type: 'p',
          text: 'That’s why the reveal became my first design focus, ahead of the drawing tool:',
        },
        {
          // A BOLD PARAGRAPH, NOT AN `aside` — Flore took the italic off this
          // line in the 2026-08-31 pass (node 4897:4563 draws it upright HK
          // Grotesk Bold). It now matches "People want to have made it" four
          // blocks above, which is the same move: the section's conclusion in
          // the page's own voice, where italic is reserved for the "Lesson:"
          // asides and participant speech.
          type: 'p',
          text: '**When AI helps you make something, at what point does it stop being yours?**',
        },
      ],
      // THE CAKE TEST, new asset 2026-08-24. Three drawings of the same cake at
      // increasing finish — the stimulus behind the contradiction the paragraph
      // above describes, which until now the reader had to take on trust.
      //
      // WHITE STAGE, not the page's yellow one. Sampled: node 4928:2804 binds
      // Radius/20 and NO surface variable, unlike every other stage here. The
      // artwork is loose black line-work on white and the tint muddies it.
      media: {
        layout: 'split',
        // White is MediaStage's default now; only the radius is unusual here.
        radius: 'rounded-radius-20',
        src: `${M}/the-cakes.webp`,
        label: '[ the-cakes.webp — 987x342 three-cake stimulus ]',
        placeholderAspect: '987 / 342',
        alt: 'Three drawings of the same birthday cake at increasing levels of finish: a rough outline, a more detailed line drawing, and a coloured illustration',
        caption: 'Testing question “Which one feels like it came from someone who cares and why?”',
      },
    },

    // 5 --------------------------------------------------------------------
    {
      id: 'reveal',
      title: 'The reveal: separating structure from style',
      note: 'With the reveal as the main design focus, finding the right balance between the trace and the artist’s style proved more challenging than expected.',
      // OPENS ON THE OTHER HALF OF THE STAKES — added 2026-08-24. "Made by
      // you" establishes that digital gifting has an effort problem; this is
      // the consequence that makes the reveal necessary, and it was the one
      // piece of the argument the page never made. It also gives the section a
      // paragraph of its own again: it previously opened straight onto a bullet
      // list, with the Guide carrying all the setup.
      //
      // DRAFT COPY, not pulled from Figma — flagged for Flore's sign-off and a
      // sync back into the frame.
      //
      // REWRITTEN 2026-08-31 from the frame. The five long bullets became four
      // short LISTS, each introduced by its own bold lead-in paragraph — so
      // "Wanted", "Got", "Dead ends" and "Fix 2" are now headings over their
      // items rather than the first words of one. That is why the block count
      // jumped from three to eleven for copy that got shorter.
      //
      // Each lead-in is written `**Wanted**:` with the colon OUTSIDE the bold,
      // not `**Wanted:**`. Two reasons, and both matter: the frame itself puts
      // the colon outside the bold run on four of the five, and Prose's
      // tight-spacing rule reads the RAW string for a trailing `:` — with the
      // colon inside the markers the string ends in `**` and the lead-in would
      // float 32px above the list it introduces.
      prose: [
        {
          type: 'p',
          text: 'Effort counts only if visible. The wobble in a traced line proves it, **shown in the reveal** — so I built transformation before drawing.',
        },
        { type: 'p', text: '**Wanted**:' },
        {
          type: 'list',
          items: [
            'traced line legible,',
            'artist’s hand clear,',
            'surprise so it feels like a gift, not a filter.',
          ],
        },
        { type: 'p', text: '**Got**:' },
        {
          type: 'list',
          items: [
            // "leads the model to", not the frame's "leads model to" — a
            // dropped article rather than the clipped register the rest of
            // this pass is written in. Fix the frame so a re-pull keeps it.
            'asking for L. Bourgeois leads the model to draw spiders, her famous motif, not your lines in her style.',
            'Artists **reach for icons, not technique**.',
          ],
        },
        { type: 'p', text: '**Dead ends**:' },
        {
          type: 'list',
          items: [
            'Replicate + ControlNet overlays new images, losing visible lines.',
            'Flux Pro Redux never sent the sketch.',
          ],
        },
        {
          type: 'p',
          text: '**Fix 1**: **describe material, not artist** — thread, tension, stitched surface.',
        },
        { type: 'p', text: '**Fix 2**:' },
        {
          type: 'list',
          items: [
            // "colour", not the frame's "color" — this page is British
            // throughout ("colour", "behaviour", "grey") and a single American
            // spelling inside one bullet reads as a slip, not a choice.
            '**Split pipeline** — Pass 1 builds structure without artist, Pass 2 adds artist and colour.',
            'Eight phases tested strength values; low kept the sketch, high gave beautiful but not mine.',
          ],
        },
        {
          type: 'aside',
          text: '**Lesson**: if the trade-off persists, change the pipeline shape, not the dial.',
        },
      ],

      // SWAPPED 2026-08-31 (Flore, node 5063:2885). This stage used to hold the
      // art-class mental model; that asset is still on the page but has moved
      // down to "What this changed about how I work", where it illustrates the
      // reflection rather than the failure. Its file was renamed to
      // `the-reveal-mental-model.webp` in the same pass, which FREED THE NAME
      // `the-reveal.webp` — and the new asset then took it. So that filename
      // points at a different picture than it did before 2026-08-31, and git
      // shows the swap as a delete plus an add rather than a rename. Don't
      // reconcile the two by name, and don't trust a pre-31 reference to
      // `the-reveal.webp` to mean this image.
      //
      // What sits here now is the evidence for the paragraph beside it: the
      // trace going in, and Louise Bourgeois's spider coming out with the
      // traced line gone. Showing the failure is the point — the prose claims
      // the model reaches for the icon, and until now the reader had to take
      // that on trust.
      //
      // RE-EXPORTED later the same day, and the change is the ARROW between the
      // two screens. It was two panels sitting next to each other, which left
      // the reader to infer the causality; the arrow states it, which is what
      // makes this a before/after rather than a pair. Same composition
      // otherwise, drawn slightly larger (882x766, was 781x678).
      //
      // Converted from Flore's PNG export to WebP, so it matches every other
      // asset on the page: lossy q90, alpha preserved (the phone corners are
      // transparent and sit on the stage's own fill). 279 KB -> 87.
      media: {
        layout: 'split',
        // NO WIDTH CAP — Flore, 2026-08-31, asked for this one bigger, so it
        // fills its stage (the 572 split column less MediaStage's 24 of padding
        // = 524) instead of stopping at a drawn width.
        //
        // A DELIBERATE EXCEPTION to the convention the rest of this page
        // follows, and worth saying so plainly: every other asset here is
        // capped at its absolute Figma width, and `against-the-defaults` below
        // was uncapped once and put back (Flore, 2026-08-25: too big in code).
        // Don't "restore" 370 as a consistency fix.
        //
        // The reason the two go opposite ways is what is inside them. The
        // defaults grid is artwork, and its Figma surround is composition. This
        // one is two phone SCREENSHOTS, and the screens carry UI text — at 370
        // each phone was ~150px and every word in it was mush. At 524 they are
        // ~210 and the headline resolves, which is the difference between
        // evidence and a picture of evidence.
        //
        // `MEDIA_MAX_H` (88svh) still applies underneath and is what stops this
        // on a very short window; it does not bite at any normal viewport,
        // where the column is the smaller of the two.
        src: `${M}/the-reveal.webp`,
        label: '[ the-reveal.webp — 882x766 trace in, spider out ]',
        placeholderAspect: '882 / 766',
        alt: 'Two Artifakt screens with an arrow between them: on the left the trace screen with the word “water” and a loose hand-drawn line, on the right the reveal showing a Louise Bourgeois spider in which none of the traced line survives',
        caption: 'Traced line not legible. Artists reach for icons, not technique.',
      },
      // TWO EMBEDS, NOT YET BUILT. Figma draws both as empty dashed
      // placeholders (nodes 4897:4571 / 4897:4577) and Flore confirmed
      // 2026-08-21 that they are iframes or similar, to be done later. They
      // render through the site's existing ImagePlaceholder convention, so the
      // gap is visible and self-documenting on the page rather than an
      // unexplained blank — the same way PitchPivot handled its missing assets.
      // `src` is deliberately absent; that is what triggers the placeholder.
      // ONE DIAGRAM, not two. Figma drew a second stage labelled "Two-pass
      // progression strip"; Flore confirmed on 2026-08-24 that was a mistake
      // and only this one is real. Remove the second stage from the frame too,
      // or a re-pull reintroduces an empty panel.
      //
      // IN-PAGE, not an iframe, since 2026-08-25 — see PipelineDiagram.jsx.
      // The previews were being clipped by the frame's bottom edge, which is
      // not something an embed can be fixed out of.
      //
      // Copy and preview captions came from Flore's own prompting-process log,
      // where this diagram originates; the images were extracted from the same
      // document rather than re-shot.
      pipeline: {
        title: 'How the pipeline works',
        // MOVED HERE FROM THE SECTION, 2026-08-25 (Flore, and matched in the
        // frame). It used to sit in the reveal's text column, where it read as
        // a footnote to the prose; it is really the diagram's own "there is
        // more behind this", so it belongs under the diagram.
        link: { label: 'The 14 phases behind this pipeline', href: `${LOGS}/prompting-process` },
        intro:
          'Artifakt uses a two-pass image-to-image pipeline. The user draws a sketch; that sketch is preprocessed per artist, then sent through two sequential API calls to fal.ai’s Flux Dev model. Pass 1 establishes gesture and material quality. Pass 2 applies the artist’s full visual identity on top.',
        // `accent` marks the two generative passes — the point of the diagram.
        // A flag rather than an index so reordering can't recolour the wrong box.
        steps: [
          {
            kicker: 'Input',
            name: 'User sketch',
            detail: 'Canvas drawing, 768px wide',
            preview: {
              src: `${M}/pipeline/input.webp`,
              aspect: '1704 / 1800',
              alt: 'A loose pencil sketch on the Artifakt canvas',
              caption: 'Raw user sketch on the canvas — loose pencil lines, no colour.',
            },
          },
          {
            kicker: 'Pre-process',
            name: 'Sketch config',
            detail: 'Line width, invert, flood fill — per artist',
            accent: true,
            preview: {
              src: `${M}/pipeline/pre-process.webp`,
              aspect: '1704 / 1800',
              alt: 'The sketch after cleaning and per-artist line-weight adjustment',
              caption:
                'Sketch cleaned and line weight adjusted per artist before the model sees it. Think of it as defining brushes in a drawing tool — but to support the unique gesture of each artist.',
            },
          },
          {
            kicker: 'Pass 1',
            name: 'Gesture + Material',
            detail: 'Flux Dev img2img · no artist name · strength 0.75–0.82',
            accent: true,
            preview: {
              src: `${M}/pipeline/pass-1.webp`,
              aspect: '1704 / 1800',
              alt: 'Output of pass one: strong form and material, no artist colour yet',
              caption: 'Gesture and material established — strong form, no artist colour yet.',
            },
          },
          {
            kicker: 'Pass 2',
            name: 'Finish',
            detail: 'Flux Dev img2img · artist name + colour + motifs · strength 0.70–0.90',
            accent: true,
            preview: {
              src: `${M}/pipeline/pass-2.webp`,
              aspect: '1704 / 1800',
              alt: 'Output of pass two: the artist’s colour, motifs and full style applied',
              caption: 'Artist identity applied — colour, motifs and full style on top.',
            },
          },
          {
            kicker: 'Output',
            name: 'Artwork',
            detail: 'Displayed on Screen 2',
            preview: {
              src: `${M}/pipeline/output.webp`,
              aspect: '1704 / 1800',
              alt: 'The finished artwork as shown on Screen 2',
              caption: 'Final artwork shown on Screen 2.',
            },
          },
        ],
        // NO NOTES ROW — removed 2026-08-31, Flore: "it's just too much
        // content." It was a four-card grid under the diagram covering what
        // strength controls, why results vary, the model settings, and cost.
        //
        // The trim it completes: the row was already down from the source
        // document's six, because "Why two passes?" is said by the prose beside
        // this diagram and "Scaffold (Screen 1)" belongs to the scaffold
        // section further down. Cutting the last four is the same judgement one
        // step on -- this figure's job is to show the pipeline, and the reader
        // who wants inference steps and per-call cost is a different reader.
        //
        // NOTHING IS LOST, which is what makes the cut cheap: all four notes
        // came out of the prompting-process log, that log still carries the
        // material (checked -- strength, seed, LoRA, guidance scale and the
        // regenerate button are all in it), and `link` above already points at
        // it from this diagram. The detail moved one click away rather than
        // going.
        //
        // PipelineDiagram still renders a `notes` array when given one
        // (`notes?.length > 0`), so restoring a shorter row is a paste here and
        // no code change.
      },
    },

    // 6 --------------------------------------------------------------------
    {
      id: 'scaffold',
      title: 'The scaffold: leaving room to make it yours',
      // Flore's wording, 2026-08-25, and synced into the frame. Replaced a
      // draft of mine; it keeps the same contract as the other Guides — react
      // to the prose rather than set it up.
      note: 'I built the scaffold to guide users, but testers felt it was telling them what to draw.',
      prose: [
        { type: 'p', text: 'Testing raised the project’s sharpest question:' },
        {
          // STILL FULLY ITALIC, where the frame now sets only the quoted
          // sentence italic and leaves "— Jules" upright. `quote` is one italic
          // block and emphasis.jsx has no un-italic marker to nest inside it
          // (that is a documented limit, not an oversight). Kept as a real
          // <blockquote> rather than downgraded to a paragraph carrying
          // `*...*` — the semantics are worth more than the attribution's
          // slant. Say the word and it flips.
          type: 'quote',
          text: '"Why trace something that’s already there?" — Jules',
        },
        {
          type: 'p',
          text: 'The scaffold was too complete, making tracing feel like busywork, not creation. All testers noticed this.',
        },
        {
          type: 'list',
          items: [
            '**First idea** — UX tweaks: softer copy, looser prompts, art-school style (think volumes first). The model didn’t get it.',
            '**Costly detour**: generating the scaffold via img2img on an SVG motif. Biggest credit chunk, but it made a more finished illustration.',
            '**Reframe**: "Make this less detailed" is subtraction, not generation. Image-to-image changes style, not structure.',
            // "Canny" capitalised, against the frame's "canny" — it is a
            // person's name (the Canny edge detector), the same class of fix
            // as "Six interviews" above.
            '**Fix** in code, not prompts: generate a sketch, then subtract — grayscale → blur → Canny → flood-fill → keep outer contours. Prototyped in Python, ported to browser Canvas for static hosting.',
            '**Still a problem**: flood-fill assumes closed contours. Give it a bike, it fills the canvas black.',
          ],
        },
        {
          // "behaviour", not the frame's "behavior" — British throughout, same
          // call as "colour" in the reveal section.
          type: 'p',
          text: 'With a simpler scaffold, tracing felt like a choice. Wording mattered: "trace the image" implied precision. Softer wording changed behaviour more than the interface.',
        },
        {
          type: 'aside',
          text: '**Lesson**: when UX tweaks fail, look upstream. This was a generation issue disguised as interaction.',
        },
      ],
      link: { label: 'The contour-reduction experiments', href: `${LOGS}/scaffold-process` },
      // NOW A SPLIT COLUMN, and the asset was re-exported PORTRAIT to suit it
      // (835x1365, was 1334x753 landscape). This supersedes the 2026-08-21
      // "make it bigger" call, which pushed the old landscape asset to full
      // width so the horse sketches were readable — the new export stacks the
      // phone above the experiment sheet instead, solving the same problem
      // inside half a column.
      media: {
        layout: 'split',
        src: `${M}/the-scaffold.webp`,
        label: '[ the-scaffold.webp — 835x1365 scaffold + contour experiments ]',
        placeholderAspect: '835 / 1365',
        alt: 'The Artifakt scaffold screen above a sheet of contour-reduction experiments showing a horse sketch reduced to progressively simpler outlines',
        // FIGMA'S CAPTION HERE IS WRONG and is deliberately not carried over:
        // node 4928:2867 reads "Representation biases", which belongs to the
        // NEXT section's image — a paste that landed on the wrong stage. This
        // panel shows contour reduction, not representation. Written to match
        // what is pictured; confirm the wording and fix the frame.
        caption: 'Reducing the scaffold to its outer contours',
      },
    },

    // 7 --------------------------------------------------------------------
    {
      id: 'defaults',
      title: 'Designing against the model’s defaults',
      note: 'Showcasing female and queer artists made representation a key design consideration, from how source images were selected to how they were reinterpreted.',
      prose: [
        {
          // "strong", not "swimmer" — changed in the frame on 2026-08-24, and
          // the new asset shows a footballer, so the keyword and the picture
          // now agree. They did not before.
          type: 'p',
          text: 'Type "strong" and Flux gives you a white man. Ask Naoko Takeuchi for a character and you get a blonde, blue-eyed one regardless of the keyword. The defaults are thin, white and European, and they hold until you actively displace them.',
        },
        {
          type: 'list',
          items: [
            '**Doesn’t work:** negation. "Not white" or "diverse" collapses straight back to the average.',
            '**Works:** **explicit attribute language** — skin tone, hair, body type — plus foreground anchoring and a rotating subject pool so one default can’t dominate.',
          ],
        },
        {
          type: 'p',
          text: 'The harder part wasn’t technical. The model often suggested well-known artists like Picasso because they were easier to generate and saved me hours of work. But **choosing artists simply because the model knew them better would undermine the purpose of the product**.',
        },
        {
          // "Lesson", not "Note" — retitled in the frame on 2026-08-31, which
          // puts it in step with the asides closing the reveal and scaffold
          // sections.
          type: 'aside',
          text: '**Lesson:** I added this remediation after seeing skewed output; it should have been in the initial prompt since representation is a key value.',
        },
      ],
      // POINTS AT THE SAME DOCUMENT as "The 14 phases behind this pipeline"
      // above, which is the honest mapping -- the per-artist prompts live
      // inside the prompting-process log rather than in one of their own.
      // Two links to one page is defensible; if that log grows an anchor for
      // the table, add it here (`...#per-artist`). Flagged: if the table is
      // somewhere else entirely, this is the line to change.
      link: { label: 'The per-artist prompt table', href: `${LOGS}/prompting-process` },
      // RE-EXPORTED TWICE on 2026-08-24. It now shows the fix rather than only
      // the problem: before/after pairs with arrows, where the original asset
      // was two unlabelled default outputs. The caption changed with it —
      // "Correcting representation biases", not "Representation biases".
      //
      // Dimensions are the CURRENT file's (691x1100, re-measured after the
      // second export — it was 818x1302 for a few hours). These numbers only
      // matter before the image loads, but a stale pair reserves the wrong
      // space and the page jumps when the real one arrives.
      media: {
        layout: 'split',
        // CAPPED at Figma's own drawn width -- Flore, 2026-08-25: too big in
        // code. Uncapped it filled the 572 split column and rendered 524x834,
        // taller than the prose beside it; the frame insets it to 333.5 in a
        // 635.5 stage (node 4929:2870), so the surrounding tint is part of the
        // composition rather than a margin to be squeezed out.
        //
        // The ABSOLUTE Figma width, not the same percentage of our narrower
        // column. That is the convention the rest of this page already follows
        // -- the hero phone is 272 and the screencast 400, both drawn sizes --
        // and it keeps the artwork legible at the size it was designed at.
        //
        // Note this number moved: it was 394.79 earlier the same day. Re-read
        // rather than assumed, which is the only reason the cap is right.
        maxWidth: 334,
        src: `${M}/against-the-defaults.webp`,
        label: '[ against-the-defaults.webp — 691x1100 before/after grid ]',
        placeholderAspect: '691 / 1100',
        alt: 'Two before-and-after pairs of generated figures for the keyword “strong”: in each row an arrow leads from the model’s default output to a corrected version with explicit attribute language',
        caption: 'Correcting representation biases',
      },
    },

    // 8 --------------------------------------------------------------------
    {
      id: 'testing',
      title: 'Hesitation, then delight',
      // DRAFT — my wording, not pulled from Figma, where this bubble still
      // reads "I conducted 4 moderated in -person testing sessions. Here are
      // the results" (stray space, no full stop). That is setup, and the prose
      // below already counts the sessions, so the bubble was saying nothing the
      // reader was not about to be told. Reacts instead. Needs Flore's sign-off
      // and a sync back into the frame.
      note: 'I expected the tracing to be the fun part. It was the part people dreaded.',
      prose: [
        { type: 'p', text: 'Four moderated in-person sessions.' },
        {
          type: 'p',
          text: '**Every single person hesitated before tracing. Every single person lit up at the result.** All said they’d send it — and wanted to make another straight away.',
        },
        {
          // The full stop sits OUTSIDE the bold, matching the frame. Small, and
          // the kind of thing a re-pull would otherwise keep re-flagging.
          type: 'p',
          text: '**That gap is the finding**. People don’t understand why they’re drawing until they see what it becomes — the product front-loads uncertainty and back-loads the payoff. A good ending doesn’t validate the path to it.',
        },
        {
          type: 'p',
          text: 'It also answered the question I started with. **Ownership is partial: it’s my idea but not my drawing.** For a scaffold model that’s the honest ceiling — and enough to make them want to send it.',
        },
        {
          // THE LAST FOUR PARAGRAPHS ARE NOW ONE LIST — Flore, 2026-08-31. The
          // killed animation, the two open problems and the next test were four
          // separate paragraphs saying four separate things; as a list with
          // bold status labels they read as one set of outcomes, which is what
          // they are.
          type: 'list',
          items: [
            '**Killed.** The onboarding animation confused three testers in a row. Removed rather than redesigned a fourth time.',
            '**Still open.** The artist bio — the most culturally meaningful moment in the product — was the least discovered thing in it.',
            '**Still open.** Erase clears everything; testers expected stroke-by-stroke undo.',
            '**Next test.** Promise the reveal before the trace, and see whether the hesitation drops.',
          ],
        },
      ],
      // Re-exported larger, 2026-08-24 (1183x749, was 923x584).
      //
      // WHITE STAGE — Flore, 2026-08-24, a deliberate override of the frame,
      // which still binds Colors/Surface/highlight at Radius/4 here (node
      // 4929:2906). Asked for after seeing it built: the photographs carry
      // their own colour and the tint fought them. Sync the frame, or a re-pull
      // puts the yellow back.
      media: {
        layout: 'split',
        src: `${M}/user-testing.webp`,
        label: '[ user-testing.webp — 1183x749 test session photos ]',
        placeholderAspect: '1183 / 749',
        alt: 'Two photographs from a moderated session: a tester tracing an Artifakt sketch on a phone held in both hands',
        caption: 'User testing session',
      },
    },

    // 9 --------------------------------------------------------------------
    {
      id: 'reflection',
      title: 'What this changed about how I work',
      // NO `measure: 'narrow'` ANY MORE, and its absence is the point. This
      // section used to be text-only, and the narrow measure is what made the
      // page taper as it ended (Flore, 2026-08-24). It now carries media, so it
      // is a split row and the COLUMN is the measure — `measure` is ignored on
      // that branch (see CaseStudyArtifakt.jsx), and leaving it in place would
      // read as a live setting that does nothing. "The Process" below is still
      // text-only and still narrow, so the taper survives.
      prose: [
        {
          type: 'p',
          text: 'Everything that moved this project forward came from **changing the question rather than the setting**. **Two passes instead of a better strength value. Subtraction instead of a better prompt.** Each time I got there after two or three rounds of tuning that felt productive and weren’t.',
        },
        {
          type: 'p',
          text: '**AI output arrives looking finished**, which makes it easy to accept as a given and tune around the edges. The design work is in **refusing that** — knowing what the model is actually doing, and noticing where its convenience is quietly making a decision that should have been yours.',
        },
      ],
      // MOVED HERE FROM THE REVEAL SECTION, 2026-08-31 (Flore, node 5063:3080),
      // and the caption was rewritten with it — it used to read "Mental model
      // for fix 1", scoped to one fix in a list. It now names the whole
      // two-pass pipeline and where the idea came from, which is why it earns a
      // place next to the reflection instead: the section is about changing the
      // question rather than the setting, and this is the picture of having
      // done that.
      //
      // The file kept its name through the move (`the-reveal-mental-model`,
      // renamed from `the-reveal` on 2026-08-31). Every asset on this page is
      // WebP again as of that date; there is no PNG left here.
      media: {
        layout: 'split',
        // Figma draws it at 475.4 inside a 651.5 stage (node 5063:3079).
        maxWidth: 475,
        src: `${M}/the-reveal-mental-model.webp`,
        label: '[ the-reveal-mental-model.webp — 993x731 two-pass mental model ]',
        placeholderAspect: '993 / 731',
        alt: 'A diagram of the two-pass approach: a Van Gogh sunflowers painting labelled “look at art”, a detail of the brushwork labelled “study the technique”, a photograph of real sunflowers labelled “study the subject”, and a new painting labelled “create your own art”',
        caption:
          'Mental model for the two-pass pipeline, borrowed from childhood art classes: study the technique, study the subject, then put both away and make your own.',
      },
    },

    // 10 -------------------------------------------------------------------
    {
      id: 'how-i-worked',
      // RETITLED 2026-08-24, and matched in the frame (node 4897:4626).
      //
      // This section sits AFTER the reflection on purpose — Flore's call. That
      // order only reads as deliberate if the section is clearly an appendix
      // rather than a chapter that arrived late, which is what the new title
      // does: it names the parallel to PitchPivot's "The Process" and puts the
      // number up front, so the scale of the work argues before anyone opens a
      // log. "How I worked" read like a mislaid chapter.
      //
      // The `id` stays `how-i-worked`: it is a stable anchor, not a label, and
      // renaming it would break any link already pointing at it.
      title: 'The Process — 14 phases, documented',
      measure: 'narrow',
      prose: [
        {
          type: 'p',
          text: 'Four weeks, solo, built during cohort 6 of Patricia Reiners’ AI for Designers. Same timeline as PitchPivot, considerably heavier underneath — **most of those hours went into the image pipeline, not the interface**.',
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
          text: '**4 weeks end to end**. **14 documented prompting phases**. 6 process logs kept during the build. 5 artists, after two were cut for technical reasons. 5 in-person test sessions.',
        },
        {
          type: 'p',
          text: 'Single index.html, no backend, static hosting. Image generation via [fal.ai](https://fal.ai) / Flux. Built in Claude Code.',
        },
      ],
      // MAPPED BY CONTENT, NOT BY FILENAME — and two of the six do not agree.
      // Each thumbnail was opened and read before being placed here, because
      // the delivered names cross over: `card-final-product.webp` is a page of
      // loading-state and animation-sequence specs, and
      // `card-loading-animations.webp` is the "one shell, five faces" page of
      // final-screen design decisions. So the two files are swapped relative
      // to their names.
      //
      // The Figma labels are the source of truth for the ORDER and the WORDING
      // (nodes 4897:4631-4637); the files are matched to them by what is
      // actually pictured. Flagged to Flore — if the intended pairing is the
      // other way round for these two, it is a one-line swap here.
      //
      // Mapped from the `processLogs` export at the bottom of this file, so the
      // cards here and the /work/artifakt/process/:log route read ONE list.
      // Duplicating it would let a card and its page disagree about a title.
      // THE REPO LINK CLOSES THIS SECTION, below the six log cards -- Flore
      // 2026-08-28, node 5022:9636, which is a child of the Process section
      // (4897:4623) at x=171, y=912: the section's left margin, 40 below the
      // card container's bottom edge at 872.
      //
      // It belongs here rather than in the hero because this is the section
      // about how the thing was built; the source is the last and most
      // detailed of the process artefacts, after the six logs.
      cta: { href: 'https://github.com/FloredC/Artifakt', label: 'Github repo' },
      logs: processLogs.map((log) => ({
        title: log.title,
        href: `/work/artifakt/process/${log.slug}`,
        src: `${M}/${log.thumb}`,
        label: `[ ${log.thumb} ]`,
        alt: log.alt,
      })),
    },

    // 11 -------------------------------------------------------------------
    // The closing gallery. Figma composes four separate phone screenshots
    // (node 4897:4641); Flore delivered them as one composite, so this is a
    // single asset in a radius-60 panel rather than a four-up grid.
    {
      id: 'final-product',
      media: {
        layout: 'showcase',
        // WHITE STAGE — Flore, 2026-08-24, same call as the testing photos and
        // the same divergence from the frame, which still binds
        // Colors/Surface/highlight here (node 4897:4639). The radius-60 mount
        // stays; only the fill changed.
        // Smaller than the panel that holds it — Flore, 2026-08-21 ("the final
        // product image should be a bit smaller"). The radius-60 panel still
        // spans the full content column; only the artwork inside it shrinks, so
        // the tinted surround reads as a mount rather than a thin border.
        // MediaStage centres it (`items-center`), so the margin is even.
        //
        // RE-EXPORTED 2026-08-31 (node 5064:3097). The composition is the same
        // four screens, now shot in a browser chrome and slightly wider
        // (2531x1240 against 2000x1054), and the fourth screen changed: it is
        // the artist bio, not the share view. The alt text moved with it.
        //
        // Converted from PNG to WebP in the same pass: 1.5 MB -> 350 KB, which
        // is also less than half the asset it replaced despite the higher
        // resolution. Lossy q90 — checked against the PNG at the size a retina
        // screen actually rasterises (880 CSS px, so 1760 device px, a 1.4x
        // downscale from source), including the artist-bio body copy, which is
        // the smallest type in the picture. No visible difference.
        maxWidth: 880,
        src: `${M}/final-product.webp`,
        label: '[ final-product.webp — 2531x1240 four-screen gallery ]',
        placeholderAspect: '2531 / 1240',
        alt: 'Four Artifakt screens side by side: sketching over the guide, choosing an artist style, the finished “The Optimist” artwork in Kara Walker’s style, and the About Kara Walker bio',
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
    slug: 'welcome-to-my-island',
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
