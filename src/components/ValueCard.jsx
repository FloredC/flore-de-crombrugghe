import ImagePlaceholder from './ImagePlaceholder'

// The Figma ValueCard (4533:19717) is image + title + description, not just
// text: the top block is a dashed 262px container holding an illustration.
// That slot was missing from this component entirely until now -- it renders
// the "[ img ]" placeholder while the real illustrations are outstanding.
export default function ValueCard({ item }) {
  return (
    <article data-component="value-card" className="flex flex-col items-center gap-space-24">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="h-[262px] w-full rounded-radius-32 object-cover"
        />
      ) : (
        <ImagePlaceholder className="h-[262px] w-full rounded-radius-32" />
      )}
      <div className="flex w-full flex-col gap-space-12">
        <h4 className="text-body font-bold">{item.title}</h4>
        <p className="text-body font-normal">{item.description}</p>
      </div>
    </article>
  )
}
