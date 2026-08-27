import { Link } from 'react-router-dom'
import ProjectMedia from './ProjectMedia'
import assetUrl from '../lib/assetUrl'
import { LINK_COLOR_CLASS } from './ButtonLink'
import Badge from './Badge'
import { mediaTints, DEFAULT_MEDIA_TINT } from '../lib/mediaTints'

// THE CARD HAS NO CTA BUTTON -- Flore, 2026-08-27, removed from the Figma
// instances first (e.g. the Rega card, node 2928:73731, which now ends at the
// description).
//
// The button was never the click target: the card has always been ONE anchor
// with a stretched `::after` covering the whole article, so the reader was
// already tapping a ~769x702 area and the pill was a LABEL on it. Removing it
// therefore takes nothing off the tap target, which is the usual objection.
// What it does take away is the affordance and the accessible name, so both
// move onto the title below rather than disappearing.
//
// EVERY CARD NOW GOES TO A SUBPAGE. NDA projects used to be the exception --
// their cards opened the live product in a new tab, because there was no page
// to send anyone to. There is now (see CaseStudyNda.jsx), so the special case
// is gone and the live-product link lives on the subpage's hero instead. That
// is also what retired `cta` in the project frontmatter: nothing reads it any
// more, and the subpages carry their own `liveLabel`. Left in the .mdx files
// rather than stripped from ten of them -- flagged to Flore as now-unused.
export default function ProjectCard({ project, size = 'medium' }) {
  return (
    <article
      id={`project-${project.slug}`}
      data-component="project-card"
      data-size={size}
      // scroll-mt keeps the card clear of the fixed nav when it's the target of
      // an anchor jump -- both the map popovers' "View project" links and the
      // "Back to Portfolio" return from a case study. Without it the card's top
      // edge lands underneath the nav pill.
      // `group` so the media frame can lift on hover of the card as a whole
      // (see ProjectMedia); `relative` so the CTA's stretched ::after below
      // has this article as its containing block.
      className="group relative flex w-full min-w-0 scroll-mt-space-120 flex-col gap-space-16 2xl:gap-space-24"
    >
      <ProjectMedia
        src={assetUrl(project.thumbnail)}
        alt={project.title}
        caption={project.imageCaption}
        size={size}
        tint={mediaTints[project.slug] || DEFAULT_MEDIA_TINT}
        badge={<Badge status={project.status} />}
      />
      <div
        data-component="project-card-content"
        // 12 at laptop, 16 at both ends. Card-internal gaps are small terms --
        // this pass takes about 30px total out of the text block, against the
        // 200 the media and the column drop take out. They are here so the card
        // tightens as one object rather than having a compact photo stapled to
        // a roomy caption.
        className="flex flex-1 flex-col gap-space-16 xl:gap-space-12 2xl:gap-space-16"
      >
        {/* Text block structure follows Figma's own wrappers (node 2928:78172):
            meta sits 8px above a title+description pair that are 4px apart.
            Flat siblings at a single gap read as three equally-spaced lines;
            the nesting is what groups the title with its description. */}
        {/* Figma caps this text wrapper at 800 inside the large card's 977-wide
            Content frame (node 4637:5476) -- the CTA below is deliberately not
            capped, it stays at full width. 800/977 is 81.9%, so 80% is the same
            measure expressed proportionally, which is what Flore asked for: it
            holds the line length as the card resizes instead of only being
            right at one width.
            From sm up, not on phones -- there the card is already narrow, and
            taking another 20% off would leave an odd gutter down the side
            rather than fixing a long line. */}
        <div className={`flex flex-col gap-space-8 ${size === 'large' ? 'sm:max-w-[80%]' : ''}`}>
          {/* Figma renders this as one grey line ("AI • Vibecoding"), not
              separate tag chips -- the frontmatter field is `meta`, a single
              pre-joined string, so the separator stays editable content
              rather than something the component invents. */}
          <p data-component="project-card-meta" className="text-body-sm font-normal text-text-secondary">
            {project.meta}
          </p>
          {/* 8 at 402, 4 at 1622 -- the one gap that gets *wider* on mobile.
              Measured, not inferred; flagged to Flore as a possible slip. */}
          <div className="flex flex-col gap-space-8 xl:gap-space-4">
            {/* THE TITLE IS THE CARD'S LINK, and the card's only anchor and tab
                stop -- the role the CTA button used to hold.

                Moving it here rather than deleting it is what keeps the card
                accessible. The anchor's text is the link's ACCESSIBLE NAME, so
                ten cards used to announce as ten links all called "Read case
                study" / "View Project"; they now announce by project, which is
                a real improvement rather than a break-even.

                NO UNDERLINE -- Flore, 2026-08-27, explicitly. The affordance is
                the colour step from `LINK_COLOR_CLASS` (the site's existing
                "menu"/action-link states, which have never carried a hover
                underline either) plus the media frame's lift, which already
                fires from anywhere on the card because of the stretched overlay
                below. Underline stays reserved for the navbar's current-section
                mark. Weight is the title's own `font-semibold`, which is why
                this uses LINK_COLOR_CLASS and not LINK_CLASS -- the latter
                would force bold.

                Stretched link: the `::after` covers the whole card, so the card
                is clickable as a whole while staying ONE anchor and one tab
                stop -- no nested <a>, nothing duplicated for screen readers.
                Known tradeoff, Flore's call 2026-08-05 and unchanged by this:
                the overlay sits above the text, so card copy isn't selectable.

                The FOCUS RING comes with LINK_COLOR_CLASS and draws around the
                title block, not the whole card. Deliberate: it shows what is
                focused, and the title spans the card's width anyway. */}
            <h3 className="text-h2 font-semibold">
              <Link
                to={`/work/${project.slug}`}
                className={`${LINK_COLOR_CLASS} after:absolute after:inset-0 after:content-['']`}
              >
                {project.title}
              </Link>
            </h3>
            <p className="text-body-lg font-normal">{project.description}</p>
          </div>
        </div>
        {/* THE mt-auto SPACER WENT WITH THE BUTTON. It existed to bottom-anchor
            the CTA so cards in a row shared a baseline; with nothing below the
            description there is nothing to push down, and a spacer would only
            add dead height. Cards in a row now end where their copy ends --
            their TOPS still align, because the media frame is a fixed ratio. */}
      </div>
    </article>
  )
}
