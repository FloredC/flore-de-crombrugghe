import { useEffect, useRef, useState } from 'react'

// Why this exists instead of a `focus-visible:ring-*` utility.
//
// An iframe is focusable, so it takes a Tab stop whether or not we want one.
// But when you tab into it, focus crosses into the child browsing context:
// `document.activeElement` becomes the iframe, while `:focus`,
// `:focus-visible` AND `:focus-within` all report false in the host document
// -- verified in Chrome by tabbing in for real and matching each selector.
// So there is no CSS selector on the page that can reach this state, and a
// `focus-visible:` class on an iframe is silently dead code. Both embeds had
// exactly that gap: focus landed on them and disappeared for a stop.
//
// `window`'s blur event is the signal -- it's what fires when focus leaves
// the host document for a frame. Checking activeElement at that moment tells
// us whether it left for *this* frame or somewhere else entirely (another
// browser tab, the address bar), which would also blur the window.
// Takes an optional existing ref, so a component that already holds a ref on
// its iframe for other reasons (LanguageRiverEmbed measures the frame's
// content height through one) reuses that rather than merging two refs onto
// the same node.
export default function useIframeFocusRing(externalRef) {
  const ownRef = useRef(null)
  const ref = externalRef || ownRef
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const onWindowBlur = () => setFocused(document.activeElement === ref.current)
    // Any focus landing back in the host document means we've tabbed out.
    const onFocusIn = () => setFocused(false)

    window.addEventListener('blur', onWindowBlur)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      window.removeEventListener('blur', onWindowBlur)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [ref])

  return [ref, focused]
}

// The ring itself, matching FOCUS_CLASS's painted result -- same token, same
// width and offset. Kept as a plain (not `focus-visible:`) class because it's
// applied conditionally from JS, per the note above.
export const IFRAME_FOCUS_RING = 'ring-2 ring-focus-ring ring-offset-2'
