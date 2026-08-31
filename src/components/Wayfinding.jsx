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
  // Undefined means "the default avatar", which is now the presenting one --
  // this used to default to the static 'sections-left' illustration. Only rows
  // with an animation of their own pass a value; see the branch below.
  avatarVariant,
  bubbleVariant = 'right',
  hidden = false,
  // HIDE THE BREADCRUMB HALF, KEEP THE GUIDE -- Flore, 2026-08-28, for the
  // Approach section's "Selected talks & writing" row. Figma sets exactly this
  // on that instance: the Wayfinding (node 4494:6497) still renders, with its
  // `Breadcrumb` child (4924:1549) marked hidden and `Guide` (4924:1550) left
  // alone.
  //
  // A separate flag rather than dropping `zone`/`subsection` from the content
  // file, which would have hidden it too by absence. Those two are still TRUE
  // of the row -- it really does sit in Plaza -- and they are the same fields
  // the taxonomy is read from elsewhere. Deleting a fact to change a layout is
  // how content files start lying.
  //
  // Note this is the mirror of how the Guide already works: that half is driven
  // by `bubbleCopy` being present, because a Guide with no copy is an empty
  // bubble and there is nothing to keep. A breadcrumb with no zone would be the
  // same, but here the zone exists and is simply not shown.
  breadcrumbHidden = false,
}) {
  if (hidden) return null

  return (
    <div data-component="wayfinding" className="flex flex-wrap items-center justify-between gap-8">
      {!breadcrumbHidden && <DistrictBreadcrumb zone={zone} subsection={subsection} />}
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
        // `data-reveal-guide` is the only motion hook in this file: the CSS
        // reads it to give the avatar and the bubble their own sequenced
        // reveal (see the REVEAL block in globals.css). No timings here.
        <div data-component="guide" data-reveal-guide className="ml-auto flex items-center gap-2">
          {/* THE PRESENTING AVATAR IS NOW THE DEFAULT -- Flore, 2026-08-31:
              "the idea is to create new animations over time, but right now I
              have to fill that space with one example avatar."

              So this is a PLACEHOLDER, not a decision that every row shares one
              drawing. It used to be the reverse -- `presenting-idle` was a
              single opt-in row and everything else fell through to a static
              <img>. Rega keeps its own because it is the other row that already
              has a real animation; each new one lands the same way, as another
              branch here, until the fallback has nothing left to catch. */}
          {avatarVariant === 'rega-wind' ? <AvatarRega /> : <AvatarPresentingIdle />}
          <SpeechBubble variant={bubbleVariant}>{bubbleCopy}</SpeechBubble>
        </div>
      )}
    </div>
  )
}
