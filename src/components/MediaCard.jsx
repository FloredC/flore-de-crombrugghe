import ButtonLink from './ButtonLink'
import { ExternalLinkIcon } from './icons'

export default function MediaCard({ item }) {
  return (
    <article
      // Anchor target for the map's matching hotspot popover (e.g.
      // hotspot-future-of-ux -> #media-future-of-ux), same pattern as
      // ProjectCard's #project-<slug>.
      id={item.id ? `media-${item.id}` : undefined}
      data-component="media-card"
      data-variant={item.variant}
      className="flex flex-col gap-4"
    >
      {item.variant === 'embed' ? (
        <iframe
          data-component="media-embed"
          src={item.embedSrc}
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : item.image ? (
        <img data-component="media-image" src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div data-component="media-image" className="flex aspect-[4/3] items-center justify-center border border-dashed border-gray-300">
          Image placeholder
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h4 className="text-body-sm font-semibold">{item.title}</h4>
        <p className="text-body font-normal">{item.description}</p>
      </div>
      <ButtonLink variant="secondary" href={item.href} target="_blank" rel="noopener noreferrer">
        {item.cta}
        <ExternalLinkIcon width={16} height={16} />
      </ButtonLink>
    </article>
  )
}
