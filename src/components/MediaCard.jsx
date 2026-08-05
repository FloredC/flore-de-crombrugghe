import ButtonLink from './ButtonLink'
import useIframeFocusRing, { IFRAME_FOCUS_RING } from '../lib/useIframeFocusRing'
import ImagePlaceholder from './ImagePlaceholder'
import assetUrl from '../lib/assetUrl'
import { ExternalLinkIcon } from './icons'

// Every MediaCard image is 4:3 (Media variant=ImageSmall, 300x225 — node
// 4522:18868). The podcast is the one exception: it's the `Embed` variant,
// an iframe rather than an image, so it keeps its own height.

export default function MediaCard({ item }) {
  const [embedRef, embedFocused] = useIframeFocusRing()

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
        // The embed gets the same 4:3 media slot the image variants use, with
        // the player bottom-aligned inside it. The player is only 110px tall
        // against their 300, so on its own it left the card short and started
        // its text block higher than every neighbour's. Matching the slot puts
        // all the media bottom edges -- and so all the artwork-to-title gaps --
        // on the same line.
        <div
          data-component="media-embed-slot"
          className="flex aspect-[4/3] w-full items-end"
        >
          {/* 152 is Spotify's compact player -- its real height, not a ratio.
              The player is a fixed-height component that only flexes in width,
              so an aspect-ratio box doesn't scale it: it renders at its natural
              size and letterboxes itself inside whatever box it's given. At
              400x110 that put ~40px of transparent iframe below the artwork,
              which read as the podcast card having a much looser
              artwork-to-title gap than its neighbours even though the iframe's
              own box was flush. Sizing the box to the player removes the band.
              Still far short of the 352px block this started as. */}
          {/* An iframe is focusable, so it lands in the tab order whether or
              not we give it a state -- and it had neither a name nor a visible
              focus indicator, so keyboard focus simply vanished here. `title`
              is what a screen reader announces for the frame; the ring can't
              be a `focus-visible:` class on an iframe (see useIframeFocusRing
              for why) so it's applied conditionally instead. */}
          <iframe
            ref={embedRef}
            data-component="media-embed"
            src={assetUrl(item.embedSrc)}
            title={`${item.title} — audio player`}
            className={`h-[152px] w-full ${embedFocused ? IFRAME_FOCUS_RING : ''}`}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      ) : item.image ? (
        <img data-component="media-image" src={assetUrl(item.image)} alt={item.title} className="aspect-[4/3] w-full rounded-radius-24 object-cover" />
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
