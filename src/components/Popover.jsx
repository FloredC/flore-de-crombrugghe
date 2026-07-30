import ButtonLink from './ButtonLink'
import CopyButton from './CopyButton'

function resolveHref(target) {
  if (target.kind === 'project') return `#project-${target.slug}`
  return target.href
}

export default function Popover({ hotspot }) {
  if (hotspot.type === 'contact') {
    return (
      <div data-component="popover" data-popover-variant="contact">
        <p>{hotspot.title}</p>
        <p>{hotspot.email}</p>
        <CopyButton value={hotspot.email} />
      </div>
    )
  }

  return (
    <div data-component="popover" data-popover-variant="link">
      <p>{hotspot.title}</p>
      <ButtonLink variant="popover" href={resolveHref(hotspot.target)}>
        {hotspot.ctaLabel} →
      </ButtonLink>
    </div>
  )
}
