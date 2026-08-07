import Artifakt from '../assets/illustrations/hotspot-artifakt-highlight.svg?react'
import FutureOfUx from '../assets/illustrations/hotspot-future-of-ux-highlight.svg?react'
import LanguageRiver from '../assets/illustrations/hotspot-language-river-highlight.svg?react'
import Myride from '../assets/illustrations/hotspot-myride-highlight.svg?react'
import Papayas from '../assets/illustrations/hotspot-papayas-highlight.svg?react'
import Pitchpivot from '../assets/illustrations/hotspot-pitchpivot-highlight.svg?react'
import Rega from '../assets/illustrations/hotspot-rega-highlight.svg?react'
import SayHi from '../assets/illustrations/hotspot-say-hi-highlight.svg?react'
import TrailApp from '../assets/illustrations/hotspot-trail-app-highlight.svg?react'

// Each is a full-canvas overlay sharing the exact 1622x982 viewBox of
// hero-map-background.svg, meant to be stacked 1:1 on top of it and shown
// only while its hotspot is active.
//
// Imported as COMPONENTS (`?react`), not as URLs, since 2026-08-07: the
// highlights have to take their hotspot's discipline colour, and an <img src>
// is an opaque document that CSS can't reach into. Inline <svg> can, so the
// asset files keep their geometry as the single source of truth while the
// colour comes from a token -- vite.config.js rewrites the exported orange
// fill to currentColor, exactly as it already does for the icon set.
//
// The cost is ~42KB of path data in the bundle instead of nine separate
// requests. Worth it here: they're small, and all nine were being fetched
// anyway to be sat at opacity 0.
export const hotspotHighlights = {
  'hotspot-artifakt': Artifakt,
  'hotspot-future-of-ux': FutureOfUx,
  'hotspot-language-river': LanguageRiver,
  'hotspot-myride': Myride,
  'hotspot-papayas': Papayas,
  'hotspot-pitchpivot': Pitchpivot,
  'hotspot-rega': Rega,
  'hotspot-say-hi': SayHi,
  'hotspot-trail-app': TrailApp,
}
