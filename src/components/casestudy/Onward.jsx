import Block from './Block'
import ProjectCard from '../ProjectCard'
import ButtonLink from '../ButtonLink'
import { MEASURE } from '../../lib/caseStudyLayout'

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
    <Block width="wide" className="flex flex-col gap-space-40 xl:gap-space-64">
      {/* Was `uppercase tracking-[0.08em]`. Both came out of my own v2 pass,
          not the design file: every text style in the Figma frame sets
          letterSpacing 0, and there is no uppercase eyebrow anywhere on the
          page. Removed rather than kept, so the only tracking override left in
          the codebase is the documented one on button labels (see
          ButtonLink.jsx, Flore's call). This now matches SectionHeader's own
          eyebrow treatment. */}
      <h2 className="text-body-sm font-semibold text-text-secondary">{heading}</h2>

      {/* The card is capped rather than filling the wide column: a single
          project card stretched to 1184 stops reading as a card. `medium`
          size is the 2-up homepage variant, which is the closest match to
          this width. */}
      {project && (
        <div className={`w-full ${MEASURE.nextCard}`}>
          <ProjectCard project={project} size="medium" />
        </div>
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
