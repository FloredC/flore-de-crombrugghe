import Block from './Block'
import Frame from './Frame'
import emphasise from '../../lib/emphasis'
import { ARTIFAKT } from '../../lib/caseStudyLayout'
import CaseStudyContact from './CaseStudyContact'

/**
 * The WORK-IN-PROGRESS layout — a hero and a short body, and nothing else.
 *
 * One page uses it today: Welcome to my island (Figma frame
 * `Subpage_welcome to my island`, node 4969:7203). Flore, 2026-08-27: "It's a
 * work in progress, but I think it's nice to add a bit more info nonetheless."
 *
 * The frame really is this short. It is 4482 tall and its content stops at
 * y=1101 — a finished hero, then one paragraph, then ~3,400px of empty
 * canvas waiting to be filled. So this is not a thin reading of a rich design;
 * it is the whole design as it currently stands.
 *
 * WHY ITS OWN LAYOUT RATHER THAN A REUSE:
 *
 *   CaseStudyNda is the closest shape (hero + minimal body) but its columns
 *   are a two-up grid and, more to the point, the tier means something —
 *   "there is no process to show because the work is under NDA". This page is
 *   the opposite: the process is the subject, it just is not written yet.
 *   Rendering it through the NDA layout would file it under the wrong reason.
 *
 *   CaseStudy / CaseStudyArtifakt both expect a full block sequence and would
 *   need most of their slots stubbed out.
 *
 * This file is deliberately small and deliberately temporary. When the real
 * content lands, this page graduates to its own composition the way Artifakt
 * did, and this layout either follows the next work-in-progress page or is
 * deleted. It should not accumulate features in the meantime — a growing
 * "WIP" layout is just a fourth case-study system with a apologetic name.
 */
export default function CaseStudyWip({ data }) {
  return (
    <article data-component="case-study-wip" data-slug={data.slug}>
      <Frame {...data.frame} />

      {/* Same opening gap as the section break elsewhere on the site. The frame
          puts 91px between the stage's bottom edge (900) and the paragraph
          (991), which sits between the 80 and 100 ends of this ramp. */}
      <div className="pt-space-80 xl:pt-space-100 2xl:pt-space-140">
        {/* THE SECTION TITLE IS HIDDEN IN THE FRAME (node 4969:7307 carries
            `hidden`), so the body opens straight into prose with no heading.
            Reproduced rather than "fixed": a heading over a single paragraph
            of placeholder copy would be scaffolding pretending to be
            structure. */}
        <Block width="wide">
          <div className={ARTIFAKT.prose}>
            {data.body.map((paragraph, index) => (
              // `text-body-lg` is Desktop/body-lg (20), which is what the frame
              // sets — one step ABOVE the NDA tier's 18 and the same size the
              // two full case studies use for prose. Bold because the frame
              // sets Bold; see the note in the content file about what this
              // paragraph currently is.
              <p key={index} className="m-0 text-body-lg font-bold">
                {emphasise(paragraph)}
              </p>
            ))}
          </div>
        </Block>
      </div>

      {/* Same exit as every other subpage -- the nav's Contact button has to
          land somewhere on this page too, placeholder body or not. */}
      <div className="pt-space-80 xl:pt-space-100 2xl:pt-space-140">
        <CaseStudyContact {...data.contact} />
      </div>
    </article>
  )
}
