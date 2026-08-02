import { useState } from 'react'

// Shared by every copy-to-clipboard control (the map popover's icon-only
// CopyButton and the Contact section's full-chrome email button) so the
// idle/copied/failed cycle and its timing only exist in one place.
export default function useCopyToClipboard(value, resetDelay = 2000) {
  const [status, setStatus] = useState('idle') // 'idle' | 'copied' | 'failed'

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    setTimeout(() => setStatus('idle'), resetDelay)
  }

  return { status, copy }
}
