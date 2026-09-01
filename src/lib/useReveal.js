import { useEffect, useRef, useState } from 'react'

/**
 * "Has this block been scrolled into view yet?" — the one observer behind every
 * scroll reveal on the site.
 *
 * ONE OBSERVER PER GROUP, NOT PER ELEMENT. A homepage section reveals its
 * wayfinding row, its Guide and six project cards; watching each of those
 * separately would mean nine observers for one moment that is, in the design,
 * a single event. So the group is observed and its descendants are styled off
 * the group's own `data-reveal-in` attribute (see the REVEAL block in
 * globals.css). That is also what makes the stagger possible at all: the items
 * share one start time and separate themselves with transition-delay, which
 * cannot work if each waits for its own intersection.
 *
 * FIRES ONCE. The observer disconnects on the first intersection, so a block
 * does not re-animate when the reader scrolls back up. Re-triggering is the
 * fastest way to make a long page feel restless, and this page is long.
 *
 * THRESHOLD 0, NOT A FRACTION, and this is the bug worth knowing about. The
 * obvious `threshold: 0.2` means "one fifth of the element is visible", which
 * a block TALLER than the viewport can never satisfy — a 5000px case-study
 * section in a 900px window peaks at 0.18 and the callback never fires, so the
 * content stays at opacity 0 permanently. Case-study sections are exactly that
 * tall. Threshold 0 plus a bottom rootMargin says "the top edge has come up
 * past this line", which is true regardless of how tall the block is.
 *
 * DEGRADES TO VISIBLE, never to blank. If IntersectionObserver is missing the
 * hook reports revealed immediately rather than waiting for an event that will
 * never arrive. The stronger guarantee lives in CSS: the hidden state is armed
 * by a flag this app sets on <html>, so with no JS at all nothing here runs and
 * the page is simply finished. See index.html.
 */
// Long enough that it never pre-empts a real scroll reveal on a normal page
// load, short enough that a reader who hit the failure would not sit looking at
// nothing. Tuned to intent, not measured — there is no measurement to take until
// the underlying bug reproduces.
const FALLBACK_MS = 1500

export default function useReveal({ rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (revealed) return
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0, rootMargin },
    )
    io.observe(el)

    // SAFETY NET, added 2026-09-01. The observer above is the mechanism; this is
    // the guarantee. If it has not fired within FALLBACK_MS the block reveals
    // anyway, so no combination of scroll position, client-side navigation or
    // layout timing can leave content permanently invisible.
    //
    // Added while chasing a white page on the Artifakt -> PitchPivot transition
    // that was never reproduced. This does not explain that bug and may not be
    // the cause — but "content stays at opacity 0 forever" is the failure mode
    // with the worst consequences on this site, and it costs one skipped fade to
    // rule it out entirely. A block that reveals without animating is invisible
    // to a reader; a block that never reveals is a blank page.
    const timer = setTimeout(() => setRevealed(true), FALLBACK_MS)

    return () => {
      clearTimeout(timer)
      io.disconnect()
    }
  }, [revealed, rootMargin])

  return { ref, revealed }
}
