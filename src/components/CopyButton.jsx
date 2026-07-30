import { useState } from 'react'

export default function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={handleCopy} aria-label="Copy email address">
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
