import ButtonLink from './ButtonLink'
import CopyButton from './CopyButton'

function resolveHref(target) {
  if (target.kind === 'project') return `#project-${target.slug}`
  return target.href
}

export default function Popover({ hotspot }) {
  if (hotspot.type === 'contact') {
    return (
      <div
        data-component="popover"
        data-popover-variant="contact"
        className="flex w-56 flex-col gap-2 rounded border border-gray-300 bg-white p-4"
      >
        <p>{hotspot.title}</p>
        <p>{hotspot.email}</p>
        <CopyButton value={hotspot.email} />
      </div>
    )
  }

  return (
    <div
      data-component="popover"
      data-popover-variant="link"
      className="flex w-56 flex-col gap-2 rounded border border-gray-300 bg-white p-4"
    >
      <p>{hotspot.title}</p>
      <ButtonLink variant="popover" href={resolveHref(hotspot.target)}>
        {hotspot.ctaLabel} ↓
      </ButtonLink>
    </div>
  )
}
