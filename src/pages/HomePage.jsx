import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Wayfinding from '../components/Wayfinding'
import ProjectCard from '../components/ProjectCard'
import ValueCard from '../components/ValueCard'
import MediaCard from '../components/MediaCard'
import AsideCard from '../components/AsideCard'
import ButtonLink from '../components/ButtonLink'
import Footer from '../components/Footer'
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
    <div data-component="work-subsection">
      <Wayfinding
        zone={subsection.zone}
        subsection={subsection.subsection}
        bubbleCopy={subsection.bubbleCopy}
      />
      <div data-component="project-grid" data-layout={subsection.layout}>
        {subsection.layout === 'featured' && featured && (
          <ProjectCard project={featured} size="large" />
        )}
        {(subsection.layout === 'featured' ? rest : projects).map((project) => (
          <ProjectCard key={project.slug} project={project} size="medium" />
        ))}
      </div>
    </div>
  )
}

function ApproachSubsection({ subsection }) {
  return (
    <div data-component="approach-subsection">
      <Wayfinding
        zone={subsection.zone}
        subsection={subsection.subsection}
        bubbleCopy={subsection.bubbleCopy}
      />
      {subsection.layout === 'value-cards' && (
        <div data-component="value-card-grid">
          {subsection.valueCards.map((item) => (
            <ValueCard key={item.title} item={item} />
          ))}
        </div>
      )}
      {subsection.layout === 'media-grid' && (
        <div data-component="media-card-grid">
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
      <Nav />
      <Hero />

      <section id="work" data-component="section-work">
        <h2>{workSection.sectionHeader}</h2>
        {workSection.subsections.map((subsection) => (
          <WorkSubsection key={`${subsection.zone}-${subsection.subsection}`} subsection={subsection} />
        ))}
      </section>

      <section id="approach" data-component="section-approach">
        <h2>{approachSection.sectionHeader}</h2>
        {approachSection.subsections.map((subsection) => (
          <ApproachSubsection key={`${subsection.zone}-${subsection.subsection}`} subsection={subsection} />
        ))}
      </section>

      <section id="about" data-component="section-about">
        <h2>{aboutSection.sectionHeader}</h2>
        <Wayfinding
          zone={aboutSection.zone}
          subsection={aboutSection.subsection}
          bubbleCopy={aboutSection.bubbleCopy}
        />
        <div data-component="language-river">
          {/* PLACEHOLDER_LANGUAGE_RIVER_EMBED_URL — not a final hosting URL, flagged by Flore. Confirm before wiring a real iframe src. */}
          <p>Language River embed placeholder — waiting on a confirmed hosting URL from Flore.</p>
        </div>
        <div data-component="aside-grid">
          {aboutSection.asideCards.map((item) => (
            <AsideCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section id="contact" data-component="section-contact">
        <Wayfinding
          zone={contactSection.zone}
          subsection={contactSection.subsection}
          bubbleCopy={contactSection.bubbleCopy}
        />
        <h2>{contactSection.heading}</h2>
        <p>{contactSection.description}</p>
        <div data-component="contact-links" style={{ display: 'flex', gap: 16 }}>
          {contactSection.links.map((link) => (
            <ButtonLink key={link.label} variant="primary" href={link.href}>
              {link.label}
            </ButtonLink>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
