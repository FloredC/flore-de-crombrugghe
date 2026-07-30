export default function SpeechBubble({ variant = 'right', children }) {
  return (
    <div data-speech-bubble-variant={variant}>
      <p className="text-caption-sm font-normal">{children}</p>
    </div>
  )
}
