import { useState } from 'react'

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

  const label = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' }[status]

  return (
    <button type="button" onClick={handleCopy} aria-label="Copy email address">
      {label}
    </button>
  )
}
