import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
    // `auto`, not smooth: arriving from another page would otherwise animate
    // the whole length of the homepage. The offset that keeps the target clear
    // of the fixed nav is the target's own scroll-margin.
    const scrollToTarget = () => {
      if (stopped) return
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
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
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
