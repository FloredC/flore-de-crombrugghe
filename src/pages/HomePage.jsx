import assetUrl from '../lib/assetUrl'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Wayfinding from '../components/Wayfinding'
import ProjectCard from '../components/ProjectCard'
import ValueCard from '../components/ValueCard'
import MediaCard from '../components/MediaCard'
import AsideCard from '../components/AsideCard'
import LanguageRiverEmbed from '../components/LanguageRiverEmbed'
import ButtonLink from '../components/ButtonLink'
import ContactEmailButton from '../components/ContactEmailButton'
import Footer from '../components/Footer'
import Container from '../components/Container'
import {
  PAGE_STACK,
  SECTION_PAD_WORK,
  SECTION_PAD_CONTACT,
  SECTION_HEADER_GAP,
  WAYFINDING_GAP,
  SUBSECTION_GAP_WORK,
  SUBSECTION_GAP_EDITORIAL,
  WORK_FEATURED_ROW,
  WORK_FEATURED_CARD,
  WORK_FEATURED_STACK,
  WORK_GRID_2UP,
  WORK_GRID_3UP,
  VALUE_CARD_GRID,
  COLLAGE_GRID,
  ASIDE_COLLAGE_GRID,
  ABOUT_CONTENT_GAP,
  MEDIA_COLLAGE,
  ASIDE_COLLAGE,
} from '../lib/layout'
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
    <div data-component="work-subsection" className={`flex flex-col ${WAYFINDING_GAP}`}>
      <Wayfinding
        zone={subsection.zone}
        subsection={subsection.subsection}
        bubbleCopy={subsection.bubbleCopy}
      />
      {subsection.layout === 'featured' && (
        <div className={WORK_FEATURED_STACK}>
          {/* Artifakt spans 10 of 12 columns, not the full container width. */}
          <div className={WORK_FEATURED_ROW}>
            {featured && (
              <div className={WORK_FEATURED_CARD}>
                <ProjectCard project={featured} size="large" />
              </div>
            )}
          </div>
          <div className={WORK_GRID_2UP}>
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} size="medium" />
            ))}
          </div>
        </div>
      )}
      {subsection.layout === 'grid-2x2' && (
        <div className={WORK_GRID_2UP}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} size="medium" />
          ))}
        </div>
      )}
      {subsection.layout === 'grid-3' && (
        <div className={WORK_GRID_3UP}>
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
    <div data-component="approach-subsection" className={`flex flex-col ${WAYFINDING_GAP}`}>
      <Wayfinding
        zone={subsection.zone}
        subsection={subsection.subsection}
        bubbleCopy={subsection.bubbleCopy}
      />
      {subsection.layout === 'value-cards' && (
        <div className={VALUE_CARD_GRID}>
          {subsection.valueCards.map((item) => (
            <ValueCard key={item.title} item={item} />
          ))}
        </div>
      )}
      {subsection.layout === 'media-grid' && (
        <div data-component="media-collage" className={COLLAGE_GRID}>
          {subsection.mediaCards.map((item, i) => (
            <div key={item.href} className={MEDIA_COLLAGE[i] || ''}>
              <MediaCard item={item} />
            </div>
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

      <div className={PAGE_STACK}>
        <section id="work" data-component="section-work" className={SECTION_PAD_WORK}>
          <Container className={`flex flex-col ${SECTION_HEADER_GAP}`}>
            <h2 className="text-h1 font-bold">{workSection.sectionHeader}</h2>
            <div className={SUBSECTION_GAP_WORK}>
              {workSection.subsections.map((subsection) => (
                <WorkSubsection
                  key={`${subsection.zone}-${subsection.subsection}`}
                  subsection={subsection}
                />
              ))}
            </div>
          </Container>
        </section>

        <section id="approach" data-component="section-approach">
          <Container className={`flex flex-col ${SECTION_HEADER_GAP}`}>
            <h2 className="text-h1 font-bold">{approachSection.sectionHeader}</h2>
            <div className={SUBSECTION_GAP_EDITORIAL}>
              {approachSection.subsections.map((subsection) => (
                <ApproachSubsection
                  key={`${subsection.zone}-${subsection.subsection}`}
                  subsection={subsection}
                />
              ))}
            </div>
          </Container>
        </section>

        <section id="about" data-component="section-about">
          <Container className={`flex flex-col ${SECTION_HEADER_GAP}`}>
            <h2 className="text-h1 font-bold">{aboutSection.sectionHeader}</h2>
            <div className={`flex flex-col ${WAYFINDING_GAP}`}>
              <Wayfinding
                zone={aboutSection.zone}
                subsection={aboutSection.subsection}
                bubbleCopy={aboutSection.bubbleCopy}
              />
              <div className={ABOUT_CONTENT_GAP}>
                <LanguageRiverEmbed
                  src={assetUrl(aboutSection.languageRiver.embedSrc)}
                  title={aboutSection.languageRiver.title}
                />
                <div data-component="aside-collage" className={ASIDE_COLLAGE_GRID}>
                  {aboutSection.asideCards.map((item, i) => (
                    <div key={item.title} className={ASIDE_COLLAGE[i] || ''}>
                      <AsideCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="contact" data-component="section-contact" className={SECTION_PAD_CONTACT}>
          <Container className={`flex flex-col ${WAYFINDING_GAP}`}>
            <Wayfinding
              zone={contactSection.zone}
              subsection={contactSection.subsection}
              bubbleCopy={contactSection.bubbleCopy}
            />
            {/* 846px in Figma -- off both column grids, so it reads as a
                readable-measure cap on the text block rather than a span. */}
            <div className="flex max-w-[846px] flex-col gap-space-16">
              <h2 className="text-h2 font-semibold">{contactSection.heading}</h2>
              <p className="text-body-lg font-normal">{contactSection.description}</p>
              {/* Sampled from the real Contact Section node (2928:73875 /
                  4533:27939): LinkedIn as the filled primary button, the email
                  as a secondary-chrome button that copies to clipboard rather
                  than a mailto link -- matching the "Say hi" popover's own
                  contact pattern (copy, no navigation) rather than the two
                  generic ButtonLinks this rendered before. */}
              {/* flex-col on mobile: the two buttons together are wider than a
                  402px viewport (the email address alone doesn't leave room
                  for LinkedIn beside it), so a single non-wrapping row pushed
                  the second button off-screen. Same stacking pattern already
                  used for the Footer's row at this breakpoint. */}
              <div className="mt-space-32 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-space-24">
                <ButtonLink
                  variant="primary"
                  href={contactSection.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </ButtonLink>
                <ContactEmailButton email={contactSection.email} />
              </div>
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  )
}
