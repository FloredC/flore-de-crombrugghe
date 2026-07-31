import { useState } from 'react'
import { CopyIcon } from './icons'

export default function CopyButton({ value }) {
  const [status, setStatus] = useState('idle') // 'idle' | 'copied' | 'failed'

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    setTimeout(() => setStatus('idle'), 2000)
  }

  const label = { idle: 'Copy email address', copied: 'Copied', failed: 'Copy failed' }[status]

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={label}
      className="inline-flex w-fit text-action-accent-foreground hover:text-action-accent-foreground-hover active:text-action-accent-foreground-pressed"
    >
      <CopyIcon width={16} height={16} />
    </button>
  )
}
