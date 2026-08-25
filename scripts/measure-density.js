/**
 * Vertical-density measurement harness.
 *
 * WHAT THIS IS FOR
 * The site has an open question about whether type, spacing and media are too
 * large on a laptop — see process-docs/vertical-density/vertical-density.md.
 * That work is postponed, and this script is the part of it that was worth
 * doing anyway: a way to get the SAME numbers before and after any change, so a
 * fix can be shown to have worked rather than asserted to have.
 *
 * HOW TO RUN IT
 * There is no build step and no dependency. Paste the whole file into the
 * browser console on any page of the site and it prints a table. It is a plain
 * script, not a module, so it also works through an automation tool's
 * "evaluate JavaScript" call — which is how the committed baseline was taken.
 *
 *     measureDensity()            // current viewport
 *     measureDensity({ json: 1 }) // machine-readable, for diffing
 *
 * Deliberately NOT a node/puppeteer script. That would mean a headless-browser
 * dependency in a repo that currently has four, to automate something that runs
 * in under a second by hand, and it would measure a browser nobody looks at.
 * The viewport matrix is small enough to step through manually.
 *
 * WHY IT MEASURES IN VIEWPORT UNITS
 * A height in px says nothing on its own: 884px is comfortable on a desktop
 * monitor and does not fit on a laptop. Every row is therefore reported as a
 * fraction of the CURRENT viewport height, which is the thing the open question
 * is actually about. `vh` in this output means "fraction of window.innerHeight",
 * not the CSS unit.
 *
 * WHAT IT DOES NOT DO
 * It does not judge. There is no pass/fail column, because the budget has not
 * been set yet (that is the first decision in the postponed plan, and it is
 * Flore's). Add a threshold here once a number exists.
 */

/* eslint-disable no-console */
function measureDensity(options = {}) {
  const vh = window.innerHeight
  const round = (n) => Math.round(n)
  const inVh = (n) => Number((n / vh).toFixed(2))
  const h = (el) => el.getBoundingClientRect().height

  const doc = document.documentElement
  const isCaseStudy = !!document.querySelector('[data-component="case-study"]')

  // The page's "chapters": the units a reader perceives as one thing, which is
  // what the open question is phrased in terms of.
  //
  // THREE SELECTORS, because the two case studies are genuinely built
  // differently and a single one silently returned zero rows on PitchPivot the
  // first time this ran — which would have put an empty table in the baseline
  // and looked like "nothing to see here":
  //
  //   Artifakt     `<section data-section>` — an ordered list of named sections.
  //   PitchPivot   top-level children of the article. It has no `data-section`;
  //                its structure is chapter <div>s grouping width-typed Blocks
  //                (see CaseStudy.jsx), so the child index and the block's
  //                `data-width` are the only identifiers available.
  //   Homepage     top-level `<section id>`.
  //
  // If a third case-study composition is added, check this returns rows for it
  // before trusting a baseline taken on it.
  let chapterEls
  if (isCaseStudy) {
    const article = document.querySelector('[data-component="case-study"]')
    const named = [...article.querySelectorAll('section[data-section]')]
    chapterEls = named.length ? named : [...article.children]
  } else {
    chapterEls = [...document.querySelectorAll('main section[id], body > * section[id]')]
  }

  const chapters = chapterEls
    .map((el, index) => ({
      // `data-width` is PitchPivot's only handle on a block; the index keeps
      // rows addressable when even that is absent.
      id: el.dataset.section || el.id || `${index}:${el.dataset.width || el.tagName.toLowerCase()}`,
      px: round(h(el)),
      vh: inVh(h(el)),
    }))
    // Wrapper elements with no height of their own are noise in the table.
    .filter((row) => row.px > 40)

  // Cards are measured separately from chapters: on the homepage a "section" is
  // several screens tall by design, and the thing Flore reported as not fitting
  // was the CARD, which is the unit a reader stops on.
  const cards = [...document.querySelectorAll('[data-component="project-card"]')].map((el) => {
    const media = el.querySelector('[data-component="project-media"]') || el.querySelector('img')?.closest('div')
    return {
      title: (el.querySelector('h2, h3')?.textContent || '').trim().slice(0, 28),
      px: round(h(el)),
      vh: inVh(h(el)),
      // The split is the whole point: it says which lever can move this card.
      // A card that is 70% media will not be fixed by a type change.
      mediaPx: media ? round(h(media)) : null,
      mediaPct: media ? Math.round((100 * h(media)) / h(el)) : null,
    }
  })

  // Resolved type sizes, so a run can be attributed to a scale rather than to
  // "whatever the config said that day". Read off real rendered elements
  // wherever possible — a probe element would miss any per-component override.
  const typeProbe = (cls) => {
    const el = document.querySelector(`.${CSS.escape(cls)}`)
    return el ? getComputedStyle(el).fontSize : null
  }
  const type = {
    display: typeProbe('text-display'),
    h1: typeProbe('text-h1'),
    h2: typeProbe('text-h2'),
    'body-lg': typeProbe('text-body-lg'),
    body: typeProbe('text-body'),
    'body-sm': typeProbe('text-body-sm'),
  }

  const result = {
    url: location.pathname,
    viewport: `${window.innerWidth}x${vh}`,
    docPx: doc.scrollHeight,
    docVh: Number((doc.scrollHeight / vh).toFixed(1)),
    type,
    chapters,
    cards,
    tallest: chapters.length
      ? chapters.reduce((a, b) => (b.vh > a.vh ? b : a))
      : null,
  }

  if (options.json) return JSON.stringify(result, null, 1)

  console.log(`\n${result.url}  @  ${result.viewport}`)
  console.log(`page: ${result.docPx}px = ${result.docVh} viewports`)
  console.log('type:', type)
  console.table(chapters)
  if (cards.length) console.table(cards)
  return result
}

// Attach for console use without shadowing anything if pasted twice.
if (typeof window !== 'undefined') window.measureDensity = measureDensity
