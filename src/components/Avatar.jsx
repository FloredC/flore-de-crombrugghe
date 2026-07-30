/**
 * PLACEHOLDER: real avatar illustration SVGs (variant=hero, sections-left, sections-right)
 * haven't been exported from Figma yet — ask Flore for them rather than fabricating art.
 * Renders a labeled placeholder box in the meantime so layout/spacing can still be built.
 */
export default function Avatar({ variant = 'hero' }) {
  return (
    <div role="img" aria-label={`Avatar illustration (${variant}) — placeholder, pending export`} data-avatar-variant={variant}>
      Avatar
    </div>
  )
}
