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
        // NO TOP PADDING — removed 2026-08-14. It was `pt-space-120
        // xl:pt-space-160`, to clear the fixed nav pill (which is out of flow
        // and reserves no space of its own). That worked while the hero was a
        // plain stage, but once the hero took the notebook grid the padding
        // became a white band ABOVE the grid: the page appeared to start, then
        // shift down into a second surface. Flore saw it as the page "moving
        // down" on scroll.
        //
        // The clearance did not disappear, it moved INTO the hero (Frame.jsx),
        // so the grid now starts at the very top of the page and the nav floats
        // over it, which is what a full-bleed stage is for.
        // pb still matches the homepage's last-section-to-footer gap (200).
        <main className="pb-space-140 xl:pb-space-200">
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
