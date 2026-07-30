import hotspotsData from '../content/hero-map-hotspots.json'

const projectModules = import.meta.glob('../content/projects/*.mdx', { eager: true })
const sectionModules = import.meta.glob('../content/sections/*.mdx', { eager: true })

export const projects = Object.values(projectModules)
  .map((mod) => ({ ...mod.frontmatter, Body: mod.default }))
  .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}

export function getProjectsFor(zone, subsection) {
  return projects.filter(
    (project) => project.breadcrumbZone === zone && project.breadcrumbSubsection === subsection
  )
}

function sectionFrontmatter(path) {
  return sectionModules[`../content/sections/${path}.mdx`]?.frontmatter
}

export const workSection = sectionFrontmatter('work')
export const approachSection = sectionFrontmatter('approach')
export const aboutSection = sectionFrontmatter('about')
export const contactSection = sectionFrontmatter('contact')

export const hotspots = hotspotsData
