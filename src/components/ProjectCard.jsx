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
      className="flex w-full min-w-0 flex-col gap-4"
    >
      <ProjectMedia src={project.thumbnail} alt={project.title} size={size} />
      <div data-component="project-card-content" className="flex flex-1 flex-col gap-2">
        <div data-component="project-card-meta" className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          {isNda && <Badge status={project.status} />}
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="mt-auto pt-2">
          <ButtonLink variant="tertiary" {...cardLink}>
            {project.cta}
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
