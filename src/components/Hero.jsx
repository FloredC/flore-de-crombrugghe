import { useState } from 'react'
import heroMapBackground from '../assets/illustrations/hero-map-background.svg'
import PanZoomContainer from './PanZoomContainer'
import Hotspot from './Hotspot'
import ButtonLink from './ButtonLink'
import Container from './Container'
import { hotspots } from '../lib/content'
import { hotspotHighlights } from '../lib/hotspotHighlights'

export default function Hero() {
  // Lifted here (rather than local state per Hotspot) so opening one popover
  // closes any other that's open -- "only one popover open at a time" per spec.
  const [activeHotspotId, setActiveHotspotId] = useState(null)

  return (
    <section id="hero" data-component="hero" className="flex flex-col gap-8 py-12">
      <Container className="flex flex-col items-start gap-4">
        <h1 className="text-body font-bold">Flore de Crombrugghe</h1>
        <p className="text-body font-normal">Senior Product Designer</p>
        <div data-component="hero-ctas" className="flex gap-4">
          <ButtonLink variant="primary" href="#work">
            See the work
          </ButtonLink>
          <ButtonLink variant="secondary" href="#contact">
            Say hi
          </ButtonLink>
        </div>
      </Container>
      <PanZoomContainer>
        <div data-component="hero-map" className="relative w-full">
          <img
            src={heroMapBackground}
            alt="Illustrated map of Flore's work, click the markers to explore"
            className="w-full"
          />
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
          {hotspots.map((hotspot) => (
            <Hotspot
              key={hotspot.id}
              hotspot={hotspot}
              isOpen={activeHotspotId === hotspot.id}
              onOpenChange={(open) => setActiveHotspotId(open ? hotspot.id : null)}
            />
          ))}
        </div>
      </PanZoomContainer>
    </section>
  )
}
