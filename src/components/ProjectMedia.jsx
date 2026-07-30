export default function ProjectMedia({ src, alt, size = 'medium' }) {
  return (
    <div data-component="project-media" data-size={size} style={{ aspectRatio: '16 / 10' }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  )
}
