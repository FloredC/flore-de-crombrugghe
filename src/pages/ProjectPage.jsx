import { useParams, Navigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Badge from '../components/Badge'
import Container from '../components/Container'
import { getProjectBySlug } from '../lib/content'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project || project.status === 'nda-project') {
    return <Navigate to="/" replace />
  }

  const { Body } = project

  return (
    <>
      <Nav />
      <article data-component="project-page" className="py-12">
        <Container className="flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            {project.status === 'full-case-study' && <Badge status={project.status} />}
            <h1 className="text-h1 font-bold">{project.title}</h1>
            {/* `meta` replaced the old `tags` array when the real card copy
                landed -- Figma renders one pre-joined grey line, not chips. */}
            <p data-component="project-meta" className="text-body-sm font-normal text-text-secondary">
              {project.meta}
            </p>
          </header>
          <div data-component="project-body" className="max-w-[720px]">
            <Body />
          </div>
        </Container>
      </article>
      <Footer />
    </>
  )
}
