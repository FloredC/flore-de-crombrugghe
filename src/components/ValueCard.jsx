export default function ValueCard({ item }) {
  return (
    <article data-component="value-card">
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </article>
  )
}
