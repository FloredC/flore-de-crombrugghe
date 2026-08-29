import { useEffect, useRef, useState } from 'react'

/**
 * The reading engine behind the chapter nav and the progress line.
 *
 * Everything the two components need comes out of one pass: how far through
 * the article the reader is, which chapter they are in, and whether the nav
 * should be on screen at all. They are three answers to the same question --
 * "where is the reader?" -- so computing them together is what keeps them
 * from disagreeing (a nav that appears while the spy still says "Overview",
 * a bar that completes after the nav has gone).
 *
 * WHY NOT IntersectionObserver FOR THE ACTIVE CHAPTER
 *
 * IO is the right tool for a binary "is this on screen", and the obvious
 * approach -- observe each section against a thin band near the top -- does
 * not survive contact:
 *
 *  - The band has to be zero-height to mean "a line", and a zero-height root
 *    margin intersects nothing.
 *  - Give it real height and a section taller than the band leaves the band
 *    empty, so the callback stops firing while the reader is mid-chapter and
 *    the nav holds a stale answer.
 *  - Reading `entry.boundingClientRect` inside the callback only tells you
 *    where things were when the browser last computed the intersection, which
 *    on this page (>1MB of images settling in) is not where they are now.
 *
 * So: one rAF-coalesced scroll pass over CACHED offsets. Per frame it is five
 * comparisons and one division against numbers already in memory -- no layout
 * reads, no getBoundingClientRect, nothing that can force a reflow. The
 * measuring pass that fills the cache is the only thing that touches layout,
 * and it runs on mount, on resize, and whenever a ResizeObserver says the
 * document actually changed height (images, the pipeline diagram, fonts).
 *
 * That is genuinely lighter than an observer per section, and it cannot go
 * stale between events, which is the failure the observer version has.
 *
 * NO FLICKER, BY CONSTRUCTION. The active chapter is "the last anchor whose
 * top has passed the threshold line", which is monotonic in scroll position:
 * two boundaries close together cannot oscillate, because crossing one can
 * only ever move the answer forward. There is no hysteresis to tune.
 */

// How far BELOW the landing position the "you are reading this" line sits.
//
// Not decoration, and not a tuning knob. The threshold has to be strictly
// below where a clicked chapter comes to rest, or the click is a coin flip:
// land a heading exactly on the line and it is ambiguous whether it counts as
// passed, so clicking "Testing" could leave "Making it work" selected. 24px is
// the smallest gap that is unambiguous at every viewport size, and it is a
// spacing token rather than a free number.
const THRESHOLD_OFFSET = 24

// A viewport-height fraction is what the landing position IS (see the
// [data-chapter-anchor] rule in globals.css), so this fallback is only ever
// used if the element is measured before its stylesheet applies. Matches the
// clamp's lower bound rather than inventing a third number.
const FALLBACK_LANDING = 120

function clamp01(value) {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/**
 * @param {import('./chapters').ChapterConfig} config
 * @returns {{
 *   activeId: string,
 *   visible: boolean,
 *   fillRef: import('react').RefObject<HTMLElement>,
 * }}
 */
export default function useChapterProgress({ chapters, revealFrom, endAt }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? '')
  const [visible, setVisible] = useState(false)

  // The progress bar is driven through a ref rather than through state, and
  // that is the whole reason it can be a per-frame value: React re-rendering a
  // tree on every scroll frame to move a 3px line would be the "heavy scroll
  // calculation" this is supposed to avoid. `activeId` and `visible` DO go
  // through state, because they change a handful of times per page and their
  // change is what the nav needs to re-render for.
  const fillRef = useRef(null)

  // Cached page geometry, refilled by `measure()`. Everything in here is a
  // document-space offset, so it is only invalidated by the document changing
  // size -- not by scrolling.
  const metrics = useRef({ tops: [], revealTop: Infinity, endTop: Infinity, start: 0, span: 1, line: FALLBACK_LANDING })

  // The config arrives as an object literal from a module constant, but a
  // caller could just as easily inline one -- so depend on the identity of the
  // ids, not of the object, or the effect re-subscribes on every render.
  const chapterIds = chapters.map((chapter) => chapter.id).join(',')

  useEffect(() => {
    const ids = chapterIds.split(',')

    const measure = () => {
      const scrollY = window.scrollY
      const elements = ids.map((id) => document.getElementById(id))

      // THE THRESHOLD IS READ BACK FROM CSS, not restated here. `scrollMarginTop`
      // comes out of getComputedStyle already resolved to pixels -- the clamp
      // and the svh unit are gone by then -- so the one place that decides
      // where a chapter lands is the stylesheet, and this follows it. Restating
      // the clamp in JS is how the two would end up disagreeing after somebody
      // edits one of them.
      const first = elements.find(Boolean)
      const landing = first ? parseFloat(getComputedStyle(first).scrollMarginTop) : NaN
      const line = (Number.isFinite(landing) ? landing : FALLBACK_LANDING) + THRESHOLD_OFFSET

      const tops = elements.map((element) =>
        element ? element.getBoundingClientRect().top + scrollY : Infinity,
      )

      const endElement = document.getElementById(endAt)
      const endTop = endElement ? endElement.getBoundingClientRect().top + scrollY : Infinity

      // The reading range starts at the article, not at the first chapter: the
      // hero is part of the case study and the bar is visible from the top of
      // the page, so a range starting lower would show the reader as already
      // some way in before they had read anything.
      const article = document.querySelector('[data-component="case-study"]')
      const start = article ? article.getBoundingClientRect().top + scrollY : 0

      // ...and it ends where the article does, NOT at the bottom of the
      // document. Below `endAt` sit the contact block, the prev/next band and
      // the footer -- roughly a screen and a half of page-level chrome that is
      // not reading. Counting it would park the bar around 90% for the whole
      // ending, which reads as "you never finish".
      //
      // `- innerHeight` because the scroll position that brings the outro's top
      // to the BOTTOM of the viewport is the last moment that is still reading.
      // Completion therefore happens just before the nav hides, which is the
      // handover the design asks for.
      const span = Math.max(1, endTop - window.innerHeight - start)

      const revealIndex = ids.indexOf(revealFrom)
      metrics.current = {
        tops,
        revealTop: revealIndex === -1 ? Infinity : tops[revealIndex],
        endTop,
        start,
        span,
        line,
      }
    }

    const apply = () => {
      const { tops, revealTop, endTop, start, span, line } = metrics.current
      // The reader's "you are here" position in document space.
      const reading = window.scrollY + line

      if (fillRef.current) {
        const progress = clamp01((window.scrollY - start) / span)
        // scaleX rather than width: a transform is composited, so this does not
        // lay out or paint the page on a scroll frame. `origin-left` is set in
        // the component's classes; only the number is written here.
        fillRef.current.style.transform = `scaleX(${progress})`
      }

      let index = 0
      for (let i = 0; i < tops.length; i += 1) {
        if (reading >= tops[i]) index = i
      }
      setActiveId(ids[index])
      setVisible(reading >= revealTop && reading < endTop)
    }

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        apply()
      })
    }

    const remeasure = () => {
      measure()
      apply()
    }

    remeasure()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remeasure)
    // The page grows under us for seconds after mount -- the hero image, the
    // six process-log thumbnails, the pipeline diagram, the webfont. Every one
    // of those moves a section's offset, so the cache has to follow the real
    // event rather than be measured once and trusted. Same reasoning as
    // ScrollToHash in App.jsx, which learned it the hard way.
    const observer = new ResizeObserver(remeasure)
    observer.observe(document.body)
    // Late subresources that finish without changing body height still change
    // metrics (a font swap reflows text inside a fixed-height frame).
    window.addEventListener('load', remeasure)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remeasure)
      window.removeEventListener('load', remeasure)
      observer.disconnect()
    }
  }, [chapterIds, revealFrom, endAt])

  return { activeId, visible, fillRef }
}

/**
 * Jump to a chapter.
 *
 * `scrollIntoView` rather than a computed `window.scrollTo`, deliberately: it
 * honours the element's own `scroll-margin-top`, so the landing position stays
 * a CSS value that responds to viewport height instead of a magic number in a
 * click handler.
 *
 * `'instant'`, NOT `'auto'`, for reduced motion. In the CSSOM enum `auto` means
 * "use the element's computed scroll-behavior", and `globals.css` sets that to
 * `smooth` on `html` -- so `auto` here would animate for exactly the readers
 * who asked it not to. The site has made this mistake twice already; see the
 * notes on ScrollToTop and ScrollToHash in App.jsx.
 */
export function scrollToChapter(id) {
  const target = document.getElementById(id)
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
}
