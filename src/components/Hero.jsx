import heroMapBackground from '../assets/illustrations/hero-map-background.svg'
import PanZoomContainer from './PanZoomContainer'
import Hotspot from './Hotspot'
import ButtonLink from './ButtonLink'
import { hotspots } from '../lib/content'

export default function Hero() {
  return (
    <section id="hero" data-component="hero">
      <div data-component="hero-intro">
        <h1>Flore de Crombrugghe</h1>
        <p>Senior Product Designer</p>
        <div data-component="hero-ctas">
          <ButtonLink variant="primary" href="#work">
            See the work
          </ButtonLink>
          <ButtonLink variant="secondary" href="#contact">
            Say hi
          </ButtonLink>
        </div>
      </div>
      <PanZoomContainer>
        <div data-component="hero-map" style={{ position: 'relative' }}>
          <img src={heroMapBackground} alt="Illustrated map of Flore's work, click the markers to explore" />
          {hotspots.map((hotspot) => (
            <Hotspot key={hotspot.id} hotspot={hotspot} />
          ))}
        </div>
      </PanZoomContainer>
    </section>
  )
}
