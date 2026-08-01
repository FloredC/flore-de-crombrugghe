import { useEffect, useState } from 'react'
import heroMapBackground from '../assets/illustrations/hero-map-background.svg'
import PanZoomContainer from './PanZoomContainer'
import Hotspot from './Hotspot'
import Avatar from './Avatar'
import SpeechBubble from './SpeechBubble'
import { hotspots } from '../lib/content'
import { hotspotHighlights } from '../lib/hotspotHighlights'

// Real copy sampled from Figma's Hero "Guide" component -- not placeholder.
const GREETING = (
  <>
    Hi, thanks for visiting my city —<br />I design consumer apps and internal tools for high-stakes, large-scale
    services.
  </>
)

// The map's natural/native size -- it never scales down to fit a narrower
// viewport (per Flore: "the map stays that size but gets viewport crops as
// soon as it's too big for that breakpoint"). This is the threshold for
// switching layouts, not an arbitrary mobile-vs-desktop breakpoint.
const MAP_NATIVE_WIDTH = 1622
// The map's native height (982px) is referenced directly in the crop
// viewport's h-[min(982px,70vh)] class below (Tailwind arbitrary-value
// classes can't consume a JS variable) -- keep that literal in sync with
// this if the source SVG's intrinsic height ever changes.

function useMapFits() {
  const [fits, setFits] = useState(true)
  useEffect(() => {
    const check = () => setFits(window.innerWidth >= MAP_NATIVE_WIDTH)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return fits
}

// centerOnInit (react-zoom-pan-pinch) only re-centers on mount, so live
// window resizing (crop mode) left the pan position anchored wherever it
// happened to be instead of staying centered, per Flore's "anchored on the
// left top corner when dragging the browser window" report. Forcing a
// remount via a changing `key` re-triggers centerOnInit. Debounced so a
// continuous drag-resize doesn't remount on every pixel, only once it settles.
function useResizeSettleKey(delay = 200) {
  const [settleKey, setSettleKey] = useState(0)
  useEffect(() => {
    let timeout
    const handleResize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => setSettleKey((key) => key + 1), delay)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeout)
    }
  }, [delay])
  return settleKey
}

function Guide() {
  return (
    <>
      <SpeechBubble variant="top">{GREETING}</SpeechBubble>
      <Avatar variant="hero" />
      <div className="flex flex-col gap-1">
        <h1 className="text-body font-bold">Flore de Crombrugghe</h1>
        <p className="text-body font-normal">Senior Product Designer</p>
      </div>
    </>
  )
}

function MapContent({ activeHotspotId, setActiveHotspotId }) {
  return (
    <>
      <img
        src={heroMapBackground}
        alt="Illustrated map of Flore's work, click the markers to explore"
        className="block"
      />
      {/* Highlights must paint above the markers -- each highlight is a small
          accent (roughly marker-sized) positioned at/near its marker, not a
          big color wash, so it needs to sit on top or the marker dot covers
          it entirely. */}
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          hotspot={hotspot}
          isOpen={activeHotspotId === hotspot.id}
          onOpenChange={(open) => setActiveHotspotId(open ? hotspot.id : null)}
        />
      ))}
      {Object.entries(hotspotHighlights).map(([id, src]) => (
        <img
          key={id}
          src={src}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-150"
          style={{ opacity: activeHotspotId === id ? 1 : 0 }}
        />
      ))}
    </>
  )
}

export default function Hero() {
  // Lifted here (rather than local state per Hotspot) so opening one popover
  // closes any other that's open -- "only one popover open at a time" per spec.
  const [activeHotspotId, setActiveHotspotId] = useState(null)
  const mapFits = useMapFits()
  const resizeSettleKey = useResizeSettleKey()

  return (
    <section
      id="hero"
      data-component="hero"
      className="relative flex min-h-screen flex-col overflow-hidden bg-surface-canvas py-12"
    >
      {/* Sampled from Figma's "gradient" node: surface-canvas (#f0f6ff) fading
          to white over ~150px, sitting right at the map's bottom edge -- the
          blue canvas color is a full-bleed section background, not baked into
          the map SVG (Flore left it out deliberately since it needs to
          overflow the map's own width). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[150px] bg-gradient-to-b from-surface-canvas to-white" />

      {mapFits ? (
        // Map fits at its native 1622px width: Guide overlays the map's
        // top-left corner (the illustration reserves empty space there).
        <div className="flex flex-1 flex-col justify-center">
          <div data-component="hero-map" className="relative mx-auto w-full max-w-[1622px]">
            <div data-component="guide" className="absolute left-[3%] top-[4%] z-10 flex max-w-[320px] flex-col items-start gap-2">
              <Guide />
            </div>
            <MapContent activeHotspotId={activeHotspotId} setActiveHotspotId={setActiveHotspotId} />
          </div>
        </div>
      ) : (
        // Map doesn't fit: Guide is a normal stacked block above the map (not
        // overlaid), map crops to the available width at native size, pan
        // enabled, centered initial position, bounded to the map's edges.
        <>
          {/* Left-aligned to the viewport edge (not centered as a block) --
              padding steps down to 16px on mobile, a slightly larger
              endpoint than the 12px content scale per Flore (she flagged
              16 vs 20 as her own uncertainty; picked 16, easy to bump to
              space-20 if it reads too tight next to the map's own edge). */}
          <div data-component="guide" className="flex w-full max-w-[320px] flex-col items-start gap-2 px-space-16 sm:px-space-20 md:px-6">
            <Guide />
          </div>
          {/* Height is overflow-triggered per axis, same as width: capped at
              the map's own native height (982px) so it's never cropped
              beyond its real content, and capped at 70vh so there's still
              room left for the Guide/nav/next-section hint on short
              viewports. On a tall-enough window this settles at the full
              982px with no vertical cropping at all -- previously this was
              a flat 60vh regardless of how much vertical space was actually
              available, which chopped the bottom off needlessly on wider
              (but still sub-1622px) breakpoints. 70vh is a reasonable
              starting budget, not sampled from Figma -- easy to retune. */}
          <div className="relative mt-8 h-[min(982px,70vh)] w-full overflow-hidden">
            <PanZoomContainer key={resizeSettleKey} enabled>
              <div data-component="hero-map" className="relative" style={{ width: MAP_NATIVE_WIDTH }}>
                <MapContent activeHotspotId={activeHotspotId} setActiveHotspotId={setActiveHotspotId} />
              </div>
            </PanZoomContainer>
            {/* Styling and position sampled from the real Figma node
                (402-mobile, "pan and click on map" pill, id 2928:78212) --
                I'd guessed a dark/inverted full pill before; the real spec
                is a light grey rounded rect (not a capsule), black text,
                4px padding all round, 8px radius, sitting close to the
                crop's bottom edge (~8px) rather than 16px away. */}
            <div className="pointer-events-none absolute bottom-space-8 left-1/2 z-20 -translate-x-1/2 rounded-radius-8 bg-border-grey p-space-4 text-caption-sm text-text-primary">
              two-finger pan · click on map
            </div>
          </div>
        </>
      )}
    </section>
  )
}
