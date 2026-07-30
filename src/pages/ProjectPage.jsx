import { useParams, Navigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Badge from '../components/Badge'
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
      <article data-component="project-page">
        <header>
          {project.status === 'full-case-study' && <Badge status={project.status} />}
          <h1>{project.title}</h1>
          <div data-component="project-tags" style={{ display: 'flex', gap: 8 }}>
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>
        <div data-component="project-body">
          <Body />
        </div>
      </article>
      <Footer />
    </>
  )
}
