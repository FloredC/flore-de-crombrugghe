/**
 * PitchPivot case study content.
 *
 * All copy lives here; the components stay content-agnostic and the page just
 * maps over this (BUILD-pitchpivot.md v3).
 *
 * COPY PROVENANCE: the prose below was read off the Figma frame
 * (node 4774:7504) rather than written here or left as lorem — per CLAUDE.md,
 * missing copy means "not yet pulled", not "not yet written". Anything still
 * genuinely unknown is marked `REVIEW —`, the convention already used for
 * pending card content in this repo, so it is visible on the page instead of
 * quietly absent.
 *
 * ASSET PATHS point at where the files actually live, which is NOT where the
 * build spec's asset contract said they would. Reality won on three counts,
 * all confirmed against the delivered files:
 *   - directory  `public/images/pitchpivot/`, not `public/media/pitchpivot/`.
 *     This matches the `images/home/` namespace the rest of the site now uses,
 *     so it's the more consistent of the two.
 *   - posters    `.png`, not `.jpg`.
 *   - hero       a single `hero.png`, not an mp4 plus a poster.
 *
 * They are written root-absolute and resolved at render time through
 * `assetUrl()` inside Media.jsx, which prefixes Vite's configured base — see
 * the note there about why a literal `/images/...` would 404 in production.
 */

import { MEDIA_WIDTH } from '../../lib/caseStudyLayout'

const LIVE_URL = 'https://pitch-pivot-play-pro.lovable.app'

// Directory root for this project's media. One constant so a move is one edit,
// and so every path below is visibly the same shape.
const M = '/images/pitchpivot'

export default {
  slug: 'pitchpivot',

  frame: {
    category: 'AI / Vibecoding',
    // MATCHED TO THE CARD, 2026-08-14. This read "PitchPivot — Reframe and
    // elevate your design impact" while the homepage card
    // (projects/pitchpivot.mdx) read "Design Reasoning for Business Impact",
    // so a reader clicked one promise and landed on a differently-titled page.
    //
    // The card's version won, per Flore. Note the two files are NOT wired
    // together: `frontmatter.title` drives the card and this drives the page
    // <h1>, so they have to be changed in both places. Kept separate because
    // the case study is deliberately a per-page opt-in (see ProjectPage.jsx)
    // and not every project has one — but that does mean this pair can drift
    // again silently.
    title: 'PitchPivot — Design Reasoning for Business Impact',
    // REWRITTEN 2026-08-14 from Flore's own definition of the product:
    //   - "helps you rethink and reframe your design decisions so that they
    //      answer to real business needs"
    //   - "helps designers anticipate and prepare for tough questions"
    //
    // Two corrections are folded in, and BOTH are easy to lose again:
    //
    //  1. SUBSTANCE, NOT VOCABULARY. The original "frame design decisions in
    //     business terms" made this a translation problem — say the same thing
    //     in different words. It isn't. The decision itself has to answer a
    //     real business need; the language follows. An intermediate draft
    //     ("pivot how they frame a design decision for whoever is in the room")
    //     made it about audience-adaptation instead, which drifts the same way
    //     from the other side. Business needs are the point, not a register
    //     the copy translates into.
    //
    //  2. PREPARE, NOT JUST WITHSTAND. "hold their reasoning when challenged"
    //     describes only the moment of pushback. Flore's "anticipate and
    //     prepare" covers the rehearsal before it, which is what Pushback
    //     Pivot actually is — you practise against a chosen audience ahead of
    //     the conversation, not during it.
    //
    // STILL CARRYING THE OLD FRAMING, pending Flore's call on a wider sweep:
    // `what.body`, the two media `alt` strings, the Impact Framing feature
    // body ("translates UX jargon into ... business-oriented language" — the
    // clearest surviving instance of correction 1), and
    // `projects/pitchpivot.mdx`'s homepage card description.
    //
    // NOT to be swept: the participant quotes in `turningPoint`. "they start
    // asking business questions" and "not linked to business goals" are what
    // people actually said, and they are the evidence that the business need
    // is real — they are the reason this framing is right, not an instance of
    // it being wrong.
    oneLiner:
      'An AI tool that helps designers reframe design decisions so they answer real business needs, and prepare for the tough questions before they’re asked.',
    // Flore's own wording, 2026-08-14 — this was a `REVIEW —` placeholder
    // reading "Solo project: research, PRD, product design, build. Oct 2025."
    // which was inferred, not sourced, and was visible on the live page.
    //
    // The date is dropped rather than carried over: it already appears on the
    // homepage card ("Oct 2025 — ...") in projects/pitchpivot.mdx, and a Role
    // line answers "what did you do", not "when".
    role: '0→1 designer — from research to final product',
    liveUrl: LIVE_URL,
    // Figma's hero button label.
    liveLabel: 'Try it out',
    zone: 'Lab',
    subsection: 'Own products',
    // A still image, not a video — Flore's correction, 2026-08-12. The asset
    // contract listed `hero-demo.mp4` + a poster, but the hero was never a
    // demo: Figma draws a static screenshot of the Pushback Pivot panel
    // (node 4774:7537). So there is no `poster` here, and no video rules apply.
    //
    // Every `placeholderAspect` on this page is the delivered file's REAL pixel
    // dimensions, read off the loaded assets in the browser rather than guessed
    // from the design frame. That matters: the guesses were wrong for all five
    // (this one estimated 4:5 = 0.800 against an actual 0.863, and the two
    // screencasts were estimated 16:9 landscape when they are in fact portrait).
    // Using true dimensions means the space reserved before load is exactly the
    // space the media takes, so there is no layout shift at all.
    media: {
      kind: 'image',
      src: `${M}/hero.png`,
      label: '[ hero.png — 2136x2474 portrait product screenshot ]',
      placeholderAspect: '2136 / 2474',
      maxWidth: MEDIA_WIDTH.hero,
      alt: 'The PitchPivot Pushback Pivot panel: a presentation context, four audience types, and a generated challenge question',
    },
  },

  what: {
    title: 'What is PitchPivot',
    body: [
      // TWO PARAGRAPHS, TWO JOBS — Flore's structure, 2026-08-14: the first
      // says what PitchPivot does, the second says where it came from. The
      // market case stays out of both; that is the `why` section's job, which
      // comes next.
      //
      // This replaces a single paragraph that restated the hero one-liner
      // thirty words after it ("helps designers translate design thinking into
      // business language..."). Two product descriptions back to back left the
      // second with nowhere to go. The fix is not a shorter restatement but a
      // different job per slot.
      //
      // P1 EXPANDS the one-liner rather than repeating it, carrying the two
      // things the hook has no room for: the substance-not-vocabulary point
      // (Flore's correction — the decision has to answer a real business need,
      // not be reworded into business register), and the two exercises, which
      // sets up the `features` section without pre-empting it.
      'PitchPivot helps designers rethink and reframe a design decision so that it answers a real business need — not just by rewording it, but by connecting it to what the business is actually trying to solve. It then helps them anticipate the questions that decision will attract, and rehearse the answers against the audience they will be facing: an executive, a PM, whoever is in the room.',
      // P2 is Flore's own copy, near-verbatim.
      //
      // "frame ideas in business terms" is KEPT here deliberately, though the
      // same phrase was corrected out of the hero. It is not the same claim:
      // there it described what the product IS, here it is the question the
      // project STARTED from — and the case study goes on to show that the
      // question was narrower than the real skill. Rewriting it for
      // consistency would erase that arc. If a future pass "fixes" this for
      // consistency with the hero, it is removing something load-bearing.
      'Designers are often judged not just by what they create — but by how convincingly they present it. This project began with a simple question: why do designers — despite strong storytelling skills — still struggle to gain influence in strategic conversations? And how might AI help them frame ideas in business terms and respond with confidence when challenged?',
    ],
    // PNG, not SVG — Flore's correction, 2026-08-12. With this one all five
    // page graphics are raster, so none of them can inherit a design token;
    // every colour in them is fixed at export time. Worth knowing before
    // anyone plans a token change expecting the artwork to follow.
    media: {
      kind: 'image',
      src: `${M}/what-is-pitchpivot.png`,
      label: '[ what-is-pitchpivot.png — 2330x517 ultra-wide explanatory banner ]',
      placeholderAspect: '2330 / 517',
      maxWidth: MEDIA_WIDTH.banner,
      alt: 'How PitchPivot turns a design rationale into business-framed language',
    },
  },

  why: {
    title: 'Why This Matters',
    body: [
      'Product design is a proven growth driver — yet it still struggles to gain influence in strategic decisions. Despite a $200 billion market, only 13 % of companies have a UX leader at the executive level. Design-led businesses grow 32 % faster, while poor UX contributes to 65 % of failed digital products.',
      'These numbers reveal a persistent gap between design impact and design influence. Designers create measurable value but often lack the visibility and vocabulary to express it. That’s the gap PitchPivot aims to close — helping designers communicate their impact with the clarity and confidence needed to earn that seat at the table.',
    ],
    sources: 'Sources: DesignRush, Flynn, McKinsey',
    // Green for the two figures that describe the opportunity, orange for the
    // two that describe the gap — the split Figma draws (cards 1-2 vs 3-4).
    stats: [
      { value: '+32 %', label: 'revenue growth', tint: 'green' },
      { value: '$200 B', label: 'design market', tint: 'green' },
      { value: 'Only 13 %', label: 'UX leaders at executive level', tint: 'orange' },
      { value: '65 %', label: 'product failures due to poor UX', tint: 'orange' },
    ],
  },

  turningPoint: {
    title: 'The Turning Point: What User Research Revealed',
    note: 'I assumed designers needed help presenting. The research said they needed help framing their designs better and responding to tough questions by non-designers.',
    quotesLabel: 'User Interview Quotes',
    quotes: [
      {
        quote:
          "I get nervous when I'm presenting to non-designers — they start asking business questions I can't always answer.",
        attribution: 'Product designer, fintech',
      },
      {
        quote:
          "The hardest part is not the slides, it's when someone challenges your work and you don't know how to respond right away.",
        attribution: 'Design lead, SaaS',
      },
      {
        quote:
          "It's frustrating when good design ideas get rejected because they're not linked to business goals.",
        attribution: 'Senior designer, agency',
      },
    ],
  },

  features: {
    title: 'The Two Core Features',
    items: [
      {
        title: 'Impact Framing',
        body: 'AI analyzes design text and translates UX jargon into clear, business-oriented language, highlighting measurable outcomes so designers can communicate value beyond usability or visuals.',
        media: {
          kind: 'video',
          src: `${M}/impact-framing.mp4`,
          poster: `${M}/impact-framing-poster.png`,
          label: '[ impact-framing.mp4 — 1432x1660 portrait screencast ]',
          placeholderAspect: '1432 / 1660',
          maxWidth: MEDIA_WIDTH.feature,
          alt: 'The Impact Framing exercise rewriting a design rationale in business terms',
          caption: "'Impact Framing' state 28.10.25",
        },
      },
      {
        title: 'Pushback Pivot',
        body: 'Simulates tough stakeholder questions based on audience type — from executives to PMs. AI prompts designers to practice confident, structured responses and strengthen their reasoning.',
        media: {
          kind: 'video',
          src: `${M}/pushback-pivot.mp4`,
          poster: `${M}/pushback-pivot-poster.png`,
          label: '[ pushback-pivot.mp4 — 1432x1660 portrait screencast ]',
          placeholderAspect: '1432 / 1660',
          maxWidth: MEDIA_WIDTH.feature,
          alt: 'The Pushback Pivot exercise generating a challenging question for a chosen audience',
          caption: "'Pushback Pivot' state 28.10.25",
        },
      },
    ],
  },

  takeaways: {
    title: 'Takeaways',
    // REORDERED per BUILD v3, and the order is the argument: what the product
    // must become (01), why good UX wasn't enough (02), then the part a tool
    // can't fix and where the next version aims (03). Figma still has these in
    // the old order and mis-numbered (01, 02, 01).
    //
    // TWO SURVEYS, NOT ONE — corrected 2026-08-14 after Flore supplied the
    // opening survey's audience profile. There was an opening survey before
    // the talk and a closing one after the tool was tried, and they have
    // DIFFERENT sample sizes:
    //
    //   opening   27 participants   19 UX/UI designers, 3 design leaders,
    //                               3 other product roles, 1 PM, 1 researcher
    //                               (role counts and company-size counts both
    //                               total 27, so 27 is solid)
    //   closing   24 participants
    //
    // Every chart below previously carried one shared `n=24` source line. That
    // was wrong for 03: "Blockers to design influence" asks about the
    // respondent's working life, not about PitchPivot, so it can only be an
    // OPENING-survey question and its denominator is 27. 01 and 02 are both
    // about using the tool, so they are the closing survey and stay at 24.
    //
    // ONE SURVEY PER CHART still holds — it just needs the right survey named
    // on each. That is why the "Maybe" figure sits in 01's prose rather than
    // in its chart: same survey, different question from the barrier counts.
    //
    // UNVERIFIED: the 24 is inherited from the previous version of this file,
    // not read off the closing-survey PDF (no PDF text extractor on the
    // machine — see the note on the "Maybe" line below). It is consistent with
    // everything here, but it has not been checked at source.
    items: [
      {
        index: '01',
        // RETITLED 2026-08-14. Was "The product has to fit the workflow and
        // outperform a prompt." — which states workflow fit as the LESSON, and
        // the body now explicitly says the opposite: Flore knew a workflow-
        // native tool was stronger before testing, and chose standalone on
        // scope. Title and body were arguing with each other.
        //
        // This version claims the thing the research actually established: a
        // tool outside the workflow gets no grace period. It also recovers
        // "earn its place in the first minute", cut from the body in the same
        // pass as a duplicate — so the line is reused rather than lost, and
        // there is no repetition, since the body no longer carries it.
        //
        // Matches the claim-shaped full sentences of takeaways 02 and 03.
        title: 'A tool in its own tab has to earn its place in the first minute.',
        body: [
          // REFRAMED 2026-08-14. This read "Users questioned both the
          // standalone format and the differentiation from ChatGPT, pointing
          // toward deeper workflow integration and domain-specific coaching as
          // the real opportunity." Two problems, both Flore's calls:
          //
          //  1. It flattened a specific objection into a category, and stated
          //     it so flatly that a reader couldn't tell whether it was what
          //     users said or what the case study concluded. It read as a
          //     concession. The objection is kept — every reader of an AI side
          //     project forms it within seconds, so naming it first is a
          //     credibility move — but it is now clearly a PERCEPTION, and the
          //     gap between what the tool does and what people saw in one short
          //     session becomes the actual finding.
          //
          //  2. NO COMPETITOR BRAND NAMES on the site. "a general-purpose
          //     chatbot" carries the same meaning without putting someone
          //     else's product in Flore's portfolio. Note the contrast is doing
          //     real work here: "general-purpose" is precisely what PitchPivot
          //     is not, so the phrase sets up the structure argument that
          //     follows. `welcome-to-my-city.mdx` still names Claude Code, and
          //     deliberately — that's a built-with credit, not a competitor.
          //
          // The product description is drawn from this file's own `features`
          // section (Impact Framing, Pushback Pivot) rather than restated, so
          // it can't drift from what the page shows further up.
          //
          // UNVERIFIED: "asked what it gave them that a general-purpose chatbot
          // wouldn't" is a reshaping of the finding's FRAMING, not of the
          // finding. The underlying free-text responses haven't been read (no
          // PDF extractor on the machine). If people put it more bluntly or
          // more narrowly than this, the sentence should follow them.
          // TIGHTENED 2026-08-14 — four paragraphs to three, ~40 % shorter.
          //
          // The bloat was one beat stated three times: "structure wasn't
          // landing fast enough", "has to earn its place in the first minute.
          // It didn't", and "six minutes on a phone is not enough to earn a
          // yes" were all the same point. It now appears once, in this
          // paragraph, carrying the concrete detail (six minutes, a phone) that
          // was previously stranded two paragraphs away from the claim it
          // explained.
          //
          // "a chosen audience" rather than "a specific audience" — it matches
          // this file's own `features` copy, where Pushback Pivot works "based
          // on audience type", so the reader meets the same idea in the same
          // words twice.
          'Users questioned the standalone format, and asked what it gave them that a general-purpose chatbot wouldn’t. What makes PitchPivot more than a prompt is its structure — a guided reframe, and pushback rehearsed against a chosen audience — and in six minutes on a phone, that never got the chance to show.',
          // THE TRADEOFF PARAGRAPH — added 2026-08-14, and it replaces a
          // sentence I had cut ("The opportunity is deeper workflow integration
          // and domain-specific coaching") on the grounds that the takeaway's
          // title already said it. Flore's correction: the title states
          // workflow integration as a FINDING, which is the framing she
          // objects to. She knew a workflow-native tool was the stronger answer
          // before testing; standalone was a scope decision, not an oversight.
          //
          // That distinction is the whole point of this paragraph. "Users said
          // it should fit the workflow, so that's next" reads as learning
          // something obvious late, which is simultaneously less critical AND
          // less flattering. Naming the tradeoff, then letting the research
          // price it, is what shows judgment.
          //
          // "It didn't." is deliberately blunt and deliberately last — Flore
          // asked to be more critical without dismissing the project. It is a
          // verdict on ONE design decision, and it can afford to be hard
          // because the sentences before it establish she saw the cost coming.
          //
          // NOT CLAIMED HERE: that the project was solo. The Role line still
          // carries a `REVIEW —` marker because that was inferred, not sourced,
          // so this says "a five-week project" instead. The five weeks are
          // real — see the Process note.
          // "The test didn't teach me that — it priced it." replaces a longer
          // close that ended on a bare "It didn't." Shorter, and it carries the
          // criticality better: the blunt version was a second statement of the
          // failure already described above, while this states the RELATIONSHIP
          // between the decision and the research, which is the actual point.
          'None of that was a surprise. A tool living inside the design workflow was always the stronger answer; I built standalone because a five-week project makes integration a build problem before it is a design one. The test didn’t teach me that — it priced it.',
          // COUNT, NOT PERCENTAGE — Flore's call, 2026-08-14. This read
          // "Sixty-three per cent said they would maybe use it again". On 24
          // people a percentage claims a precision the sample cannot carry,
          // and spelling it out made it sound more survey-grade still.
          //
          // UNVERIFIED: 15 is derived, not read off the closing survey —
          // 15/24 = 62.5 %, which is what the old 63 % rounds from. The
          // machine has no PDF text extractor (`brew install poppler` would
          // fix it), so this is the arithmetic that fits rather than the
          // figure at source. Worth one look at the closing survey before
          // this ships; if the real count is 14 or 16 only this line changes.
          // Merged with the tie paragraph below. Both are closing-survey
          // findings sitting directly above the closing-survey chart, so they
          // were two paragraphs doing one job.
          //
          // Dropped: "the honest read is that six minutes on a phone in a noisy
          // room is not enough to earn a yes" (the six-minutes point now lives
          // in the first paragraph, where it explains the structure failing to
          // land) and "The number is a signal to design for, not a verdict"
          // (stance rather than content, and the tradeoff paragraph above now
          // makes the same don't-over-read-it case more concretely).
          //
          // Also dropped: "— the first is takeaway 02". The tie itself has to
          // stay, since two bars at 9 with only one accented would otherwise
          // imply a ranking the data doesn't have. But the forward pointer is
          // redundant: takeaway 02 opens by picking the other barrier up
          // ("That other joint-top barrier — generic output — shows up in the
          // scores too"), so the handoff is already made from the far side.
          // If that opening line is ever edited, restore the pointer here.
          // Names the tie rather than leaving the chart to imply a ranking it
          // does not have. "Output too generic" and "Doesn't fit my workflow"
          // are both 9, so the accent bar was silently picking a winner
          // between two equal bars — and the grey one then turned up as the
          // headline of takeaway 02, which read as a contradiction. Saying it
          // out loud turns that into a handoff. Flore's note, 2026-08-14.
          'Asked whether they would use it again, 15 of the 24 said maybe. Two barriers came back in equal measure: the output felt too generic, and the tool did not fit an existing workflow — this takeaway is about the second.',
        ],
        chart: {
          caption: 'Barriers to adoption',
          items: [
            { label: 'Output too generic', value: 9 },
            // The emphasised bar: workflow fit is the barrier that reframes the
            // product, and it's what takeaway 01 is about.
            //
            // NOTE THE TIE — this bar and the one above it are both 9, so the
            // accent is NOT marking "the biggest barrier"; it marks which of
            // two equal barriers this takeaway follows. That is only legible
            // because the body copy now says so. If the copy ever loses that
            // sentence, the emphasis goes back to implying a ranking that
            // isn't in the data.
            { label: 'Doesn’t fit my workflow', value: 9, emphasis: true },
            { label: 'Already handle this differently', value: 7 },
            { label: 'Don’t trust the output', value: 6 },
          ],
          // Closing survey, and named as such now that the page cites two.
          // "n=" dropped for plain language — Flore's call, 2026-08-14: the
          // readers are design managers and HR, so the notation costs more
          // than it saves. "each" (not "allowed") is what explains why these
          // four bars sum to 31 across 24 people.
          source: 'Friends of Figma Zurich, May 2026 — closing survey, 24 participants, multiple answers each.',
        },
      },
      {
        index: '02',
        title: "Good UX couldn't compensate for generic AI.",
        body: [
          // Opens by picking up 01's handoff, so the two takeaways read as one
          // argument in two parts rather than as the same finding twice.
          'That other joint-top barrier — generic output — shows up in the scores too. Ease of use scored 8.2/10, while output usefulness scored only 5.5/10. The next design challenge shifted from interface usability to gathering enough context for genuinely specific advice.',
        ],
        chart: {
          caption: 'Tool quality',
          items: [
            { label: 'Ease of use', value: 8.2, max: 10 },
            // The emphasised bar: the score that undercuts the interface work.
            { label: 'Output relevance', value: 5.5, max: 10, emphasis: true },
          ],
          source: 'Friends of Figma Zurich, May 2026 — closing survey, 24 participants, average score out of 10.',
        },
      },
      {
        index: '03',
        // REFRAMED FORWARD per BUILD v3, from the frame's "The problem is real,
        // but narrower than initially assumed" — which ended the page on what
        // the product doesn't do. This ends it on direction.
        title: "A tool can't fix org politics — which is where the next version has to aim.",
        body: [
          // Was "Designers struggle with framing and pushback…". Corrected
          // 2026-08-14: this chart is the OPENING survey, and that room was
          // not all designers — 19 of 27 were UX/UI designers, the rest design
          // leaders, product managers and other product roles. Attributing the
          // finding to "designers" claimed more than the sample supports.
          //
          // The mix is stated rather than hidden because it makes the finding
          // STRONGER: "organisational politics blocks design influence" is a
          // more credible claim when the product people in the room say it too
          // than when only designers do.
          // COMPOSITION STATED HERE AND NOWHERE ELSE — Flore's call,
          // 2026-08-14, after weighing whether to give sample context on every
          // chart. Only this one: who answered changes how this number READS
          // (designers reporting their own frustration is weaker evidence than
          // product people agreeing), whereas 01 and 02 are about people who
          // had just used the tool, where job title changes nothing. Stating it
          // everywhere would invite the reader to hunt for a significance that
          // isn't in a 24-person sample.
          //
          // COMPANY SIZE is in here for a reason beyond describing the sample:
          // 13 of the 27 work at 200+ companies, where politics is
          // structurally heavier. That corroborates the finding rather than
          // just qualifying it. Prose, not a fourth chart — a data display
          // about the sample would compete with the three that carry the
          // actual argument.
          'Framing and pushback are real struggles, but “stakeholder buy-in” also depends heavily on organizational politics that a tool can’t solve. This came from the room before anyone had seen the tool — 27 people, 19 of them UX/UI designers and the rest design leaders, product managers and other product roles, and 13 of the 27 at companies of 200 or more.',
          'That is the tallest bar below, and it is the one the current product doesn’t touch. The next version has to work where those conversations actually happen — in the room, with the decision-makers, not in a separate tab.',
        ],
        chart: {
          caption: 'Blockers to design influence',
          items: [
            // The emphasised bar is deliberately the LARGEST one here, and the
            // one the product does not solve. That inversion is the point.
            { label: 'Organizational politics', value: 17, emphasis: true },
            { label: 'Data & ROI', value: 11 },
            { label: 'Challenged in the moment', value: 7 },
            { label: 'Wrong decision-makers in the room', value: 6 },
            { label: 'Confidence', value: 6 },
          ],
          // OPENING survey, 27 — not the 24 this shared with the other two
          // charts before. See the two-survey note at the top of `takeaways`.
          source: 'Friends of Figma Zurich, May 2026 — opening survey, 27 participants, multiple answers each.',
        },
      },
    ],
  },

  process: {
    title: 'The Process — Exploring AI in the Design Workflow',
    note: 'I created this project during the 5-week “AI for Designers”, exploring how AI can enhance the creative process. Each week followed a design-sprint rhythm: from research insights to AI-powered prototyping and testing. The process was an experiment in collaboration — using AI not just as a tool, but as a partner that challenged assumptions and sped iteration.',
    // PNG, not SVG — Flore's correction, 2026-08-12.
    //
    // This drops one requirement from the asset contract rather than deferring
    // it: the contract asked that this graphic "pick up the accent token, not a
    // baked-in colour". A raster image cannot. There is no mechanism by which a
    // PNG inherits a CSS custom property, so the accent has to be baked in at
    // export time, and it will not follow if the token ever changes. Called out
    // in the handover rather than left as a silent gap.
    media: {
      kind: 'image',
      src: `${M}/momentum-curve.png`,
      label: '[ momentum-curve.png — 2880x2048 weekly momentum curve ]',
      placeholderAspect: '2880 / 2048',
      maxWidth: MEDIA_WIDTH.curve,
      alt: 'Weekly project momentum across the five-week course, rising through prototyping and dipping during testing',
    },
  },

  onward: {
    heading: 'Next',
    slug: 'artifakt',
    contact: {
      prompt: 'Curious about how this was built, or want to talk about something similar?',
      cta: 'Say hi',
    },
  },
}
