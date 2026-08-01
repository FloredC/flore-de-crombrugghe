import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Wayfinding from '../components/Wayfinding'
import ProjectCard from '../components/ProjectCard'
import ValueCard from '../components/ValueCard'
import MediaCard from '../components/MediaCard'
import AsideCard from '../components/AsideCard'
import ButtonLink from '../components/ButtonLink'
import Footer from '../components/Footer'
import Container from '../components/Container'
import {
  workSection,
  approachSection,
  aboutSection,
  contactSection,
  getProjectsFor,
} from '../lib/content'

function WorkSubsection({ subsection }) {
  const projects = getProjectsFor(subsection.zone, subsection.subsection)
  const [featured, ...rest] = projects

  return (
    <div data-component="work-subsection" className="flex flex-col gap-8">
      <Wayfinding
        zone={subsection.zone}
        subsection={subsection.subsection}
        bubbleCopy={subsection.bubbleCopy}
      />
      {subsection.layout === 'featured' && (
        <div className="flex flex-col gap-8">
          {featured && <ProjectCard project={featured} size="large" />}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} size="medium" />
            ))}
          </div>
        </div>
      )}
      {subsection.layout === 'grid-2x2' && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} size="medium" />
          ))}
        </div>
      )}
      {subsection.layout === 'grid-3' && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} size="small" />
          ))}
        </div>
      )}
    </div>
  )
}

function ApproachSubsection({ subsection }) {
  return (
    <div data-component="approach-subsection" className="flex flex-col gap-8">
      <Wayfinding
        zone={subsection.zone}
        subsection={subsection.subsection}
        bubbleCopy={subsection.bubbleCopy}
      />
      {subsection.layout === 'value-cards' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {subsection.valueCards.map((item) => (
            <ValueCard key={item.title} item={item} />
          ))}
        </div>
      )}
      {subsection.layout === 'media-grid' && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {subsection.mediaCards.map((item) => (
            <MediaCard key={item.href} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Nav />

      <section id="work" data-component="section-work" className="py-20">
        <Container className="flex flex-col gap-12">
          <h2 className="mb-4 text-h1 font-bold">{workSection.sectionHeader}</h2>
          {workSection.subsections.map((subsection) => (
            <WorkSubsection key={`${subsection.zone}-${subsection.subsection}`} subsection={subsection} />
          ))}
        </Container>
      </section>

      <section id="approach" data-component="section-approach" className="py-20">
        <Container className="flex flex-col gap-12">
          <h2 className="mb-4 text-h1 font-bold">{approachSection.sectionHeader}</h2>
          {approachSection.subsections.map((subsection) => (
            <ApproachSubsection key={`${subsection.zone}-${subsection.subsection}`} subsection={subsection} />
          ))}
        </Container>
      </section>

      <section id="about" data-component="section-about" className="py-20">
        <Container className="flex flex-col gap-8">
          <h2 className="text-h1 font-bold">{aboutSection.sectionHeader}</h2>
          <Wayfinding
            zone={aboutSection.zone}
            subsection={aboutSection.subsection}
            bubbleCopy={aboutSection.bubbleCopy}
          />
          <div data-component="language-river" className="flex aspect-video items-center justify-center border border-dashed border-gray-300">
            {/* PLACEHOLDER_LANGUAGE_RIVER_EMBED_URL — not a final hosting URL, flagged by Flore. Confirm before wiring a real iframe src. */}
            <p>Language River embed placeholder — waiting on a confirmed hosting URL from Flore.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {aboutSection.asideCards.map((item) => (
              <AsideCard key={item.title} item={item} />
            ))}
          </div>
        </Container>
      </section>

      <section id="contact" data-component="section-contact" className="py-20">
        <Container className="flex flex-col gap-4">
          <Wayfinding
            zone={contactSection.zone}
            subsection={contactSection.subsection}
            bubbleCopy={contactSection.bubbleCopy}
          />
          <h2 className="text-h2 font-semibold">{contactSection.heading}</h2>
          <p className="text-body-lg font-normal">{contactSection.description}</p>
          <div className="flex gap-4">
            {contactSection.links.map((link) => (
              <ButtonLink key={link.label} variant="primary" href={link.href}>
                {link.label}
              </ButtonLink>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </>
  )
}
