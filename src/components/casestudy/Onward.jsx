import Block from './Block'
import ProjectCard from '../ProjectCard'
import ButtonLink from '../ButtonLink'
import { MEASURE } from '../../lib/caseStudyLayout'

// NOT RENDERED ANYWHERE, since 2026-08-30. Read this before editing it.
//
// The component lost both halves to other things, one at a time:
//
//   the next-project card  ->  `ProjectNavigation`, the prev/next band
//                              ProjectPage renders on every subpage (2026-08-27)
//   the contact half       ->  `CaseStudyContact`, the real contact section
//                              every subpage now ends on (2026-08-30)
//
// The second move is what emptied it. Onward's contact half was a prompt and
// one CTA that navigated to the HOMEPAGE's contact section; the subpage nav's
// Contact button now has to land on the page you are already reading, so that
// block had to become a contact section rather than a signpost to one.
//
// Kept rather than deleted because the reasoning below is still the record of
// how the case-study endings were designed, and because restoring the
// next-project card is passing `project` again. `data.onward` is still in the
// content files for the same reason. Flagged to Flore as a deletion she can
// make in one line if she'd rather not carry it.
//
// The page's exit: one curated next project, then a way to get in touch.
//
// The next project renders through the real ProjectCard, not a bespoke
// "next up" card. It's the same object the reader already learned to recognise
// on the homepage -- same media frame, same hover lift, same CTA -- so the end
// of a case study hands them back into the same vocabulary they arrived with.
// It also means this block inherits card fixes for free.
//
// RULE 2 (side-by-side at most once per page): the card and the contact CTA
// are stacked, not placed beside each other. Nothing on this page spends the
// one allowed side-by-side, and it is deliberately not spent here -- a
// two-column ending would put the reader's two possible next actions in
// competition at the exact moment the page wants one of them chosen.
// WIDTH: back to the vocabulary's default `wide`. It was briefly `medium` to
// avoid clashing with a `wide` momentum-curve block above it; that block is now
// `medium` itself (see CaseStudy.jsx), so the default is free again and the
// divider under the card spans the full content width as intended.
export default function Onward({ heading, project, contact }) {
  return (
    // `medium`, not `wide` — changed 2026-08-14 so the momentum panel above can
    // take the full content width (Flore's call). Rule 1 allows only one of the
    // two to be `wide`, and this block is a single 562-wide card plus a CTA,
    // which never filled 1184; the divider now spans 860 instead.
    <Block width="medium" className="flex flex-col gap-space-40 2xl:gap-space-64">
      {/* Was `uppercase tracking-[0.08em]`. Both came out of my own v2 pass,
          not the design file: every text style in the Figma frame sets
          letterSpacing 0, and there is no uppercase eyebrow anywhere on the
          page. Removed rather than kept, so the only tracking override left in
          the codebase is the documented one on button labels (see
          ButtonLink.jsx, Flore's call). This now matches SectionHeader's own
          eyebrow treatment. */}
      {/* THE NEXT-PROJECT CARD IS OPTIONAL, AND IS NOW ALWAYS OMITTED --
          2026-08-27. Moving between projects became `ProjectNavigation`, a
          prev/next band ProjectPage renders on every subpage, so a curated
          next-project card here would be the second answer to the same
          question in the same screen.

          What is left is the CONTACT half, which is not navigation and was
          never duplicated: a prompt and one CTA to the homepage's Contact
          section. Flore asked for the page navigation to be replaced, not for
          the contact exit to be deleted, so it stays.

          The heading goes with the card rather than surviving it -- it names
          the card ("What's next"), and on its own above a contact prompt it
          would be a label for nothing. Kept as a prop rather than ripped out
          of the four content files, so restoring the card is passing `project`
          again. */}
      {project && (
        <>
          <h2 className="text-body-sm font-semibold text-text-secondary">{heading}</h2>
          {/* The card is capped rather than filling the wide column: a single
              project card stretched to 1184 stops reading as a card. `medium`
              size is the 2-up homepage variant, which is the closest match to
              this width. */}
          <div className={`w-full ${MEASURE.nextCard}`}>
            <ProjectCard project={project} size="medium" />
          </div>
        </>
      )}

      <div className="flex flex-col gap-space-24 border-t border-border-divider pt-space-40">
        <p className="m-0 text-body-lg font-normal">{contact.prompt}</p>
        {/* A real cross-document link: the Contact section lives on the
            homepage and we are not on it, so a bare `#contact` would look for
            an anchor on this page and find nothing. */}
        <ButtonLink variant="primary" to="/#contact" className="self-start">
          {contact.cta}
        </ButtonLink>
      </div>
    </Block>
  )
}
