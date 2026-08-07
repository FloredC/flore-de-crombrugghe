import { CopyIcon } from './icons'
import { FOCUS_CLASS } from './ButtonLink'
import useCopyToClipboard from '../lib/useCopyToClipboard'

// Takes the hotspot's discipline colour, not the accent orange it used until
// 2026-08-07 -- Flore's call, so the whole popover reads as one group rather
// than the icon being the only orange thing left in a purple card. Figma's
// ButtonAction still specs button/accent/icon here; the override is hers.
//
// The variables come from the Popover element above (see disciplineVars
// there), which is why this component takes no colour prop -- and why it is
// only safe to use inside a popover. Rendered anywhere else the icon would
// fall back to inherited text colour, silently.
export default function CopyButton({ value }) {
  const { status, copy } = useCopyToClipboard(value)
  const label = { idle: 'Copy email address', copied: 'Copied', failed: 'Copy failed' }[status]

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      title={label}
      className={`inline-flex w-fit rounded-radius-8 text-[var(--discipline-marker)] transition-colors hover:text-[var(--discipline-marker-hover)] active:text-[var(--discipline-marker-hover)] ${FOCUS_CLASS}`}
    >
      <CopyIcon width={16} height={16} />
    </button>
  )
}
