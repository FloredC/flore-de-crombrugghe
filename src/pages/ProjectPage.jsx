import { useParams, Navigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Badge from '../components/Badge'
import Container from '../components/Container'
import CaseStudy from '../components/casestudy/CaseStudy'
import { getProjectBySlug, getCaseStudyBySlug } from '../lib/content'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project || project.status === 'nda-project') {
    return <Navigate to="/" replace />
  }

  // A project with a case-study module renders the block system; the rest keep
  // the original stub until they're built. Deliberately a per-page opt-in
  // rather than a flag day -- PitchPivot is the reference implementation and
  // the system is being discovered by building it (CASE-STUDY-SYSTEM.md), so
  // the other five shouldn't be migrated onto it sight unseen.
  const caseStudy = getCaseStudyBySlug(slug)

  return (
    <>
      <Nav />
      {caseStudy ? (
        // No wrapper padding: the case study's first block sets its own top
        // spacing and its bleed blocks must reach the window edges. A padded
        // wrapper here is what would stop them.
        //
        // pt clears the fixed nav pill, which is out of flow (see Nav.jsx) and
        // therefore reserves no space of its own.
        // pb matches the homepage's own last-section-to-footer gap (200), so
        // a case study meets the footer at the same distance the homepage does.
        <main className="pt-space-120 pb-space-140 xl:pt-space-160 xl:pb-space-200">
          <CaseStudy data={caseStudy} />
        </main>
      ) : (
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
              <project.Body />
            </div>
          </Container>
        </article>
      )}
      <Footer />
    </>
  )
}
