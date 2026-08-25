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

export const hotspots = hotspotsData
