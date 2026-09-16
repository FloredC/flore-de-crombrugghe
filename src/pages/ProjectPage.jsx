import { useParams, Navigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Badge from '../components/Badge'
import Container from '../components/Container'
import CaseStudy from '../components/casestudy/CaseStudy'
import CaseStudyArtifakt from '../components/casestudy/CaseStudyArtifakt'
import CaseStudySnapshot from '../components/casestudy/CaseStudySnapshot'
import CaseStudyNda from '../components/casestudy/CaseStudyNda'
import CaseStudyWip from '../components/casestudy/CaseStudyWip'
import ProjectNavigation from '../components/ProjectNavigation'
import { getProjectBySlug, getCaseStudyBySlug, getAdjacentProjects } from '../lib/content'
import { CASE_STUDY_OUTRO } from '../lib/chapters'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  // A project with a case-study module renders a built page; the rest keep
  // the original stub until they're built. Deliberately a per-page opt-in
  // rather than a flag day -- the system is being discovered by building it
  // (CASE-STUDY-SYSTEM.md), so the remaining four shouldn't be migrated onto
  // it sight unseen.
  const caseStudy = getCaseStudyBySlug(slug)

  // NDA PROJECTS NOW HAVE PAGES, added 2026-08-27.
  //
  // This route used to redirect every `nda-project` straight to `/`, because
  // those four had no page to show — their cards linked off-site to the live
  // product instead. Figma's `NDA` section (node 4980:7811) gave all four a
  // real subpage, so the blanket redirect is gone.
  //
  // The guard it leaves behind is narrower and still worth having: an NDA
  // project with NO case-study module has nothing to render but the stub
  // <article> below, which would be a near-empty page carrying a real project's
  // name. Sending it home is the better failure. Every NDA project has a module
  // today, so this is a floor, not a live branch.
  if (!project || (project.status === 'nda-project' && !caseStudy)) {
    return <Navigate to="/" replace />
  }

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
    // The NDA tier — four slugs, one layout, same reasoning as the snapshots
    // above. See CaseStudyNda.jsx.
    rega: CaseStudyNda,
    myride: CaseStudyNda,
    'trail-app': CaseStudyNda,
    sbb: CaseStudyNda,
    // Hero plus one paragraph, while the real content is written. See
    // CaseStudyWip.jsx for why this is its own layout and not a reuse.
    'welcome-to-my-island': CaseStudyWip,
  }
  // Falls back to the PitchPivot composition, which is the reference
  // implementation -- a new content module with no registry entry renders
  // through the block system rather than crashing the route.
  const CaseStudyLayout = LAYOUTS[slug] ?? CaseStudy

  return (
    <>
      {/* CONTACT STAYS ON THIS PAGE. Every case-study layout now ends on the
          shared contact block, so the nav's Contact button scrolls down to it
          instead of navigating back to the homepage's — Flore, 2026-08-30.

          Passed from here rather than defaulted inside Nav, because Nav is also
          the process-log pages' nav and those have no contact block of their
          own; the default stays the homepage so a page without the block can't
          end up with a button that goes nowhere.

          The stub <article> branch below has no contact block either, but
          nothing reaches it today (all ten projects have a case-study module),
          and it is a floor rather than a live branch — flagged rather than
          guarded, since guarding it would mean threading a second condition
          through for a case that cannot currently happen. */}
      <Nav contactHref={`#${CASE_STUDY_OUTRO}`} />
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
      {/* PREV/NEXT LIVES HERE, NOT INSIDE A LAYOUT -- added 2026-08-27, and
          moved out of CaseStudyNda when it went onto every subpage.

          OUTSIDE <main>, deliberately. The band is a full-bleed rule-topped
          strip that belongs against the footer; rendered inside <main> it sat
          above that element's `pb-space-140 2xl:pb-space-200`, which put a
          screen of empty white between the band and the footer.

          ONE WIRING POINT rather than a call in each of the four layouts: this
          is navigation between pages, not part of any page's composition, and
          every subpage gets exactly the same treatment — including the stub
          <article> branch above, which as of 2026-08-27 nothing reaches: every
          one of the ten projects now has a case-study module. The branch stays
          as the floor for the next project added before its page exists. */}
      <ProjectNavigation {...getAdjacentProjects(slug)} />
      <Footer />
    </>
  )
}
