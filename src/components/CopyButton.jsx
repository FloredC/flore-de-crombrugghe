import { CopyIcon } from './icons'
import { FOCUS_CLASS } from './ButtonLink'
import useCopyToClipboard from '../lib/useCopyToClipboard'

export default function CopyButton({ value }) {
  const { status, copy } = useCopyToClipboard(value)
  const label = { idle: 'Copy email address', copied: 'Copied', failed: 'Copy failed' }[status]

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      title={label}
      className={`inline-flex w-fit rounded-radius-8 text-action-accent-foreground transition-colors hover:text-action-accent-foreground-hover active:text-action-accent-foreground-pressed ${FOCUS_CLASS}`}
    >
      <CopyIcon width={16} height={16} />
    </button>
  )
}
