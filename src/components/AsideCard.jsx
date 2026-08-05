import ImagePlaceholder from './ImagePlaceholder'
import assetUrl from '../lib/assetUrl'

// All three Aside variants are 4:3 (400x300, 500x375, 600x450 — node
// 4533:19992), so `size` selects a max width, not a different ratio.
const ASIDE_MAX_WIDTH = {
  small: 'max-w-[400px]',
  medium: 'max-w-[500px]',
  large: 'max-w-[600px]',
}

export default function AsideCard({ item }) {
  return (
    <article
      data-component="aside-card"
      data-size={item.size}
      id={item.hotspotId ? item.hotspotId.replace('hotspot-', 'about-') : undefined}
      // 16, not Figma's 24: the collage above pulls the cards close together,
      // and the gap between two cards has to stay wider than the gap inside
      // one or they stop reading as separate cards. Lowering this is what
      // makes room for the collage gap to come down. Flore's call 2026-08-04.
      className="flex flex-col gap-space-16"
    >
      <div className="flex flex-col gap-space-4">
        {/* h3, not h4: this sits directly under its section's <h2>, the same
            level as a ProjectCard title. h4 here skipped a level, which
            breaks the document outline a screen reader announces. Size is
            set by the type class, so the tag change is invisible. */}
        <h3 className="text-body-lg font-bold">{item.title}</h3>
        <p className="text-body-lg font-normal">{item.description}</p>
      </div>
      {/* Cold Plunge has no image yet -- Figma shows an empty bordered box for
          it too. Render the placeholder rather than nothing, so the pending
          asset stays visible on the page instead of the card looking finished. */}
      {item.image ? (
        <img
          src={assetUrl(item.image)}
          loading="lazy"
          decoding="async"
          alt={item.title}
          className={`aspect-[4/3] w-full rounded-radius-24 object-cover ${ASIDE_MAX_WIDTH[item.size] || ASIDE_MAX_WIDTH.small}`}
        />
      ) : (
        <ImagePlaceholder
          className={`aspect-[4/3] w-full rounded-radius-24 ${ASIDE_MAX_WIDTH[item.size] || ASIDE_MAX_WIDTH.small}`}
        />
      )}
    </article>
  )
}
