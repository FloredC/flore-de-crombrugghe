import ProjectMedia from './ProjectMedia'
import ButtonLink from './ButtonLink'
import Badge from './Badge'
import { ExternalLinkIcon } from './icons'
import { mediaTints, DEFAULT_MEDIA_TINT } from '../lib/mediaTints'

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
      className="flex w-full min-w-0 flex-col gap-space-16 xl:gap-space-24"
    >
      <ProjectMedia
        src={project.thumbnail}
        alt={project.title}
        caption={project.imageCaption}
        size={size}
        tint={mediaTints[project.slug] || DEFAULT_MEDIA_TINT}
        badge={<Badge status={project.status} />}
      />
      <div data-component="project-card-content" className="flex flex-1 flex-col gap-space-16">
        {/* Text block structure follows Figma's own wrappers (node 2928:78172):
            meta sits 8px above a title+description pair that are 4px apart.
            Flat siblings at a single gap read as three equally-spaced lines;
            the nesting is what groups the title with its description. */}
        <div className="flex flex-col gap-space-8">
          {/* Figma renders this as one grey line ("AI • Vibecoding"), not
              separate tag chips -- the frontmatter field is `meta`, a single
              pre-joined string, so the separator stays editable content
              rather than something the component invents. */}
          <p data-component="project-card-meta" className="text-body-sm font-normal text-text-secondary">
            {project.meta}
          </p>
          {/* 8 at 402, 4 at 1622 -- the one gap that gets *wider* on mobile.
              Measured, not inferred; flagged to Flore as a possible slip. */}
          <div className="flex flex-col gap-space-8 xl:gap-space-4">
            <h3 className="text-h2 font-semibold">{project.title}</h3>
            <p className="text-body-lg font-normal">{project.description}</p>
          </div>
        </div>
        {/* Figma puts a flex-1 spacer between the text and the button, so the
            two 16px container gaps compose to a 32px minimum before the
            spacer grows. mt-auto + pt reproduces that without an empty node. */}
        <div className="mt-auto pt-space-16">
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
