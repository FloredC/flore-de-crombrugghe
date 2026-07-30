export default function ProjectMedia({ src, alt, size = 'medium' }) {
  return (
    <div
      data-component="project-media"
      data-size={size}
      className="w-full min-w-0 overflow-hidden"
      style={{ aspectRatio: '16 / 10' }}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  )
}
