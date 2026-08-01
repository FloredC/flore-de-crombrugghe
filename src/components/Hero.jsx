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
          <div data-component="guide" className="mx-auto flex w-full max-w-[320px] flex-col items-start gap-2 px-6">
            <Guide />
          </div>
          <div className="relative mt-8 h-[60vh] w-full overflow-hidden">
            <PanZoomContainer enabled>
              <div data-component="hero-map" className="relative" style={{ width: MAP_NATIVE_WIDTH }}>
                <MapContent activeHotspotId={activeHotspotId} setActiveHotspotId={setActiveHotspotId} />
              </div>
            </PanZoomContainer>
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-surface-inverted px-3 py-1 text-caption-sm text-text-inverted">
              pan and click on map
            </div>
          </div>
        </>
      )}
    </section>
  )
}
