import ProjectMedia from './ProjectMedia'
import ButtonLink from './ButtonLink'
import Badge from './Badge'

export default function ProjectCard({ project, size = 'medium' }) {
  const isNda = project.status === 'nda-project'
  const cardLink = isNda
    ? { href: project.externalLink }
    : { to: `/work/${project.slug}` }

  return (
    <article
      id={`project-${project.slug}`}
      data-component="project-card"
      data-size={size}
      style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
    >
      <ProjectMedia src={project.thumbnail} alt={project.title} size={size} />
      <div data-component="project-card-content" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div data-component="project-card-meta" style={{ display: 'flex', gap: 8 }}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          {isNda && <Badge status={project.status} />}
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div style={{ marginTop: 'auto' }}>
          <ButtonLink variant="tertiary" {...cardLink}>
            {project.cta}
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
