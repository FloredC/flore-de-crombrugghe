import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Wayfinding from "../components/Wayfinding";
import Reveal from "../components/Reveal";
import ProjectCard from "../components/ProjectCard";
import ValueCard from "../components/ValueCard";
import MediaCard from "../components/MediaCard";
import AsideCard from "../components/AsideCard";
import LanguageRiverEmbed from "../components/LanguageRiverEmbed";
import ButtonLink from "../components/ButtonLink";
import ContactEmailButton from "../components/ContactEmailButton";
import Footer from "../components/Footer";
import Container from "../components/Container";
// Imported rather than read from contact.mdx frontmatter as a path string.
// One fixed asset for one component, so an import buys the thing frontmatter
// paths can't have: Vite rewrites the URL, which means the GitHub Pages base
// prefix is applied automatically and this can't join the class of bugs that
// broke five thumbnails in production while looking fine in dev.
import portraitFlore from "../assets/illustrations/portrait-flore.webp";
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
} from "../lib/layout";
import {
  workSection,
  approachSection,
  aboutSection,
  contactSection,
  getProjectsFor,
} from "../lib/content";

function WorkSubsection({ subsection }) {
  const projects = getProjectsFor(subsection.zone, subsection.subsection);
  const [featured, ...rest] = projects;

  return (
    // THE SUBSECTION IS THE REVEAL GROUP, not the whole Work section: a
    // visitor meets these one zone at a time, and one group per zone is what
    // makes the wayfinding row lead its own cards instead of eight rows and
    // twenty cards all arriving on the first scroll.
    <Reveal
      data-component="work-subsection"
      className={`flex flex-col ${WAYFINDING_GAP}`}
    >
      <Wayfinding
        zone={subsection.zone}
        subsection={subsection.subsection}
        bubbleCopy={subsection.bubbleCopy}
        // ONE ROW STILL NAMES ITS AVATAR. The Lab -- Own products row used to
        // name one too ('presenting-idle'); that drawing is now Wayfinding's
        // default for every row, so asking for it by name would be a value
        // nothing reads. Rega is the exception because it has its own animation.
        //
        // Keyed on zone AND subsection: "Harbour" appears twice in Work (Client
        // work at scale, Feature cases), so zone alone would light up a row that
        // wasn't asked for. Rega lives in "Client work at scale".
        avatarVariant={
          subsection.zone === "Harbour" &&
          subsection.subsection === "Client work at scale"
            ? "rega-wind"
            : undefined
        }
      />
      {subsection.layout === "featured" && (
        <div className={WORK_FEATURED_STACK}>
          {/* Artifakt spans 10 of 12 columns, not the full container width. */}
          {/* `data-reveal` rather than `data-reveal-cards`: the featured row
              holds one card, so there is nothing to stagger against and it
              should arrive on the block beat, not the faster card one. */}
          <div
            className={WORK_FEATURED_ROW}
            data-reveal
            style={{ "--reveal-index": 1 }}
          >
            {featured && (
              <div className={WORK_FEATURED_CARD}>
                <ProjectCard project={featured} size="large" />
              </div>
            )}
          </div>
          <div className={WORK_GRID_2UP} data-reveal-cards>
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} size="medium" />
            ))}
          </div>
        </div>
      )}
      {subsection.layout === "grid-2x2" && (
        <div className={WORK_GRID_2UP} data-reveal-cards>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} size="medium" />
          ))}
        </div>
      )}
      {subsection.layout === "grid-3" && (
        <div className={WORK_GRID_3UP} data-reveal-cards>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} size="small" />
          ))}
        </div>
      )}
    </Reveal>
  );
}

// Both Approach rows sit in the Plaza zone, so the subsection name is what
// distinguishes them. An undefined value is the "no variant" case Wayfinding
// already falls through on, so a row that isn't listed needs nothing here.
const APPROACH_AVATAR = {
  "Design Principles": "principles",
  "Selected talks & writing": "talks",
}

function ApproachSubsection({ subsection }) {
  return (
    <Reveal
      data-component="approach-subsection"
      className={`flex flex-col ${WAYFINDING_GAP}`}
    >
      <Wayfinding
        zone={subsection.zone}
        subsection={subsection.subsection}
        bubbleCopy={subsection.bubbleCopy}
        breadcrumbHidden={subsection.breadcrumbHidden}
        // Keyed on zone AND subsection for the same reason Rega is: "Plaza"
        // appears twice in Approach, and both of its rows now have their own
        // avatar, so zone alone would resolve to whichever came first.
        avatarVariant={APPROACH_AVATAR[subsection.subsection]}
      />
      {subsection.layout === "value-cards" && (
        <div className={VALUE_CARD_GRID} data-reveal-cards>
          {subsection.valueCards.map((item) => (
            <ValueCard key={item.title} item={item} />
          ))}
        </div>
      )}
      {subsection.layout === "media-grid" && (
        <div
          data-component="media-collage"
          className={COLLAGE_GRID}
          data-reveal-cards
        >
          {subsection.mediaCards.map((item, i) => (
            <div key={item.href} className={MEDIA_COLLAGE[i] || ""}>
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      )}
    </Reveal>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Nav />

      <div className={PAGE_STACK}>
        <section
          id="work"
          data-component="section-work"
          className={SECTION_PAD_WORK}
        >
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
            <h2 className="text-h1 font-bold">
              {approachSection.sectionHeader}
            </h2>
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
            <Reveal className={`flex flex-col ${WAYFINDING_GAP}`}>
              <Wayfinding
                zone={aboutSection.zone}
                subsection={aboutSection.subsection}
                bubbleCopy={aboutSection.bubbleCopy}
              />
              <div className={ABOUT_CONTENT_GAP}>
                {/* The river is one block on the beat after the Guide; the
                    cards below it stagger among themselves. */}
                <div data-reveal style={{ "--reveal-index": 1 }}>
                  <LanguageRiverEmbed
                    src={aboutSection.languageRiver.embedSrc}
                    title={aboutSection.languageRiver.title}
                  />
                </div>
                <div
                  data-component="aside-collage"
                  className={ASIDE_COLLAGE_GRID}
                  data-reveal-cards
                >
                  {aboutSection.asideCards.map((item, i) => (
                    <div key={item.title} className={ASIDE_COLLAGE[i] || ""}>
                      <AsideCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section
          id="contact"
          data-component="section-contact"
          className={SECTION_PAD_CONTACT}
        >
          <Container>
            {/* Reveal INSIDE Container, not `as={Container}`: that component
                takes only children/className/id by design and would drop the
                ref, so the observer would never attach and this section would
                stay hidden for good. The flex row moves down here with it. */}
            <Reveal className={`flex flex-col ${WAYFINDING_GAP}`}>
              {/* No Guide in this one -- Contact's Wayfinding is the breadcrumb
                alone (see contact.mdx), so the row and the card below it are
                the two beats here. */}
              <div data-reveal style={{ "--reveal-index": 0 }}>
                <Wayfinding
                  zone={contactSection.zone}
                  subsection={contactSection.subsection}
                  bubbleCopy={contactSection.bubbleCopy}
                />
              </div>
              {/* Portrait beside the text on desktop, stacked above it on mobile
                (Flore's call -- portrait first, then heading, copy, buttons).
                Figma has no mobile Contact frame at all, so the stacking order
                is hers rather than sampled. items-center matches the desktop
                node, where the 180px portrait sits 16.5px from the top and
                bottom of the 213px row.

                RENDERED AT 187, NOT 180, and with no CSS shadow: the export
                carries the circle's drop shadow baked in as a ~7px
                semi-transparent halo (measured -- the fully-opaque circle runs
                7..366 of 374, i.e. exactly 180 CSS px at 2x). Sizing the file
                at 180 would shrink the visible circle to ~173 and adding a CSS
                shadow on top would double it. The negative margin pulls the
                layout box back to 180 so the halo overlaps rather than
                displacing the 48px gap -- what you measure in Figma is the
                circle, not the shadow. */}
              <div
                className="flex flex-col items-start gap-space-24 md:flex-row md:items-center md:gap-space-48"
                data-reveal
                style={{ "--reveal-index": 1 }}
              >
                <img
                  src={portraitFlore}
                  alt="Flore de Crombrugghe"
                  width={187}
                  height={187}
                  className="-m-[3.5px] w-[187px] shrink-0"
                />
                {/* 846px in Figma -- off both column grids, so it reads as a
                  readable-measure cap on the text block rather than a span. */}
                <div className="flex max-w-[846px] flex-col gap-space-16">
                  <h2 className="text-h2 font-semibold">
                    {contactSection.heading}
                  </h2>
                  <p className="text-body-lg font-normal">
                    {contactSection.description}
                  </p>
                  {/* Sampled from the real Contact Section node (2928:73875):
                    LinkedIn as the filled primary button, the email
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
              </div>
            </Reveal>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
}
