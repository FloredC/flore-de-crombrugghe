export default function MediaCard({ item }) {
  return (
    <article data-component="media-card" data-variant={item.variant}>
      {item.variant === 'embed' ? (
        <div data-component="media-embed" style={{ aspectRatio: '16 / 9' }}>
          Embed placeholder
        </div>
      ) : (
        <div data-component="media-image" style={{ aspectRatio: '4 / 3' }}>
          Image placeholder
        </div>
      )}
      <p>{item.outlet} — {item.date}</p>
      <h4>
        <a href={item.href} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      </h4>
    </article>
  )
}
