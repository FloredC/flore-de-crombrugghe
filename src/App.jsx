import { useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'
import ProcessLogPage from './pages/ProcessLogPage'

// Scrolls to `#some-id` when arriving at a route that carries a hash.
//
// The browser only honours a hash on a real document load. React Router
// navigations don't reload the document, so `/#project-pitchpivot` and
// `/#contact` rendered the homepage at the top and silently ignored the
// anchor -- which is what made "Back to Portfolio" always land on the map.
//
// Deliberately has no "only on a new route" guard. An earlier version tracked
// the previous pathname in a ref and bailed out when it hadn't changed, to
// leave same-page anchor jumps to the browser. Under StrictMode that silently
// broke: React runs effects twice in dev (mount, cleanup, mount), the first
// run updated the ref, and the second saw "same route" and returned early --
// so the scroll fired once from an effect that was immediately torn down and
// nothing ever corrected it. The symptom was landing 940px short, at the same
// pixel every time, which is what gave it away: a timing bug varies, a logic
// bug doesn't.
//
// Running on every hash change is idempotent anyway -- scrolling to where the
// browser is already going costs nothing.
// Puts a NEW page at the top. React Router does not reload the document, so
// the window keeps whatever scroll offset the previous page had -- click a
// project card two thirds of the way down the homepage and the case study
// opens two thirds of the way down too. Reported by Flore on both Artifakt
// (2026-08-25) and PitchPivot, which opened on "Why This Matters".
//
// Three conditions, and each one is load-bearing:
//
//  - Skip when there IS a hash. That is ScrollToHash's job below, and racing it
//    would mean scrolling to the top and then to the anchor, i.e. a visible
//    jump on every "Back to Portfolio" and every map popover link.
//
//  - Skip on POP. That is the browser Back/Forward button, where the reader
//    expects to land where they left, and the browser's own scroll restoration
//    is already doing it. Forcing the top here would break returning to the
//    homepage mid-scroll -- which is the exact complaint this fixes, just in
//    the other direction. `useNavigationType` is how React Router exposes it;
//    it also reports POP on first load, where the window is at the top anyway.
//
//  - `behavior: 'instant'`, and the keyword matters: in the CSSOM enum `auto`
//    does NOT mean "jump", it means "use the element's computed
//    scroll-behavior" -- which `globals.css` sets to `smooth` on `html`. So
//    `auto` here animates the scroll back up through the whole length of the
//    old page, and where a smooth scroll can't run the request is simply
//    dropped and the page never moves at all. That is exactly what happened on
//    the first attempt at this fix: the effect fired, `scrollTo` was called
//    with the right arguments, and scrollY stayed put. Only `instant` is
//    unconditional.
//
// useLayoutEffect, not useEffect: this runs after the new page is in the DOM
// but before paint, so nobody sees a frame of the case study rendered at the
// old offset.
//
// No "did the pathname actually change?" ref-guard, deliberately -- see the
// long note in ScrollToHash about how exactly that pattern broke under
// StrictMode. The dependency array is the change detector, and scrolling to
// the top of a page that is already at the top costs nothing.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (hash) return
    if (navigationType === 'POP') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash, navigationType])

  return null
}

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return undefined

    const id = decodeURIComponent(hash.slice(1))
    let timer = null
    let stopped = false

    // One scroll isn't enough. Everything above the target is still loading --
    // the hero map SVG alone is >1MB, plus card images and two iframes -- so
    // the page grows underneath us and a single jump lands short. Measured:
    // one scroll left a Work card 948px off, and #contact 940px off.
    //
    // Re-scroll whenever the document actually changes size, rather than
    // polling on a timer. A timer is guessing: a fixed window is only ever
    // right for one target, and an "has it stopped moving?" poll declared
    // #contact settled during a lull while its iframes were still loading.
    // ResizeObserver fires on the real event instead of sampling for it.
    //
    // `instant`, not `auto`. Both were meant to mean "don't animate"; only one
    // does. `auto` means "use the computed scroll-behavior", and `globals.css`
    // sets `scroll-behavior: smooth` on `html`, so `auto` was animating the
    // whole length of the homepage on arrival -- the thing this line's previous
    // comment said it was preventing. Corrected 2026-08-25, after the same
    // mistake made ScrollToTop above silently do nothing.
    //
    // It matters more here than it looks: this callback fires repeatedly from a
    // ResizeObserver as the page settles, and re-issuing a SMOOTH scroll on
    // every resize restarts the animation from wherever it got to, so the page
    // creeps toward the target instead of arriving at it.
    //
    // The offset that keeps the target clear of the fixed nav is the target's
    // own scroll-margin.
    const scrollToTarget = () => {
      if (stopped) return
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    scrollToTarget()

    const observer = new ResizeObserver(scrollToTarget)
    observer.observe(document.body)
    // `load` covers subresources that finish without changing body height.
    window.addEventListener('load', scrollToTarget)

    // Never fight the reader: the first deliberate scroll cancels the rest,
    // otherwise correcting for late-loading images would yank the page back
    // from under someone who already started scrolling. The timeout is the
    // backstop for a page that never stops settling.
    const stop = () => {
      stopped = true
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
    timer = setTimeout(stop, 4000)

    const events = ['wheel', 'touchstart', 'keydown']
    events.forEach((event) => window.addEventListener(event, stop, { passive: true }))

    return () => {
      stop()
      window.removeEventListener('load', scrollToTarget)
      events.forEach((event) => window.removeEventListener(event, stop))
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* THE ONE RENAMED SLUG, 2026-08-27. "Welcome to my city" became
            "Welcome to my island" (Flore's call), which moved its route.
            That URL was live and shareable, so it forwards instead of 404ing
            -- `replace` so the old address doesn't sit in the back button.
            This is the only redirect on the site; if a second slug is ever
            renamed, these want collecting into a map rather than growing a
            list of one-off routes. */}
        <Route
          path="/work/welcome-to-my-city"
          element={<Navigate to="/work/welcome-to-my-island" replace />}
        />
        <Route path="/work/:slug" element={<ProjectPage />} />
        {/* One level below a case study: a generated process-log document,
            framed with the site's nav. See ProcessLogPage on why the documents
            themselves are left untouched.
            Two path segments deep, which `public/404.html` already handles --
            it re-encodes the whole path regardless of depth, so no change to
            `pathSegmentsToKeep` is needed. */}
        <Route path="/work/:slug/process/:log" element={<ProcessLogPage />} />
      </Routes>
    </>
  )
}
