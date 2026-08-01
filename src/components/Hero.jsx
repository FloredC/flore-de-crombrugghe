import { useState } from 'react'
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

export default function Hero() {
  // Lifted here (rather than local state per Hotspot) so opening one popover
  // closes any other that's open -- "only one popover open at a time" per spec.
  const [activeHotspotId, setActiveHotspotId] = useState(null)

  return (
    <section
      id="hero"
      data-component="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-surface-canvas py-12"
    >
      {/* Sampled from Figma's "gradient" node: surface-canvas (#f0f6ff) fading
          to white over ~150px, sitting right at the map's bottom edge -- the
          blue canvas color is a full-bleed section background, not baked into
          the map SVG (Flore left it out deliberately since it needs to
          overflow the map's own width). Without this, the hero-to-content
          boundary wasn't perceptible, which read as "the map takes up the
          full viewport with no hint of content." */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-b from-surface-canvas to-white" />
      <PanZoomContainer>
        <div data-component="hero-map" className="relative mx-auto w-full max-w-[1622px]">
          <img
            src={heroMapBackground}
            alt="Illustrated map of Flore's work, click the markers to explore"
            className="w-full"
          />
          {/* Guide: avatar + speech bubble + name/title as one grouped entity
              sitting on top of the map's top-left corner (the illustration
              reserves empty space there for exactly this) -- not a separate
              content block above the map, and no longer paired with "See the
              work"/"Say hi" buttons, which weren't in the actual Figma design. */}
          <div
            data-component="guide"
            className="absolute left-[3%] top-[4%] z-10 flex max-w-[320px] flex-col items-start gap-2"
          >
            <SpeechBubble variant="top">{GREETING}</SpeechBubble>
            <Avatar variant="hero" />
            <div className="flex flex-col gap-1">
              <h1 className="text-body font-bold">Flore de Crombrugghe</h1>
              <p className="text-body font-normal">Senior Product Designer</p>
            </div>
          </div>
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
        </div>
      </PanZoomContainer>
    </section>
  )
}
