import ProjectMedia from './ProjectMedia'
import ButtonLink from './ButtonLink'
import Badge from './Badge'
import { ExternalLinkIcon } from './icons'

export default function ProjectCard({ project, size = 'medium' }) {
  const isNda = project.status === 'nda-project'
  // NDA cards link off-site, so they open in a new tab rather than
  // navigating the reader away from the portfolio entirely.
  const cardLink = isNda
    ? { href: project.externalLink, target: '_blank', rel: 'noopener noreferrer' }
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
        <div data-component="project-card-meta" className="flex flex-wrap gap-2 text-body-sm font-normal text-text-secondary">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
          {isNda && <Badge status={project.status} />}
        </div>
        <h3 className="text-h2 font-semibold">{project.title}</h3>
        <p className="text-body-lg font-normal">{project.description}</p>
        <div className="mt-auto pt-2">
          {/* Sampled from Figma's real ProjectCard (Size=large): CTA is the
              filled primary button, not a plain text link -- corrects the
              "tertiary" variant used before, which CLAUDE.md's naming table
              suggested but the actual component doesn't use.
              NDA cards are the one exception: sampled directly from the real
              Rega card (node 2928:73731), the CTA there is the outline
              secondary button, not primary -- I'd applied primary
              universally before, which Flore caught. */}
          <ButtonLink variant={isNda ? 'secondary' : 'primary'} {...cardLink}>
            {project.cta}
            {isNda && <ExternalLinkIcon width={16} height={16} />}
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
