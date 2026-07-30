import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

/**
 * Overflow-triggered per PRD: pan/zoom only activates when the illustration's
 * rendered size exceeds its container. Real overflow-detection + initial
 * zoom/crop level land in the Hotspot wiring stage — this is structural wiring only.
 */
export default function PanZoomContainer({ children }) {
  return (
    <TransformWrapper initialScale={1} disabled>
      <TransformComponent>{children}</TransformComponent>
    </TransformWrapper>
  )
}
