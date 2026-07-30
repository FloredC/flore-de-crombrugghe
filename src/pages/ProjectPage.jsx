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
            <h1>{project.title}</h1>
            <div data-component="project-tags" className="flex gap-2">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
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
