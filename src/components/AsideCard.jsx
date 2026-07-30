export default function AsideCard({ item }) {
  return (
    <article data-component="aside-card" data-size={item.size} id={item.hotspotId ? item.hotspotId.replace('hotspot-', 'about-') : undefined}>
      <img src={item.image} alt={item.title} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover' }} />
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </article>
  )
}
