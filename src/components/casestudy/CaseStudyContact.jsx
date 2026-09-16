import Block from './Block'
import ButtonLink from '../ButtonLink'
import ContactEmailButton from '../ContactEmailButton'
import { CASE_STUDY_OUTRO } from '../../lib/chapters'
import { contactSection } from '../../lib/content'

/**
 * The block every subpage ends on: a way to get in touch, on the page you are
 * already reading.
 *
 * WHY THIS IS NOW SHARED -- Flore, 2026-08-30: "The contact button on the
 * subpages should lead to the contact section at the bottom of these specific
 * subpages (not the home page). This means you have to add a contact section on
 * the NDA subpages as well."
 *
 * Before this the ten subpages ended three different ways:
 *
 *   Artifakt        this block, written inline in its own layout
 *   PitchPivot +    `Onward` -- a prompt and one "Say hi" CTA that navigated to
 *   the snapshots   the HOMEPAGE's contact section
 *   the four NDA    nothing at all
 *   pages + the WIP
 *
 * Only the first was a contact section. `Onward`'s half was a signpost pointing
 * off the page, which is exactly what the nav's Contact button must now stop
 * doing -- so pointing the button at it would have satisfied the letter of the
 * request and none of it. Every subpage now ends on the real thing, and the
 * nav has one destination it can always rely on (`ProjectPage` passes
 * `#case-study-outro` as the nav's contact target).
 *
 * NOT IN THE NDA FRAMES, and worth saying so rather than letting it look
 * sampled: Figma draws neither an `Onward` nor a contact block on those four
 * (the note in CaseStudyNda.jsx recorded this when they were built). Flore
 * asked for one, so this reuses the case-study block rather than inventing a
 * fifth ending. If she draws a different one for the NDA tier later, the copy
 * is already a prop.
 *
 * THE COPY COMES IN TWO VOICES, one per tier -- see VOICE below.
 *
 * THE EMAIL AND LINKEDIN URL come from `contact.mdx`, not from a content file
 * or from here. They are facts about Flore rather than about any page, and a
 * second copy is how one of them goes stale.
 */

// TWO VOICES, one per tier -- Flore, 2026-08-30: "'Feedback or comments' should
// only be on the case studies. For the NDA projects and snapshots, it should say
// 'say hi,' as on the homepage."
//
// The distinction is what the page just asked of the reader. A case study is an
// argument they have read to the end, so it can ask what they made of it. A
// snapshot or an NDA page is a short summary of work they cannot see, which has
// earned no such question -- there it is simply an invitation to get in touch,
// in the same words the homepage uses.
//
// `homepage` reads `contact.mdx` rather than restating it, so the two say the
// same thing because they ARE the same thing. `caseStudy`'s wording has no
// other home -- it is sampled from the Artifakt frame's own contact section
// (node 4897:4650) and appears nowhere else in the content model.
const VOICE = {
  caseStudy: {
    heading: 'Feedback or comments?',
    description: 'Always happy to connect, whether remotely or in person.',
  },
  homepage: {
    heading: contactSection.heading,
    description: contactSection.description,
  },
}

export default function CaseStudyContact({
  // Which tier this page belongs to. Defaults to the case studies because they
  // are the tier that owns this block's original wording; the two short tiers
  // opt into the homepage's.
  voice = 'caseStudy',
  heading,
  description,
  // RULE 1 BOOKKEEPING, not a visual knob. The text column is capped at 846
  // below whatever this resolves to, so `medium` and `wide` render identically
  // -- but PitchPivot's layout checker reads `[data-width]` back off the DOM
  // and throws in dev if two consecutive blocks match, so the block still has
  // to be able to say which one it is. `medium` is what `Onward` declared in
  // that sequence, so the pages it replaces keep their width run unchanged.
  width = 'medium',
}) {
  if (!VOICE[voice]) {
    throw new Error(`CaseStudyContact: unknown voice "${voice}". Expected ${Object.keys(VOICE).join(' or ')}.`)
  }
  // An explicit prop still wins over the voice -- Artifakt passes its content
  // file's `contact` object, which happens to carry the same strings.
  const copy = { ...VOICE[voice], ...(heading ? { heading } : {}), ...(description ? { description } : {}) }

  return (
    // The id the subpage nav's Contact button targets, and the same one the
    // Artifakt chapter nav uses to know where the article ends -- see
    // `CASE_STUDY_OUTRO` in lib/chapters.js. One id, one meaning: "the page's
    // reading is over and its actions begin."
    <Block width={width} id={CASE_STUDY_OUTRO} className="flex flex-col gap-space-64">
      <div className="flex max-w-[846px] flex-col gap-space-16">
        <h2 className="m-0 text-h2 font-semibold">{copy.heading}</h2>
        <p className="m-0 text-body-lg font-normal">{copy.description}</p>
        {/* `flex-col` until `sm`: the two buttons together are wider than a
            phone. */}
        <div className="mt-space-24 flex flex-col items-start gap-space-24 sm:flex-row">
          <ButtonLink
            variant="primary"
            href={contactSection.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </ButtonLink>
          {/* A real <button>, not a ButtonLink: it copies to the clipboard
              rather than navigating (see the tag-follows-behavior rule in
              CLAUDE.md). It shares SECONDARY_BUTTON_CLASS so it cannot drift
              from the secondary button beside it. */}
          <ContactEmailButton email={contactSection.email} />
        </div>
      </div>
    </Block>
  )
}
