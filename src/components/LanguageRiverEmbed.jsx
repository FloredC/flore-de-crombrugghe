import { useCallback, useEffect, useRef, useState } from 'react'
import useIframeFocusRing, { IFRAME_FOCUS_RING } from '../lib/useIframeFocusRing'
import assetUrl from '../lib/assetUrl'

// Used only for the first paint and if measurement is ever unavailable --
// close to the real rendered height (371-387px depending on width) so the
// section doesn't visibly jump once the real value lands.
const FALLBACK_HEIGHT = 380

// The Language River chart (public/language-river.html) is a self-contained
// page: Chart.js draws into a fixed 250px canvas, but the surrounding title,
// legend and axis labels make the *document* height content-driven
// (`html,body{height:auto}`), and it changes with width -- the legend rewraps
// below ~500px, taking the page from ~371px to ~387px tall.
//
// So neither a fixed height nor Figma's aspect-ratio box is right: one clips
// the legend on narrow screens, the other leaves dead space on wide ones.
// Instead we measure the real content and size the iframe to it.
//
// This works without touching language-river.html (which is generated from a
// separate source project and must not be hand-edited) because the file is
// served from /public by this same site -- same origin, so `contentDocument`
// is readable directly and no postMessage bridge is needed.
export default function LanguageRiverEmbed({ src, title }) {
  const frameRef = useRef(null)
  // Reuses frameRef rather than putting a second ref on the same node.
  const [, frameFocused] = useIframeFocusRing(frameRef)
  const [height, setHeight] = useState(FALLBACK_HEIGHT)

  const measure = useCallback(() => {
    const body = frameRef.current?.contentDocument?.body
    if (!body) return
    // scrollHeight, not getBoundingClientRect: the chart positions its event
    // labels absolutely, and we want the full content extent.
    const next = body.scrollHeight
    if (next > 0) setHeight(next)
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    let observer

    const attach = () => {
      measure()
      const body = frame.contentDocument?.body
      if (!body) return
      // Observe the chart's own <body> rather than the iframe element: body
      // height is intrinsic and independent of the height we set on the
      // iframe, so there's no resize feedback loop -- it fires only when the
      // content genuinely reflows (i.e. when the column width changes).
      observer = new ResizeObserver(measure)
      observer.observe(body)
    }

    // The iframe may already have loaded before this effect runs (cached
    // navigation, fast local serve), in which case 'load' never fires again.
    if (frame.contentDocument?.readyState === 'complete') attach()
    frame.addEventListener('load', attach)

    return () => {
      frame.removeEventListener('load', attach)
      observer?.disconnect()
    }
  }, [measure, src])

  return (
    // Chrome sampled from Figma's "LanguageriverEmbed (Iframe)" node
    // (2928:73852): white surface, 1px grey border, 10px inset, 24px radius.
    <div
      data-component="language-river"
      className="w-full rounded-radius-24 border border-border-grey bg-surface-background p-space-10"
    >
      <iframe
        ref={frameRef}
        // RESOLVED HERE, not at the call site -- moved inside on 2026-08-24
        // after the second call site forgot it and shipped a 404.
        //
        // `src` arrives as a content-supplied string ("/embeds/..."), which
        // Vite never sees and therefore never rewrites, so it resolves against
        // the domain root: correct on localhost, wrong under the deployed
        // /flore-de-crombrugghe/ base. The failure is silent and invisible in
        // dev -- the iframe simply collapses to ~15px in production.
        //
        // assetUrl is NOT idempotent (it would prefix an already-prefixed
        // path), so no call site may pre-resolve. HomePage's call was changed
        // in the same commit to pass the raw path.
        src={assetUrl(src)}
        title={title}
        loading="lazy"
        scrolling="no"
        // Focusable by virtue of being an iframe, so it takes a Tab stop
        // regardless -- and nothing inside the chart is focusable, so without
        // a ring here focus vanished entirely for that stop. Driven from JS
        // rather than a focus-visible: class; see useIframeFocusRing.
        className={`block w-full border-0 ${frameFocused ? IFRAME_FOCUS_RING : ''}`}
        style={{ height }}
      />
    </div>
  )
}
