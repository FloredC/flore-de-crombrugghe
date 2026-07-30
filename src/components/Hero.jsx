import heroMapBackground from '../assets/illustrations/hero-map-background.svg'
import PanZoomContainer from './PanZoomContainer'
import Hotspot from './Hotspot'
import ButtonLink from './ButtonLink'
import Container from './Container'
import { hotspots } from '../lib/content'

export default function Hero() {
  return (
    <section id="hero" data-component="hero" className="flex flex-col gap-8 py-12">
      <Container className="flex flex-col items-start gap-4">
        <h1>Flore de Crombrugghe</h1>
        <p>Senior Product Designer</p>
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
          {hotspots.map((hotspot) => (
            <Hotspot key={hotspot.id} hotspot={hotspot} />
          ))}
        </div>
      </PanZoomContainer>
    </section>
  )
}
