import AvatarPresentingIdle from '../AvatarPresentingIdle'
import AvatarPrinciples from '../AvatarPrinciples'
import AvatarTalks from '../AvatarTalks'
import AvatarAbout from '../AvatarAbout'
import SpeechBubble from '../SpeechBubble'
import { MEASURE, GUIDE_AVATAR_WIDTH } from '../../lib/caseStudyLayout'

// The Guide making a first-person point: illustration + speech bubble. Two
// instances -- the research reversal in The Turning Point, and the process
// note near the end.
//
// Reuses the homepage's real avatar and `SpeechBubble` rather than a
// lookalike, which is what Figma's "Guide" instance is too (nodes 4774:7579
// and 4825:2590). It is deliberately NOT `Wayfinding`: that component pairs
// the Guide with a DistrictBreadcrumb and belongs at the top of a homepage
// section. Here the Guide appears on its own, mid-page.
//
// THE AVATAR IS THE ANIMATED ONE as of 2026-08-31, matching the homepage --
// Flore's call, and the same placeholder reasoning as the note in Wayfinding.
// It replaced the static `avatar-sections-left.svg`, which is why this file no
// longer imports `Avatar` at all.
//
// The presenting avatar's arm gestures LEFT, into the gap beside the bubble
// rather than at anything -- on the homepage it points at the breadcrumb, and
// there is no breadcrumb here. Kept unflipped: flipping it would aim the gesture
// at the bubble's own tail. Only applies when that avatar is the one selected;
// see AVATAR_BY_KEY below.
//
// WIDTH. Figma draws this bubble at 520, against the map's 300 -- a full
// paragraph on an open page versus a short line beside a crowded map. That is
// why SpeechBubble now takes an optional `maxWidth` (default unchanged, so the
// homepage is untouched). Flagged in the handover as the one shared-component
// change in this pass.
//
// ALIGNMENT. Right-aligned, matching Figma, where the Guide sits at x=933 of a
// 1624 frame in both instances -- it reads as an aside to the section rather
// than as the section's own opening statement. Left-aligned would compete with
// the SectionHeader above it.
// WHICH GUIDE APPEARS, added 2026-09-01 (Flore: "use these avatars on the case
// studies as well, so that they are not always the same"). Before this every
// note on every case study rendered the same drawing.
//
// THE UNIT OF VARIETY IS THE NOTE. Guides alternate between `presenting-idle`
// and `talks` down each page, and the two case studies start on opposite ones
// so they don't open identically.
//
// This was one Guide per page for about an hour on 2026-09-01, on the argument
// that Artifakt's `about` avatar could only read as an exception against a
// constant. Flore overruled it -- she wanted the variety -- and the argument
// turns out not to bite: `about` is a third drawing, so it is still the only
// one that is neither of the two alternating, and it still lands as a break.
// Worth knowing if the rotation ever grows to include `about` itself, because
// THAT is what would actually flatten the representation section back into the
// shuffle.
const AVATAR_BY_KEY = {
  'presenting-idle': AvatarPresentingIdle,
  principles: AvatarPrinciples,
  talks: AvatarTalks,
  about: AvatarAbout,
}

export default function AvatarNote({ body, align = 'end', avatar = 'presenting-idle' }) {
  // Resolved to a component and rendered as <Guide />, never called as
  // AVATAR_BY_KEY[...](). Each avatar owns hooks for its own
  // IntersectionObserver, and a conditional lookup called as a function would
  // run them in this component's fiber with an order that changes per note.
  const Guide = AVATAR_BY_KEY[avatar] ?? AvatarPresentingIdle
  return (
    <div
      data-component="avatar-note"
      // Same reveal treatment as the homepage Guide, and deliberately so: this
      // renders the same avatar and the same SpeechBubble, and one component
      // carries identical behaviour wherever it appears -- the rule already
      // settled for ButtonLink. See globals.css.
      data-reveal-guide
      className={`flex items-center gap-space-8 ${align === 'end' ? 'justify-end' : 'justify-start'}`}
    >
      {/* `shrink-0` because the avatar is now wider than its natural size:
          without it the flex row would squeeze the illustration before the
          bubble gives up any of its 38ch at narrow widths. (The component sets
          it too; kept here so the reason stays at the call site that needs it.) */}
      <Guide width={GUIDE_AVATAR_WIDTH} className="shrink-0" />
      <SpeechBubble variant="right" size="comfortable" maxWidth={MEASURE.guideBubble}>
        {body}
      </SpeechBubble>
    </div>
  )
}
