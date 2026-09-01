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
 * NO TIMEOUT FALLBACK, and this is a scar rather than a preference. One was
 * added on 2026-09-01 while chasing an unrelated white page -- "reveal anyway
 * after 1500ms so nothing can stay invisible" -- and it silently deleted the
 * whole feature. Every block mounts at once, so a timer counted from mount fires
 * for blocks the reader has not reached: measured on PitchPivot, all six groups
 * were revealed 1.5s after load with nobody scrolling, leaving nothing to animate
 * by the time they arrived. Flore noticed the animations were gone well before
 * anyone noticed the cause.
 *
 * The lesson is not that 1500 was too short. A time-based fallback cannot work
 * here at all, because what it would have to wait for is a scroll that may never
 * come. If a guarantee is ever wanted it must be POSITIONAL -- reveal a block
 * already at or above the viewport -- never temporal.
 *
 * DEGRADES TO VISIBLE, never to blank. If IntersectionObserver is missing the
 * hook reports revealed immediately rather than waiting for an event that will
 * never arrive. The stronger guarantee lives in CSS: the hidden state is armed
 * by a flag this app sets on <html>, so with no JS at all nothing here runs and
 * the page is simply finished. See index.html.
 */
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
    return () => io.disconnect()
  }, [revealed, rootMargin])

  return { ref, revealed }
}
