import { CopyIcon } from './icons'
import { SECONDARY_BUTTON_CLASS } from './ButtonLink'
import useCopyToClipboard from '../lib/useCopyToClipboard'

// Sampled from the Contact section's own ButtonLink instance (node
// 2928:73875): secondary chrome, the email as its label, a copy
// icon as the right icon -- the whole pill is one control, not label text
// next to a separate small icon button.
//
// It's a <button>, not a ButtonLink/<a>, even though it borrows the
// secondary chrome exactly: per CLAUDE.md's tag-follows-behavior rule,
// copy-to-clipboard has no navigation, so it can't be an anchor. Same
// pattern as the map popover's CopyButton, just full chrome instead of an
// icon alone, so they share useCopyToClipboard rather than duplicating the
// idle/copied/failed cycle.
//
// Figma's sample shows the email display-truncated ("flore.decr...@gmail.com")
// -- that's a fixed-width artifact of the component swatch in the library
// frame, not a real content decision. This button isn't width-constrained on
// the actual page (unlike the map popover, which truncates because it's
// fixed at w-56), so the full address renders -- more useful for a visitor
// who wants to read it, not just copy it.
export default function ContactEmailButton({ email }) {
  const { status, copy } = useCopyToClipboard(email)
  const label = { idle: email, copied: 'Copied!', failed: 'Copy failed' }[status]

  // An email address is a single unbreakable token, so the pill could only be
  // as wide as the whole address -- 322px, which overflowed any viewport at or
  // below ~340 and pushed the document wider than the screen (the page's only
  // horizontal overflow anywhere). `max-w-full` caps the pill at its container
  // and `break-all` gives the address somewhere to wrap, so it reflows to two
  // lines at the small end instead of forcing the page sideways. No breakpoint:
  // it wraps exactly when it has to, at whatever width that turns out to be.
  // Not truncation -- the whole point of showing the address is that it can be
  // read as well as copied. `shrink-0` keeps the icon from being squeezed.
  return (
    <button type="button" onClick={copy} className={`${SECONDARY_BUTTON_CLASS} max-w-full`}>
      <span className="min-w-0 break-all text-left">{label}</span>
      <CopyIcon width={20} height={20} className="shrink-0" />
    </button>
  )
}
