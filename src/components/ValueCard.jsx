export default function ValueCard({ item }) {
  return (
    <article data-component="value-card" className="flex flex-col gap-2 border border-gray-200 p-4">
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </article>
  )
}
