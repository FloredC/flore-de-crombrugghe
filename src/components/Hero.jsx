import { useEffect, useRef, useState } from 'react'
import heroMapBackground from '../assets/illustrations/hero-map-background.svg'
import PanZoomContainer from './PanZoomContainer'
import Hotspot from './Hotspot'
import AvatarPresentingIdle from './AvatarPresentingIdle'
import SpeechBubble from './SpeechBubble'
import { FOCUS_CLASS } from './ButtonLink'
import { hotspots } from '../lib/content'
import { hotspotHighlights } from '../lib/hotspotHighlights'
import { getDiscipline } from '../lib/disciplines'

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
// The 24 at the top is deliberate at every size, not just mobile. On desktop
// the map's own artwork carries whitespace above the island so it reads fine
// flush; at small sizes that whitespace scales down with everything else, and
// in the crop branch the Guide is a real stacked block that sat hard against
// the top edge.
//
// --- 72 -> 155, so the page shows it has content (Flore, 2026-08-25) -------
//
// At 72 the map claimed the entire first screen and NOTHING below it was
// visible, so a cold visitor had no evidence the page continued. Flore, from a
// 1512x856 laptop: "you only see the map, not the rest of the page, making it
// unclear whether there is any content."
//
// This was never working, on any screen -- worth stating plainly, because the
// natural assumption is that something regressed. While the map is height-
// bound, its height IS `viewport - reserve`, so the whole chain is:
//
//   Work heading bottom = 24 (top pad) + (vh - RESERVE)
//                       + 60 (SECTION_PAD_WORK at xl)
//                       + 45 (the h1 at its laptop size)
//                       = vh + 129 - RESERVE
//
// The viewport height cancels. At RESERVE 72 the heading therefore sat 57px
// below the fold at EVERY height where the map is height-bound -- measured at
// 1512x856, and 31px below at 1728x1080 where the map is capped at native
// instead. Not a laptop bug, a constant.
//
// 155 puts the heading fully on screen with ~26px to spare at `xl`, and that is
// the number Flore chose against a measured 1512x856.
//
// TWO VALUES, because one is not enough: the same 155 clears by exactly 1px at
// 1728x1080. That band is `2xl`, where the heading is 50px rather than 45 and
// SECTION_PAD_WORK is 80 rather than 60 -- 25px more chain for the same
// reserve to absorb. 1px survives nothing: a scrollbar, a rounding difference,
// a browser with slightly taller chrome, and the heading is under the fold
// again. 180 restores the same ~26px there.
//
// Raising the single number to 180 everywhere would have worked too, and was
// rejected: it costs another 3% of map at the laptop sizes Flore actually
// judged this on, to fix a band where the map is already near native size and
// can afford the space. So the reserve is a custom property with a `2xl:`
// variant, the same mechanism ProjectMedia uses -- see MEDIA_VARS there.
//
// KEEP THESE IN STEP WITH THE CHAIN. If SECTION_PAD_WORK or the `h1` size
// changes, this changes with it; the formula above is how to re-derive it,
// and `clearance below heading` is what to measure in the browser afterwards.
//
// THE COST, chosen knowingly: the map is ~10% smaller wherever height binds --
// 1295 -> 1158 wide at 1512x856, scale 0.798 -> 0.714. Above ~1130px of
// viewport height nothing changes at all, because the map hits its 1622 native
// cap before the reserve matters.
//
// If the map wants that size back, the lever is NOT this number -- it is the
// asset. Measured from the SVG's own `getBBox()` against its 1622x982 viewBox,
// the artwork wastes 33px at the top and 32 at the bottom (6.7% of the height)
// and 127/94 left and right. A tighter re-export renders the island larger
// inside the same box, which buys back most of this without putting the Work
// heading back under the fold. That needs Flore to re-export, so it is a note
// rather than a change.
const HERO_RESERVE_VARS = '[--hero-reserve:155px] 2xl:[--hero-reserve:180px]'

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
  `calc((100svh - var(--hero-reserve)) * ${MAP_NATIVE_WIDTH} / ${MAP_NATIVE_HEIGHT}))`

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
      {/* Anchor-scrolls to Contact. Deliberately carries NO visual affordance
          -- per Flore, the name and title keep exactly the look they have now
          and only become clickable, so there is no hover colour, no underline,
          and no ButtonLink variant here. `w-fit` keeps the hit area on the two
          lines rather than stretching across the column beside them.

          The focus ring is the one exception, and it isn't a design change:
          it paints only on keyboard focus, it's the same FOCUS_CLASS every
          other interactive element uses, and without it this would be the one
          focusable thing on the page that gives a keyboard user nothing to
          see. Mouse users will never render it.

          The <h1> stays an <h1> -- wrapping it is valid (<a> is transparent
          content model) and keeps the page's single top-level heading where it
          belongs, which nesting the link inside the heading instead would not
          do for the title line. */}
      <a href="#contact" className={`flex w-fit flex-col rounded-radius-4 ${FOCUS_CLASS}`}>
        <h1 className="text-body font-bold leading-[1.3]">Flore de Crombrugghe</h1>
        <p className="text-body font-normal leading-[1.3]">Senior Product Designer</p>
      </a>
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
      {/* Driven off `hotspots` rather than off the highlight map's own keys, so
          each highlight is looked up next to the record that says which
          discipline it belongs to -- iterating the two lists separately is how
          a highlight ends up painted in the wrong colour. `color` feeds the
          currentColor fill the svgr rewrite leaves in the exported artwork. */}
      {hotspots.map((hotspot) => {
        const Highlight = hotspotHighlights[hotspot.id]
        if (!Highlight) return null
        return (
          <Highlight
            key={hotspot.id}
            aria-hidden="true"
            focusable="false"
            data-hotspot-highlight={hotspot.id}
            className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-150"
            style={{
              color: getDiscipline(hotspot.discipline).marker,
              opacity: activeHotspotId === hotspot.id ? 1 : 0,
            }}
          />
        )
      })}
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
            className={`relative mx-auto ${HERO_RESERVE_VARS}`}
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
