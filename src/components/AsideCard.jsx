export default function AsideCard({ item }) {
  return (
    <article
      data-component="aside-card"
      data-size={item.size}
      id={item.hotspotId ? item.hotspotId.replace('hotspot-', 'about-') : undefined}
      className="flex flex-col gap-2"
    >
      <img src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </article>
  )
}
