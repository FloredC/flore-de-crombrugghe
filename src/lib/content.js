import hotspotsData from '../content/hero-map-hotspots.json'

const projectModules = import.meta.glob('../content/projects/*.mdx', { eager: true })
const sectionModules = import.meta.glob('../content/sections/*.mdx', { eager: true })

// Case-study page content, one .js module per built page (see
// CASE-STUDY-SYSTEM.md). Deliberately separate from the .mdx above rather
// than folded into it: the .mdx frontmatter describes a project as a *card*
// -- title, tint, CTA, where it sits on the map -- and every project has one.
// A case study is a *page*, with a block structure and typed evidence slots
// that MDX frontmatter would flatten into untyped YAML. Only some projects
// have one, so a missing module is a normal state, not an error.
const caseStudyModules = import.meta.glob('../content/case-studies/*.js', { eager: true })

export const projects = Object.values(projectModules)
  .map((mod) => ({ ...mod.frontmatter, Body: mod.default }))
  .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}

// Sorted by the explicit `order` field, which carries Figma's visual order
// within each subsection. Without it the cards came out in glob order --
// alphabetical by filename -- so all three Work groups were shuffled relative
// to the design (Roche led the feature cases, myRIDE led the client work).
// Nothing in the frontmatter had encoded reading order before this.
export function getProjectsFor(zone, subsection) {
  return projects
    .filter(
      (project) => project.breadcrumbZone === zone && project.breadcrumbSubsection === subsection
    )
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
}

// Matched on the module's own `slug` rather than on its filename, so a page
// can't silently render under the wrong route if a file is ever renamed.
export function getCaseStudyBySlug(slug) {
  return Object.values(caseStudyModules).find((mod) => mod.default?.slug === slug)?.default
}

// The process-log list for a case study, if it publishes one.
//
// A SECOND named export off the same module as the page content, rather than a
// separate data file: the logs are content, and keeping them beside the page
// that links to them means the cards and the /process/:log route cannot end up
// describing different documents. Returns [] rather than undefined so callers
// can map without guarding -- only Artifakt has logs today.
export function getProcessLogs(slug) {
  return Object.values(caseStudyModules).find((mod) => mod.default?.slug === slug)?.processLogs ?? []
}

function sectionFrontmatter(path) {
  return sectionModules[`../content/sections/${path}.mdx`]?.frontmatter
}

export const workSection = sectionFrontmatter('work')
export const approachSection = sectionFrontmatter('approach')
export const aboutSection = sectionFrontmatter('about')
export const contactSection = sectionFrontmatter('contact')

// --- The Work grid's reading order, flattened -------------------------------
//
// Every project in the order a visitor MEETS them on the homepage: each Work
// subsection in the order work.mdx lists them, and inside each one the `order`
// field that `getProjectsFor` already applies.
//
// Derived from the same two sources the homepage renders from rather than
// declared as its own list. A hand-kept sequence here would be a third place
// that encodes reading order, and it would drift the first time a project's
// `order` changed -- silently, because both orders would still look plausible.
export function projectSequence() {
  return workSection.subsections.flatMap((s) => getProjectsFor(s.zone, s.subsection))
}

// The projects either side of `slug` in that sequence, for ProjectNavigation.
//
// DOES NOT WRAP AROUND, and that is Figma's call rather than mine: the
// ProjectNavigation component set ships a `Prev Only` state (node 4999:5305),
// which only has a reason to exist if the last project has no next. So the ends
// of the sequence really are ends. `null` on either side is a normal result.
//
// Returns the project OBJECTS, not slugs -- the nav needs the title and
// thumbnail, and resolving them here keeps the component from reaching back
// into content.
export function getAdjacentProjects(slug) {
  const sequence = projectSequence()
  const index = sequence.findIndex((project) => project.slug === slug)
  // -1 for a project that is somehow not in the Work grid: no neighbours rather
  // than the last and first, which is what a naive index-1/index+1 would give.
  if (index === -1) return { prev: null, next: null }

  // WHY THIS WALKS INSTEAD OF INDEXING (2026-09-01).
  //
  // A `wip` project is one whose page is still a placeholder. The rail is the
  // one place the site actively pushes a reader onward rather than waiting to be
  // clicked, so landing them on a placeholder at the end of a finished case
  // study reads as the whole site being unfinished, not one page. Hence: skip it
  // as a DESTINATION.
  //
  // But only as a destination. The first version of this filtered `wip` out of
  // the sequence itself, which also removed the flagged project's OWN rail and
  // left that page a dead end at the bottom -- Flore caught it on the island
  // page. The two ideas are separate: "don't send readers here" is not "this
  // project isn't in the reading order".
  //
  // So the sequence stays complete, every page keeps its position in it, and
  // only the step outward skips flagged entries. The island page still offers
  // Artifakt and PitchPivot; those two just no longer offer the island.
  //
  // Walking rather than indexing also means consecutive `wip` projects skip
  // correctly, and a run of them to the end of the list yields null, which
  // ProjectNavigation already renders as nothing.
  const step = (direction) => {
    for (let i = index + direction; i >= 0 && i < sequence.length; i += direction) {
      if (!sequence[i].wip) return sequence[i]
    }
    return null
  }

  return { prev: step(-1), next: step(1) }
}

export const hotspots = hotspotsData
