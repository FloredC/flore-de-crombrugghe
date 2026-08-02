// The media area is a bordered, rounded frame that holds the project image
// *and* its caption -- the caption sits inside the frame, under the image,
// not under the card. Sampled from Figma's ProjectMedia node (2928:78175 /
// 78184 / 78193): dashed grey border, radius 20 (32 on the large variant),
// tinted background behind the image, 14px centered caption.
//
// The badge ("Case study" / "NDA") is also anchored inside this frame rather
// than sitting in the content column below.
export default function ProjectMedia({ src, alt, caption, size = 'medium', badge }) {
  const isLarge = size === 'large'

  return (
    <div
      data-component="project-media"
      data-size={size}
      className={`relative w-full min-w-0 overflow-hidden border border-dashed border-border-grey ${
        isLarge ? 'rounded-radius-32' : 'rounded-radius-20'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-space-12 p-space-12">
        <img src={src} alt={alt} className="w-full object-cover" style={{ aspectRatio: '16 / 10' }} />
        {caption && (
          <p data-component="project-media-caption" className="w-full text-center text-caption font-normal">
            {caption}
          </p>
        )}
      </div>
      {badge}
    </div>
  )
}
