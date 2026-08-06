import { useEffect, useRef, useState } from 'react'
import heroMapBackground from '../assets/illustrations/hero-map-background.svg'
import PanZoomContainer from './PanZoomContainer'
import Hotspot from './Hotspot'
import AvatarPresentingIdle from './AvatarPresentingIdle'
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

// The map's natural size. It is never scaled *up* past this -- above it the
// margins grow instead (Flore's call; filling the viewport was tried and
// rejected). Below it the map now scales down to fit rather than cropping.
const MAP_NATIVE_WIDTH = 1622
const MAP_NATIVE_HEIGHT = 982

// Vertical space the hero keeps clear around the map -- what the fit
// calculation subtracts from the viewport height before working out how wide
// the map can be.
//
// This is deliberately larger than the hero's own padding (pt-space-24, no
// bottom padding). The hero used to carry pb-12 as well, but that 48px sat
// between the map and the Work heading as dead space; the gap below the map
// is now owned by SECTION_PAD_WORK instead, where it's tunable per breakpoint.
// The reserve stays at 72 so the map's rendered size is completely unchanged
// by that move -- it still declines the same slice of viewport height, the
// slice is just filled by the next section's padding rather than the hero's.
// Lower it only if the map is meant to get bigger, which is a separate call.
//
// The 24 at the top is deliberate at every size, not just mobile. On desktop
// the map's own artwork carries whitespace above the island so it reads fine
// flush; at small sizes that whitespace scales down with everything else, and
// in the crop branch the Guide is a real stacked block that sat hard against
// the top edge.
const HERO_VERTICAL_RESERVE = 72

// Below this width the map stops scaling and goes back to cropping with
// two-finger pan -- phones, where Figma stacks the Guide above the map
// anyway (402 frame, node 2928:78203) rather than overlaying it.
//
// This used to be MAP_NATIVE_WIDTH, which meant every real laptop cropped:
// 1622 is wider than a MacBook Pro. Worse, the binding constraint on a laptop
// is *height*, not width -- at 1500x820 the width is 92% adequate and it's the
// 820px height that forces the map down to 0.74. So width alone was never the
// right control variable for cropping; it only survives here as the phone
// cutoff, where it genuinely is about width.
const CROP_BREAKPOINT = 768

// Scale the map to fit both axes, capped at native size. Pure CSS, and
// deliberately not `transform: scale()` -- a transform would scale the
// hotspots' 44x44 hit areas along with the artwork (33px at 0.75, below the
// WCAG minimum). Resizing the image instead leaves the hotspots as fixed-size
// absolutely-positioned siblings that follow by percentage, so the 44px
// minimum survives at every scale for free.
//
// svh, not vh: vh tracks the largest mobile viewport and changes as browser
// chrome collapses during scroll, which would resize the map mid-scroll.
const MAP_FIT_WIDTH =
  `min(${MAP_NATIVE_WIDTH}px, 100%, ` +
  `calc((100svh - ${HERO_VERTICAL_RESERVE}px) * ${MAP_NATIVE_WIDTH} / ${MAP_NATIVE_HEIGHT}))`

function useMapFits() {
  const [fits, setFits] = useState(true)
  useEffect(() => {
    const check = () => setFits(window.innerWidth >= CROP_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return fits
}

// Measured rather than recomputed from window dimensions, so it reflects what
// the CSS actually resolved to.
//
// `branchKey` is in the dep list on purpose: the observer used to subscribe
// once on mount, so when the fit/crop branch flipped (or HMR replaced the
// node) it kept measuring a detached element and reported 0. Re-subscribing
// when the branch changes, and re-resolving ref.current on every read, keeps
// it pointed at the live node.
function useMapWidth(ref, branchKey) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const read = () => {
      const node = ref.current
      if (node) setWidth(node.getBoundingClientRect().width)
    }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    window.addEventListener('resize', read)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', read)
    }
  }, [ref, branchKey])
  return width
}

// Temporary, dev-only: turns "this feels too small" into a number, so the
// scale floor gets set from an observed value rather than a guess. Remove
// once the floor is agreed.
function ScaleReadout({ mapWidth, mapScale }) {
  return (
    <div
      data-component="scale-readout"
      className="pointer-events-none fixed bottom-space-16 right-space-16 z-50 rounded-radius-8 bg-black/80 px-space-12 py-space-8 font-mono text-caption text-white"
    >
      {window.innerWidth}×{window.innerHeight} · map {Math.round(mapWidth)}px · scale{' '}
      <strong className="text-action-accent-foreground">{mapScale.toFixed(3)}</strong>
    </div>
  )
}

function Guide() {
  return (
    <>
      <SpeechBubble variant="top">{GREETING}</SpeechBubble>
      {/* Same drawing as the Lab wayfinding avatar, mirrored so the presenting
          arm points right. In Work it gestures left at the "Lab" breadcrumb;
          here there's nothing on the left to point at, and the map is to the
          right. Flore's call 2026-08-05. */}
      <AvatarPresentingIdle size="hero" flipped />
      {/* No gap and tighter leading: at 1.5 line-height the two lines carry
          ~7px of leading each, so a 4px gap read as ~18px of space. Figma's
          own name/title containers overlap slightly, i.e. tighter than the
          line boxes, not looser. */}
      <div className="flex flex-col">
        <h1 className="text-body font-bold leading-[1.3]">Flore de Crombrugghe</h1>
        <p className="text-body font-normal leading-[1.3]">Senior Product Designer</p>
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
  const mapRef = useRef(null)
  const mapWidth = useMapWidth(mapRef, mapFits)
  const mapScale = mapWidth ? mapWidth / MAP_NATIVE_WIDTH : 1

  return (
    <section
      id="hero"
      data-component="hero"
      // Height comes from the map, not the viewport. It used to be min-h-svh
      // with the map vertically centred, which parked a band of empty canvas
      // above the map on any tall window and pushed the next section off
      // screen. Now the section is exactly as tall as the map needs, the map
      // sits near the top, and how much of the next section shows through
      // falls out of the window's own height and aspect ratio.
      className="relative flex flex-col overflow-hidden bg-surface-canvas pt-space-24"
    >
      {/* Sampled from Figma's "gradient" node: surface-canvas (#f0f6ff) fading
          to white over ~150px, sitting right at the map's bottom edge -- the
          blue canvas color is a full-bleed section background, not baked into
          the map SVG (Flore left it out deliberately since it needs to
          overflow the map's own width).

          Sits behind the map (z-0), not above it. At z-20 this 150px band
          reached ~100px up into the crop viewport and faded out real map
          content -- which is why the hint label read as detached, floating
          in washed-out space rather than sitting on the map. Behind the
          map it still does its actual job (fading the blue canvas into the
          white of the next section) without touching the illustration. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[150px] bg-gradient-to-b from-surface-canvas to-white" />

      {mapFits ? (
        // Map fits: scaled down if it has to, never cropped, and the Guide
        // overlays the map's top-left corner (the illustration reserves empty
        // space there).
        //
        // The overlay is the whole reason the empty top-right area disappears.
        // It was never a z-index problem: the Guide only stacks *above* the map
        // in the crop branch, taking a full row of height with just its left
        // third used. Since a 1500px laptop now fits instead of cropping, it
        // gets the overlay again.
        <div className="flex flex-col">
          <div
            ref={mapRef}
            data-component="hero-map"
            className="relative mx-auto"
            style={{ width: MAP_FIT_WIDTH }}
          >
            {/* Deliberately NOT scaled as a group. A transform here briefly
                shrank the whole Guide with the map, which also silently reset
                every type size inside it -- the bubble's 14px painted at 12,
                the name and role at 15.5. Type sizes belong to the type scale,
                not to a transform on a container. The Guide's crowding is
                handled by sizing its parts (see Avatar) and, still open, by
                making the bubble's width responsive in the type pass. */}
            <div
              data-component="guide"
              className="absolute left-[3%] top-[4%] z-10 flex max-w-[320px] flex-col items-start gap-2"
            >
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
              beyond its real content, and capped at 70svh so there's still
              room left for the Guide/nav/next-section hint on short
              viewports. On a tall-enough window this settles at the full
              982px with no vertical cropping at all.

              svh, not vh: vh on mobile tracks the *largest* viewport, so it
              changes as the browser's URL bar collapses and expands during
              scroll -- which resized this box mid-scroll and re-centered the
              map under the reader (part of the "weird jumps" Flore recorded).
              svh is the stable small-viewport unit and doesn't move. */}
          <div className="relative z-10 mt-8 h-[min(982px,70svh)] w-full overflow-hidden">
            <PanZoomContainer enabled>
              <div ref={mapRef} data-component="hero-map" className="relative" style={{ width: MAP_NATIVE_WIDTH }}>
                <MapContent activeHotspotId={activeHotspotId} setActiveHotspotId={setActiveHotspotId} />
              </div>
            </PanZoomContainer>
            {/* Styling sampled from the real Figma node (402-mobile, "pan and
                click on map" pill, id 2928:78212): light grey rounded rect,
                black text, 4px padding, 8px radius. Pinned 4px above the
                crop's bottom edge per Flore -- it should read as sitting on
                the map, not floating below it. */}
            <div className="pointer-events-none absolute bottom-space-4 left-1/2 z-20 -translate-x-1/2 rounded-radius-8 bg-border-grey p-space-4 text-caption-sm text-text-primary">
              two-finger pan · click on map
            </div>
          </div>
        </>
      )}
      {import.meta.env.DEV && <ScaleReadout mapWidth={mapWidth} mapScale={mapScale} />}
    </section>
  )
}
