/**
 * In-page anchor navigation — one implementation, used by every `href="#..."`
 * on the site.
 *
 * WHY THIS EXISTS RATHER THAN LETTING THE BROWSER DO IT
 *
 * `globals.css` sets `scroll-behavior: smooth` on `html`, and for a while that
 * was enough: a plain `<a href="#work">` did a fragment navigation and the
 * browser animated it. The failure mode is that a fragment navigation is a
 * NAVIGATION, and a navigation to where you already are is a no-op:
 *
 *   - Click "About". URL becomes /#about, page scrolls.
 *   - Scroll away by hand. URL still says /#about.
 *   - Click "About" again -> the browser compares fragments, finds no change,
 *     and does nothing at all. No scroll, no animation, no error.
 *
 * The same dead click hits every map popover CTA, and it is reached far more
 * often than it looks: the subpage nav's back link returns to /#project-<slug>,
 * so the hash is already populated before the reader has clicked anything on
 * the map.
 * From there, the popover CTA for THAT project is dead on arrival.
 *
 * Scrolling ourselves removes the whole class of problem: there is no
 * navigation to deduplicate, so the Nth click behaves exactly like the first.
 *
 * WHAT IS DELIBERATELY KEPT
 *
 *   - The element is still a real `<a>` with a real `href`. Middle-click,
 *     cmd-click and "copy link address" all still work, the destination shows
 *     in the status bar, and the link is keyboard-operable for free. Only the
 *     plain left-click is intercepted.
 *   - `scrollIntoView`, not a computed `window.scrollTo`, so the landing
 *     position stays the target's own `scroll-margin-top` in CSS -- the 120px
 *     nav clearance in globals.css, or a chapter anchor's viewport fraction.
 *     A pixel offset in a click handler would have to be kept in sync by hand.
 *   - The URL still ends up pointing at the section, so a reader can copy it.
 *
 * WHAT CHANGES: `replaceState` instead of the browser's `pushState`. Clicking
 * four nav links used to stack four history entries, so leaving the page took
 * four presses of Back. The anchors are a way of moving around one page, not
 * four places you visited.
 */

/**
 * `'instant'`, NOT `'auto'`, for reduced motion.
 *
 * In the CSSOM enum `auto` means "use the element's computed scroll-behavior",
 * and that is `smooth` here -- so `auto` would animate for exactly the readers
 * who asked it not to. This site has made that mistake twice already; see the
 * notes on ScrollToTop and ScrollToHash in App.jsx.
 */
function scrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
}

/** Scroll to the element with this id. No-op, safely, if it isn't on the page. */
export function scrollToAnchor(id) {
  const target = document.getElementById(id)
  if (!target) return false
  target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
  return true
}

/**
 * Back to the top of the page.
 *
 * Not an anchor, because there is nothing to anchor to: a case study's first
 * element is the hero stage, which carries no id, and giving it one purely so a
 * button could point at it would be inventing a destination to justify a link.
 * The top of the document is a position, not a place -- so this is a real
 * `<button>` calling `scrollTo`, per the tag-follows-behavior rule in CLAUDE.md.
 *
 * Shares `scrollBehavior()` with the anchor path so "back to top" and "jump to a
 * chapter" cannot animate differently, and so reduced motion is answered once.
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: scrollBehavior() })
}

/**
 * The click handler for an in-page anchor. Returns without preventing the
 * default in every case it does not handle, so anything unusual falls back to
 * the browser rather than becoming a dead link.
 *
 * @param {MouseEvent} event
 * @param {string} href e.g. `#work`. Anything else (`/#contact`, a URL) is
 *   ignored -- those are real navigations to another document.
 */
export function handleAnchorClick(event, href) {
  if (typeof href !== 'string' || !href.startsWith('#') || href.length < 2) return
  // Modified clicks mean "open this somewhere else" -- leave them to the browser.
  if (event.defaultPrevented) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return

  const id = decodeURIComponent(href.slice(1))
  if (!scrollToAnchor(id)) return

  event.preventDefault()
  // `history.state` is passed through rather than dropped: React Router keeps
  // its own `{ usr, key, idx }` in there, and replacing it with null would
  // leave the router's history index out of step with the browser's.
  window.history.replaceState(window.history.state, '', href)
}
