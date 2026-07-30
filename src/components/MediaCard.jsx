export default function MediaCard({ item }) {
  return (
    <article data-component="media-card" data-variant={item.variant} className="flex flex-col gap-2">
      {item.variant === 'embed' ? (
        <div data-component="media-embed" className="flex aspect-video items-center justify-center border border-dashed border-gray-300">
          Embed placeholder
        </div>
      ) : (
        <div data-component="media-image" className="flex aspect-[4/3] items-center justify-center border border-dashed border-gray-300">
          Image placeholder
        </div>
      )}
      <p className="text-caption font-normal">{item.outlet} — {item.date}</p>
      <h4 className="text-body-sm font-semibold">
        <a href={item.href} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      </h4>
    </article>
  )
}
