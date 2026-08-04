import ImagePlaceholder from './ImagePlaceholder'

// The Figma ValueCard (4533:19717) is image + title + description, not just
// text: the top block is a dashed 262px container holding an illustration.
// That slot was missing from this component entirely until now -- it renders
// the "[ img ]" placeholder while the real illustrations are outstanding.
export default function ValueCard({ item }) {
  return (
    <article data-component="value-card" className="flex flex-col items-center gap-space-24">
      {/* The exported SVG is the whole Figma slot (node 4645:5770) -- the
          278x262 bordered, rounded container with the drawing centred inside
          it -- not just the artwork. So the component adds no border and no
          radius of its own; both are in the asset.

          Ratio, not a fixed height with object-cover: the card is exactly
          278 wide only at xl. Anywhere wider, a fixed 262 height made the box
          wider than the asset's own ratio, and object-cover filled it by
          scaling up and clipping -- which would have cut the frame's own
          border off the top and bottom. Scaling the whole thing keeps the
          frame intact at every width.

          alt is empty because the illustration repeats the title sitting
          directly beneath it; captioning it would make a screen reader
          announce "Editing" twice. */}
      {item.image ? (
        <img src={item.image} alt="" className="aspect-[278/262] w-full" />
      ) : (
        <ImagePlaceholder className="aspect-[278/262] w-full rounded-radius-32" />
      )}
      <div className="flex w-full flex-col gap-space-12">
        <h4 className="text-body font-bold">{item.title}</h4>
        <p className="text-body font-normal">{item.description}</p>
      </div>
    </article>
  )
}
