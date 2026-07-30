import Avatar from './Avatar'
import SpeechBubble from './SpeechBubble'
import DistrictBreadcrumb from './DistrictBreadcrumb'

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
    <div data-component="wayfinding">
      <Avatar variant={avatarVariant} />
      <SpeechBubble variant={bubbleVariant}>{bubbleCopy}</SpeechBubble>
      <DistrictBreadcrumb zone={zone} subsection={subsection} />
    </div>
  )
}
