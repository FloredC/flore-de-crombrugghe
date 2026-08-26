import { useParams, Navigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Badge from '../components/Badge'
import Container from '../components/Container'
import CaseStudy from '../components/casestudy/CaseStudy'
import CaseStudyArtifakt from '../components/casestudy/CaseStudyArtifakt'
import CaseStudySnapshot from '../components/casestudy/CaseStudySnapshot'
import { getProjectBySlug, getCaseStudyBySlug } from '../lib/content'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project || project.status === 'nda-project') {
    return <Navigate to="/" replace />
  }

  // A project with a case-study module renders a built page; the rest keep
  // the original stub until they're built. Deliberately a per-page opt-in
  // rather than a flag day -- the system is being discovered by building it
  // (CASE-STUDY-SYSTEM.md), so the remaining four shouldn't be migrated onto
  // it sight unseen.
  const caseStudy = getCaseStudyBySlug(slug)

  // WHY A REGISTRY AND NOT ONE COMPONENT, added 2026-08-21 with Artifakt.
  //
  // The two built case studies share the visual system -- Frame, SectionHeader,
  // Media, Container, ButtonLink, the spacing tokens -- but not the
  // composition, because the Figma frames genuinely differ in structure:
  // PitchPivot is a fixed sequence of named, typed evidence slots (StatGrid,
  // QuoteCards, FeatureBlocks, RankedBars); Artifakt is an ordered list of
  // prose-plus-media sections with no evidence components at all.
  //
  // A single component covering both would need a branch per section type and
  // would let a change made for one page reach the other by accident. A lookup
  // keyed on slug keeps each page's layout decisions inside its own file, and
  // adding the next case study is one entry here plus one component.
  //
  // Keyed on slug rather than on a `layout` field in the content file so that
  // content stays content: which React component renders a page is a code
  // decision, and putting a component name in a copy file invites someone to
  // "fix" it during a content edit.
  //
  // CaseStudySnapshot is the first entry meant to serve SEVERAL slugs -- the
  // three project snapshots (Teamchatviz, then Sinomocene and Roche) are one
  // layout with three content files, which is what makes them a tier rather
  // than three short pages. So it is listed once per slug here, not branched
  // on inside the component.
  const LAYOUTS = {
    pitchpivot: CaseStudy,
    artifakt: CaseStudyArtifakt,
    teamchatviz: CaseStudySnapshot,
    sinomocene: CaseStudySnapshot,
    roche: CaseStudySnapshot,
  }
  // Falls back to the PitchPivot composition, which is the reference
  // implementation -- a new content module with no registry entry renders
  // through the block system rather than crashing the route.
  const CaseStudyLayout = LAYOUTS[slug] ?? CaseStudy

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
        <main className="pb-space-140 2xl:pb-space-200">
          <CaseStudyLayout data={caseStudy} />
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
