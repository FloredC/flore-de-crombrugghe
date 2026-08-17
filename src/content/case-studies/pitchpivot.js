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
      'A tool that helps designers reframe design decisions so they answer real business needs, and prepare for the tough questions before they’re asked.',
    // Flore's own wording, 2026-08-14 — this was a `REVIEW —` placeholder
    // reading "Solo project: research, PRD, product design, build. Oct 2025."
    // which was inferred, not sourced, and was visible on the live page.
    //
    // The date is dropped rather than carried over: it already appears on the
    // homepage card ("Oct 2025 — ...") in projects/pitchpivot.mdx, and a Role
    // line answers "what did you do", not "when".
    role: '0→1 designer, from research to final product',
    // Re-added 2026-08-14 at Flore's request. It was briefly dropped on the
    // grounds that the homepage card already carries "Oct 2025 —"; her call is
    // that the date matters enough to repeat on the page itself.
    date: 'Oct 2025',
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
      label: '[ hero.png — 1798x2234 portrait product screenshot ]',
      placeholderAspect: '1798 / 2234',
      maxWidth: MEDIA_WIDTH.hero,
      alt: 'The PitchPivot Pushback Pivot panel: a presentation context, four audience types, and a generated challenge question',
    },
  },

  what: {
    title: 'What is PitchPivot',
    body: [
      // ORDER REVERSED 2026-08-14, Flore's call: the observation and the
      // origin question open the section, and the product description follows.
      // Her earlier structure ran the other way round.
      //
      // P1 is Flore's own copy, near-verbatim. "frame ideas in business terms"
      // is KEPT here deliberately, though the same phrase was corrected out of
      // the hero: there it described what the product IS, here it is the
      // question the project STARTED from, and the case study goes on to show
      // that question was narrower than the real skill. Don't "fix" it for
      // consistency — that erases the arc.
      'Designers are often judged not just by what they create — but by how convincingly they present it. This project began with a simple question: why do designers — despite strong storytelling skills — still struggle to gain influence in strategic conversations? And how might AI help them frame ideas in business terms and respond with confidence when challenged?',
      // P2 EXPANDS the hero one-liner rather than repeating it, carrying what
      // the hook has no room for: the substance-not-vocabulary point, and the
      // two exercises, which set up the `features` section.
      'PitchPivot helps designers rethink and reframe design decisions so that they answer real business needs — not just by rewording them, but by connecting them to what the business is actually trying to solve. It then helps them anticipate the questions those decisions will attract, and rehearse the answers against the audience they will be facing: an executive, a PM, whoever is in the room.',
    ],
    // PNG, not SVG — Flore's correction, 2026-08-12. With this one all five
    // page graphics are raster, so none of them can inherit a design token;
    // every colour in them is fixed at export time. Worth knowing before
    // anyone plans a token change expecting the artwork to follow.
    media: {
      kind: 'image',
      src: `${M}/what-is-pitchpivot.png`,
      label: '[ what-is-pitchpivot.png — 5128x1628 explanatory banner ]',
      placeholderAspect: '5128 / 1628',
      maxWidth: MEDIA_WIDTH.banner,
      alt: 'A design idea, “Added micro-interactions for a smoother, more responsive feel”, reframed into business-focused outcomes — higher user satisfaction and lower perceived wait time — with a coaching note to quantify outcomes and link design effects to measurable impact',
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
    // Added 2026-08-14: the section had no method paragraph at all, so three
    // quotes arrived with nothing saying who was interviewed or how many.
    //
    // Sentence 1 is fact: five interviews (Flore), and the roles/industries are
    // read off the three quote attributions below.
    // Sentence 2 is INFERRED from the quotes' subject matter, not sourced.
    // Needs Flore's confirmation or her own wording.
    // RESTRUCTURED 2026-08-14, Flore's diagnosis: the paragraph and the bubble
    // were both first person, breaking the rule that only the bubble speaks as
    // "I" — and the section's most important content (the assumption being
    // overturned) was sitting in the bubble, which is an ASIDE device: small,
    // right-aligned, illustrated, read as a margin note.
    //
    // The split: main text carries the FINDING, bubble keeps the personal
    // ADMISSION. That solves the "can't write about assumptions in third
    // person" problem by not trying to — the prose states what the research
    // found, which is third person, and the bubble says "I was wrong", which
    // is the one thing only a first-person aside can do.
    //
    // The bubble is also now two lines instead of seven, which is the other
    // half of Flore's note: a long bubble is hard to read at that size and
    // alignment. Shortening it was the fix, not moving it.
    body: [
      // CORRECTED 2026-08-14. This said "individual contributors through to
      // design leads in fintech, SaaS and agency teams" — invented, in the
      // worst way: I derived it from the three `quotes` attributions below
      // rather than from anything Flore said. She interviewed NO design leads.
      // Real spread, her words: three senior product designers plus a couple of
      // juniors. Industries dropped entirely, same bad source.
      //
      // SEE THE NOTE ON `quotes` BELOW — the attributions this came from are
      // themselves unconfirmed, and one of them contradicts this sentence.
      'Five interviews, three with senior product designers and two with junior designers, moved the problem somewhere else. The difficulty wasn’t presenting: it was framing a decision so that it answered a business question in the first place, and holding that framing when a non-designer pushed back.',
    ],
    note: 'I went in convinced this was a presentation problem. It wasn’t.',
    // "Design lead, SaaS" was Figma placeholder text -- Flore interviewed no
    // design leads. Corrected to "Senior product designer, SaaS", her wording,
    // 2026-08-14. The other two she did not flag, so they stand.
    //
    // Quote TEXT is participant wording and stays verbatim.
    quotes: [
      {
        quote:
          "I get nervous when I'm presenting to non-designers — they start asking business questions I can't always answer.",
        attribution: 'Product designer, fintech',
      },
      {
        quote:
          "The hardest part is not the slides, it's when someone challenges your work and you don't know how to respond right away.",
        attribution: 'Senior product designer, SaaS',
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
        // Flore's own copy, 2026-08-14, verbatim apart from a closing full stop
        // to match the second feature.
        body: 'Detect UX jargon and translate your design reasoning into clear, outcome-focused business language — before the meeting.',
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
        // Flore's own copy, 2026-08-14, verbatim.
        body: 'Practice responding to challenging questions from specific stakeholder types — so you’re never caught off guard.',
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
    // A closing visual for the section, added 2026-08-14. Sits after both
    // FeatureBlocks rather than beside either: it shows the audience types
    // Pushback Pivot rehearses against, so it belongs to the pair, not to one.
    //
    // The "Data-Driven Product Mangaer" typo in the first export was fixed by
    // Flore on 2026-08-14 and verified against the pixels, not the timestamp.
    visual: {
      kind: 'image',
      src: `${M}/pushback-pivot-visual.png`,
      label: '[ pushback-pivot-visual.png — 5128x1624 stakeholder question banner ]',
      placeholderAspect: '5128 / 1624',
      alt: 'Four stakeholder types linked by a winding line, each asking a different question: a skeptical executive asking “What’s the ROI?”, a pragmatic technical lead asking “Any performance impact?”, a data-driven product manager asking “Can we measure this?”, and a budget-focused stakeholder asking “Is it worth the effort?”',
    },
  },

  takeaways: {
    title: 'Takeaways',
    // Added 2026-08-14 at Flore's request: the charts above are all from the
    // Friends of Figma event, but that was the SECOND round of testing, and
    // nothing on the page said so. Without this the reader assumes one study.
    //
    // First person, because it is a Guide bubble (that is the rule), and short,
    // because a long bubble is hard to read at that size and alignment.
    //
    // The first round is named but not detailed — Flore's call: "not worth
    // noting down too concretely". Its findings (missed "Generate Example"
    // button, unclear link between exercises) stay out.
    //
    // THE PRODUCT DIDN'T CHANGE, THE LANDSCAPE DID — Flore's correction. An
    // earlier draft said "on a product that had changed a lot since", which was
    // wrong and also the less interesting claim. What moved between the two
    // rounds was the AI tooling around it, and with it what people expected.
    // That is a real caveat on the closing survey's 5.5 output-relevance score:
    // the same output is judged against a higher bar six months on.
    //
    // "seven months" — corrected from six by Flore, and it matches the dates:
    // Oct 2025 build, 20 May 2026 event.
    note: 'I tested twice: think-aloud sessions with four designers right after building it, then these numbers at a Friends of Figma event seven months on. The AI landscape had changed, and expectations with it.',
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
    // VERIFIED 2026-08-14 against both source PDFs and the Mentimeter results.
    // Closing survey: "Respondents: 24 (23/24 answered most questions)".
    // Opening survey: "Respondents: 28 (27/28 answered most questions)" -- 27
    // answered the role, company-size and blockers questions, which is why the
    // opening-survey figures on this page are out of 27, not 28.
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
        // Retitled with the theme split: the old title's "first minute" was about
        // session length, which now belongs to 02.
        title: 'It has to live where the work already happens.',
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
          // VERIFIED 2026-08-14. The closing survey's open answers contain, in
          // a participant's own words: "What would be main differentiator if I
          // paste idea into ChatGPT by saying 'you are a skeptical
          // stakeholder'?" -- so the objection is real and almost this
          // sentence. Another wrote "Integrated into my workflow, not a
          // standalone application", which is the standalone half.
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
          // ONE THEME PER TAKEAWAY -- Flore, 2026-08-14. 01 is workflow, 02 is
          // specificity, and neither borrows the other's material. Cut from
          // here: the chatbot question and the structure explanation (both
          // differentiation, so they moved to 02) and the phone/session
          // conditions (now stated once, in 02, where the score they qualify
          // lives). "joint-top" does the work the old tie paragraph did.
          'Workflow fit was the joint-top barrier: nine of the twenty who hesitated said it did not fit how they already work. A tool in its own tab has to be opened on purpose, and it competes with everything already open.',
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
          // NOT CLAIMED HERE: that the project was solo. Flore's confirmed
          // Role is "0→1 designer, from research to final product", which says
          // scope, not headcount — so this still says "a five-week project"
          // rather than "solo". The five weeks are real, see the Process note.
          // "The test didn't teach me that — it priced it." replaces a longer
          // close that ended on a bare "It didn't." Shorter, and it carries the
          // criticality better: the blunt version was a second statement of the
          // failure already described above, while this states the RELATIONSHIP
          // between the decision and the research, which is the actual point.
          // THIRD PERSON, and forward-looking — Flore, 2026-08-14. This was
          // "I built standalone because a five-week project makes integration a
          // build problem... The test didn't teach me that, it priced it."
          // First person belongs to the Guide bubbles, and there is already one
          // at the top of this section.
          //
          // "None of that was a surprise" still does the important work: it
          // stops the paragraph reading as though workflow integration were a
          // lesson learned late. The scope constraint is named without "I", and
          // the paragraph now ends on the priority rather than on the verdict.
          'None of that was a surprise. A tool living inside the design workflow was always the stronger answer; a five-week scope made standalone the only buildable option.',
          // COUNT, NOT PERCENTAGE — Flore's call, 2026-08-14. This read
          // "Sixty-three per cent said they would maybe use it again". On 24
          // people a percentage claims a precision the sample cannot carry,
          // and spelling it out made it sound more survey-grade still.
          //
          // VERIFIED 2026-08-14 against the closing-survey PDF's Tool Intent
          // table: Yes 4, Maybe 15, No 5, totalling the 24 respondents. The 15
          // was originally derived by arithmetic from the old "63 %"; it
          // happened to be exactly right, but it was luck, not method.
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
          // The "would you use it again" figure moved to takeaway 02 (Flore,
          // 2026-08-14). It answers a different question from the barrier
          // counts, and it is evidence for 02's claim — good UX not converting
          // — rather than for this one. What stays here is the tie, which has
          // to sit next to the chart it explains.
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
            // "I would need to trust it more first" in the survey — a bar to
            // clear, not a rejection. The old label, "Don't trust the output",
            // overstated those six people.
            { label: 'Would need to trust it more', value: 6 },
          ],
          // DENOMINATOR CORRECTED 2026-08-14 against the closing-survey PDF:
          // this question is headed "Barriers to Adoption (if Maybe or No,
          // n=20)". It was NOT asked of all 24 — only of the 20 who said maybe
          // or no. The line said "24 participants", which made every bar read
          // against the wrong base (9 of 20 is 45%, not 9 of 24).
          //
          // FOUR BARS OF SIX, and that is deliberate — Flore's decision,
          // 2026-08-14, not an oversight. The closing-survey PDF also lists
          // "Something else" (4) and "I do not present often enough" (2).
          // Both stay out: the first is a non-answer, and the second describes
          // people outside the problem the product addresses rather than a
          // barrier to adopting it. Do not "restore" them for completeness.
          source: 'Friends of Figma Zurich, May 2026. Closing survey, asked of the 20 who said maybe or no, multiple answers each.',
        },
      },
      {
        index: '02',
        title: "Good UX couldn't compensate for generic AI.",
        body: [
          // WHAT TO DO WITH THE STATS: the full Yes/Maybe/No split, in prose,
          // here rather than as a fourth chart.
          //
          // The closing-survey PDF's Tool Intent table is Yes 4, Maybe 15,
          // No 5. Giving all three is more useful than the Maybe count alone —
          // "only four said yes" is the part that actually lands, and it is the
          // evidence for this takeaway's claim that good UX didn't convert.
          // Three numbers don't need a chart, and 02 already carries one.
          // QUESTION WORDING CORRECTED 2026-08-14 against the closing-survey
          // Mentimeter (slide 4). This said "whether they would use it again",
          // which is a different question: "again" implies they had adopted it
          // and might return. What was actually asked is forward intent for a
          // specific upcoming occasion, which is a fairer thing to report and
          // makes the four Yes votes mean more.
          // Opens by picking up 01's handoff, so the two takeaways read as one
          // argument in two parts rather than as the same finding twice.
          'Only four of the 24 would use it before their next stakeholder buy-in; fifteen said maybe. Ease of use scored 8.2 out of 10, output relevance only 5.5: the interface worked, what it produced did not. Nine of the twenty who hesitated called the output too generic, and one asked outright what the tool gave them that a chatbot prompt would not.',
          // CUT 2026-08-14. There was a second paragraph here on testing
          // conditions ("Everyone tested on a phone, in a room, in six
          // minutes..."). It raised a caveat and then dismissed its own caveat,
          // so it cost ~43 words to leave the reader exactly where the
          // paragraph above had already left them. An earlier draft of it was
          // worse still — it argued the 5.5 was measured unfairly, which is a
          // claim no desktop data supports.
          //
          // NOTE: the phone / six-minutes detail now appears NOWHERE on the
          // page. That is deliberate, not an oversight — takeaway 01 no longer
          // carries it either, since 01 and 02 were separated by theme. If it
          // is ever wanted back, it belongs in one place only.
          // THE FORMAT CAVEAT — added 2026-08-14 after Flore asked whether
          // testing on phones was a mistake worth owning.
          //
          // Deliberately NOT written as a mistake. Testing live at a talk means
          // phones; the alternative was not the same test on desktop, it was no
          // test with 24 people. The honest finding is that the format answered
          // one question well and the other badly, and that knowing which of
          // your own numbers to trust is the actual skill. That reads as
          // stronger judgment than an apology would.
          //
          // Third person, per the rule that first person belongs in the Guide
          // bubbles only.
        ],
        chart: {
          caption: 'Tool quality',
          items: [
            { label: 'Ease of use', value: 8.2, max: 10 },
            // The emphasised bar: the score that undercuts the interface work.
            { label: 'Output relevance', value: 5.5, max: 10, emphasis: true },
          ],
          source: 'Friends of Figma Zurich, May 2026. Closing survey, 24 participants, average score out of 10.',
        },
      },
      {
        index: '03',
        // REFRAMED FORWARD per BUILD v3, from the frame's "The problem is real,
        // but narrower than initially assumed" — which ended the page on what
        // the product doesn't do. This ends it on direction.
        // NO ROADMAP LANGUAGE — Flore is not continuing the product (2026-08-14).
        // This read "which is where the next version has to aim", which promised
        // work that isn't happening. The finding stands on its own without it.
        title: "The biggest blocker is the one no tool reaches.",
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
          // ONE PARAGRAPH, 2026-08-14. The second one was cut: it made the
          // "no tool solves this" claim a THIRD time, after the title and after
          // this paragraph's own opening. Its one irreplaceable line —
          // "arguably not in a tool at all" — was folded in here.
          //
          // Reordered so the FINDING leads. Cutting the second paragraph alone
          // would have left this one opening on "framing and pushback are real
          // struggles" and spending most of its words on who answered, which
          // buries the point under the sample description.
          'Organizational politics was the top blocker by a wide margin, and it is the one thing the product does not touch. Those conversations happen in the room, with the decision-makers. Arguably not in a tool at all.',
          'That answer came from 27 people before any of them had seen it: 19 UX/UI designers, the rest design leaders, product managers and other product roles, 13 of them at companies of 200 or more.',
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
          // "max 2", not unlimited — the PDF heads this "Biggest Blockers to
          // Influence (max 2, n=27)". "multiple answers each" implied people
          // could pick everything, which would make the 17 mean something
          // different. 28 responded to the opening survey overall; 27 answered
          // this question.
          source: 'Friends of Figma Zurich, May 2026. Opening survey, 27 responses, up to two blockers each.',
        },
      },
    ],
  },

  process: {
    title: 'The Process — Exploring AI in the Design Workflow',
    // SHORTENED 2026-08-14, 57 words to 41. This is the longer of the two
    // Guide notes and so the one that sets how tall the bubble gets — see the
    // note on MEASURE.guideBubble in caseStudyLayout.js, which flags exactly
    // this note as the one to judge the cap against.
    //
    // Cut: "exploring how AI can enhance the creative process" (generic, and
    // the sentence that follows shows the how) and "The process was an
    // experiment in collaboration" (a label for the point rather than the
    // point). The weekly rhythm survives in compressed form because the
    // momentum curve directly below is a chart OF that rhythm, so the prose
    // only has to name it, not describe it.
    //
    // Kept deliberately: first person and the partner-not-tool contrast, which
    // is the only claim here that isn't just course logistics.
    // THE FACTS GO IN `body`, THE REFLECTION STAYS IN THE BUBBLE — 2026-08-14.
    // The note used to open "I built this over five weeks on the AI for
    // Designers course, a design-sprint rhythm each week...", which the new
    // paragraph below now says. Same duplication problem takeaways 01 and 02
    // had. What is left here is the only thing that has to be first person.
    note: 'The real experiment was treating AI as a partner, not a tool: something that challenged assumptions instead of just executing them.',
    // Week names, dates and the curve's actual shape are read off the graphic
    // itself (momentum-curve.png), not from the old alt text -- which claimed
    // it dipped "during testing". It does not: the dip is at the end of week 1,
    // and the line climbs steeply from prototyping to the end.
    body: [
      'The project ran over five weeks on Patricia Reiners’ “AI for Designers” course, from mid-September to late October 2025, with one focus per week: research, insights, prototype, testing, reflection. The curve below plots momentum against how heavily AI tools were leaned on each week. It dips early, then climbs steeply from prototyping onward.',
    ],
    // PNG, not SVG — Flore's correction, 2026-08-12.
    //
    // This drops one requirement from the asset contract rather than deferring
    // it: the contract asked that this graphic "pick up the accent token, not a
    // baked-in colour". A raster image cannot. There is no mechanism by which a
    // PNG inherits a CSS custom property, so the accent has to be baked in at
    // export time, and it will not follow if the token ever changes. Called out
    // in the handover rather than left as a silent gap.
    // TWO ASSETS, 2026-08-14. Flore re-exported the chart and the "most used
    // tools" legend as separate files so they can be arranged differently by
    // screen size -- side by side on wide screens, stacked on narrow ones.
    // Neither carries a `maxWidth`: the grid in CaseStudy.jsx sizes them, at
    // the ~65/35 split Figma draws (node 4787:7879, 1282 wide overall).
    media: {
      kind: 'image',
      src: `${M}/momentum-curve.png`,
      label: '[ momentum-curve.png — 2896x2086 weekly momentum curve ]',
      placeholderAspect: '2896 / 2086',
      // Corrected 2026-08-14 against the image: the curve dips at the end of
      // week 1 and rises from prototyping on. The old text had it backwards.
      alt: 'Weekly project momentum across the five-week course, dipping at the end of week one and climbing steeply from prototyping to the end',
    },
    legend: {
      kind: 'image',
      src: `${M}/momentum-curve-legend.png`,
      label: '[ momentum-curve-legend.png — 1660x787 most-used-tools legend ]',
      placeholderAspect: '1660 / 787',
      alt: 'Most used tools: Notebook LM for research and synthesis, ChatGPT for ideation and writing, Perplexity for secondary research, Notion for documentation and reflection, and Lovable for prototyping and UI building',
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
