import ButtonLink from './ButtonLink'
import ImagePlaceholder from './ImagePlaceholder'
import { ExternalLinkIcon } from './icons'

// Every MediaCard image is 4:3 (Media variant=ImageSmall, 300x225 — node
// 4522:18868). The podcast is the one exception: it's the `Embed` variant,
// an iframe rather than an image, so it keeps its own height.

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
        <img data-component="media-image" src={item.image} alt={item.title} className="aspect-[4/3] w-full rounded-radius-24 object-cover" />
      ) : (
        <ImagePlaceholder className="aspect-[4/3] w-full rounded-radius-24" />
      )}
      <div className="flex flex-col gap-1">
        <h4 className="text-body font-bold">{item.title}</h4>
        <p className="text-body font-normal">{item.description}</p>
      </div>
      {/* self-start, not a bare flex child: an inline-flex button inside a
          `flex flex-col` gets stretched to full width by flex's default
          align-items:stretch. Buttons hug their label -- ProjectCard only
          escaped this because its button sits inside a block wrapper. */}
      <ButtonLink
        variant="secondary"
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start"
      >
        {item.cta}
        <ExternalLinkIcon width={16} height={16} />
      </ButtonLink>
    </article>
  )
}
