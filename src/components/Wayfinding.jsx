import Avatar from './Avatar'
import AvatarPresentingIdle from './AvatarPresentingIdle'
import AvatarRega from './AvatarRega'
import SpeechBubble from './SpeechBubble'
import DistrictBreadcrumb from './DistrictBreadcrumb'

// Sampled from Figma's "Wayfinding" component: Breadcrumb (district card +
// text) on the left, Guide (avatar + bubble) on the right. Figma's own gap
// between them is a fixed 165px, but that only makes sense at the exact
// 998px width it was sampled at -- used justify-between instead so it holds
// up at whatever width each section actually renders, which is the more
// robust equivalent of "these two groups anchor to opposite ends."
// Guide's avatar-to-bubble gap is a tight 8px (not the 16 used before).
export default function Wayfinding({
  zone,
  subsection,
  bubbleCopy,
  avatarVariant = 'sections-left',
  bubbleVariant = 'right',
  hidden = false,
}) {
  if (hidden) return null

  return (
    <div data-component="wayfinding" className="flex flex-wrap items-center justify-between gap-8">
      <DistrictBreadcrumb zone={zone} subsection={subsection} />
      {/* No bubbleCopy means no Guide at all -- not an empty bubble. Contact is
          the real case: its Wayfinding in Figma (node 4522:18469) is the
          breadcrumb alone, with no avatar and no speech bubble, and Flore
          confirmed that's intended rather than missing. Driving it off the
          copy's presence keeps the two in step without a separate flag. */}
      {bubbleCopy && (
        // `ml-auto` so the Guide stays right-aligned even once the row wraps.
        // `justify-between` on the parent only right-aligns it while both
        // groups share a line; the moment it wraps to its own line each item
        // starts at the left, which put the bubble on the left at narrow
        // widths. Flore's note 2026-08-12: these are right-aligned in the
        // design, everywhere.
        <div data-component="guide" className="ml-auto flex items-center gap-2">
          {/* One opt-in variant, currently used by the Lab — Own products row
              only (see HomePage). Every other row keeps the existing static
              <img> avatar untouched. */}
          {avatarVariant === 'presenting-idle' ? (
            <AvatarPresentingIdle />
          ) : avatarVariant === 'rega-wind' ? (
            <AvatarRega />
          ) : (
            <Avatar variant={avatarVariant} />
          )}
          <SpeechBubble variant={bubbleVariant}>{bubbleCopy}</SpeechBubble>
        </div>
      )}
    </div>
  )
}
