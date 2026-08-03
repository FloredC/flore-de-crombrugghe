import ImagePlaceholder from './ImagePlaceholder'

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
      className="flex flex-col gap-space-24"
    >
      <div className="flex flex-col gap-space-4">
        <h4 className="text-body-lg font-bold">{item.title}</h4>
        <p className="text-body-lg font-normal">{item.description}</p>
      </div>
      {/* Cold Plunge has no image yet -- Figma shows an empty bordered box for
          it too. Render the placeholder rather than nothing, so the pending
          asset stays visible on the page instead of the card looking finished. */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className={`aspect-[4/3] w-full rounded-radius-20 object-cover ${ASIDE_MAX_WIDTH[item.size] || ASIDE_MAX_WIDTH.small}`}
        />
      ) : (
        <ImagePlaceholder
          className={`aspect-[4/3] w-full rounded-radius-20 ${ASIDE_MAX_WIDTH[item.size] || ASIDE_MAX_WIDTH.small}`}
        />
      )}
    </article>
  )
}
