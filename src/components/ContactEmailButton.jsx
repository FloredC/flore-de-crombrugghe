import { CopyIcon } from './icons'
import { SECONDARY_BUTTON_CLASS } from './ButtonLink'
import useCopyToClipboard from '../lib/useCopyToClipboard'

// Sampled from the Contact section's own ButtonLink instance (node
// 2928:73875 / 4533:27939): secondary chrome, the email as its label, a copy
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

  return (
    <button type="button" onClick={copy} className={SECONDARY_BUTTON_CLASS}>
      {label}
      <CopyIcon width={20} height={20} />
    </button>
  )
}
