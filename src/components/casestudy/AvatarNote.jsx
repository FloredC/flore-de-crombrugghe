import Avatar from '../Avatar'
import SpeechBubble from '../SpeechBubble'
import { MEASURE, GUIDE_AVATAR_WIDTH } from '../../lib/caseStudyLayout'

// The Guide making a first-person point: illustration + speech bubble. Two
// instances -- the research reversal in The Turning Point, and the process
// note near the end.
//
// Reuses the homepage's real `Avatar` and `SpeechBubble` rather than a
// lookalike, which is what Figma's "Guide" instance is too (nodes 4774:7579
// and 4774:7661). It is deliberately NOT `Wayfinding`: that component pairs
// the Guide with a DistrictBreadcrumb and belongs at the top of a homepage
// section. Here the Guide appears on its own, mid-page.
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
export default function AvatarNote({ body, align = 'end' }) {
  return (
    <div
      data-component="avatar-note"
      className={`flex items-center gap-space-8 ${align === 'end' ? 'justify-end' : 'justify-start'}`}
    >
      {/* `shrink-0` because the avatar is now wider than its natural size:
          without it the flex row would squeeze the illustration before the
          bubble gives up any of its 38ch at narrow widths. */}
      <Avatar variant="sections-left" width={GUIDE_AVATAR_WIDTH} className="shrink-0" />
      <SpeechBubble variant="right" size="comfortable" maxWidth={MEASURE.guideBubble}>
        {body}
      </SpeechBubble>
    </div>
  )
}
