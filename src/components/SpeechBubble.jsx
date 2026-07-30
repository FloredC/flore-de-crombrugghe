export default function SpeechBubble({ variant = 'right', children }) {
  return (
    <div data-speech-bubble-variant={variant}>
      <p>{children}</p>
    </div>
  )
}
