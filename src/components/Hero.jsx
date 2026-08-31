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
    Hi, thanks for visiting my island —<br />I design consumer apps and internal tools for high-stakes, large-scale
    services.
  </>
)

// The map's natural size. It is never scaled *up* past this -- above it the
// margins grow instead (Flore's call; filling the viewport was tried and
// rejected). Below it the map now scales down to fit rather than cropping.
const MAP_NATIVE_WIDTH = 1622
const MAP_NATIVE_HEIGHT = 982

// The artwork's own box inside that 1622x982 viewBox, measured with the SVG's
// `getBBox()` rather than eyeballed: x=127.5, y=33.1, w=1401, h=916.5. So the
// file carries 33.1px of empty margin above the drawing and 32.4 below (6.7% of
// its height), plus 127.5 and 93.5 to the sides (13.6% of its width).
//
// RE-MEASURE THIS IF THE MAP SVG IS EVER RE-EXPORTED. Three separate things
// below are derived from it, and all of them would be quietly wrong -- not
// broken, just slightly off -- if the artwork moved inside its box.
const MAP_ART = { top: 33.1, bottom: 32.4, height: 916.5, left: 127.5 }

// How far right the map sits in whatever gutter is left over: 0.5 is centred,
// 1 is flush right. Chosen by Flore from a screenshot matrix on 2026-08-31.
//
// It exists because the Guide is a fixed-size block of type overlaid on a map
// that scales. At the map's native size the Guide takes 18% of its width and
// sits in the corner the illustration reserves for it; at laptop sizes it takes
// 26% and crowds the island's coastline. Sliding the map right opens room on
// the left WITHOUT shrinking the map -- the artwork's own 93.5px of empty right
// margin absorbs most of the move, so the drawing does not run into the
// viewport edge.
//
// 0.75 rather than 1: flush right clears the Guide completely but banks the
// entire gutter on one side, and on a short laptop (1366x670, where the map is
// 961 of 1366) that left the whole bottom-left quadrant empty. Both were shot
// and compared; this is the chosen middle.
const MAP_SHIFT_X = 0.75

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
// --- WHY A RESERVE EXISTS AT ALL (Flore, 2026-08-25) ----------------------
//
// Without one the map claimed the entire first screen and NOTHING below it was
// visible, so a cold visitor had no evidence the page continued. Flore, from a
// 1512x856 laptop: "you only see the map, not the rest of the page, making it
// unclear whether there is any content."
//
// That was never working on any screen, which is worth stating plainly because
// the natural assumption is that something regressed. While the map is
// height-bound its height IS `viewport - reserve`, so the chain is:
//
//   Work heading bottom = hero top pad + (vh - RESERVE)
//                       + work top pad + heading height
//
// The viewport height cancels, so a too-small reserve puts the heading the same
// number of pixels below the fold at EVERY height where the map is
// height-bound. It is a constant, not a laptop bug.
//
// --- DERIVED, NOT HAND-TUNED (2026-08-31) ---------------------------------
//
// This used to be two literals (155px, 180px at `2xl`) under a comment ending
// "KEEP THESE IN STEP WITH THE CHAIN" -- exactly the kind of instruction that
// gets followed until it doesn't. The four terms now live together in
// globals.css (see the HERO FOLD CHAIN block) and the reserve is computed from
// them, so changing the gap resizes the map instead of quietly pushing the
// heading under the fold. `--work-heading-h` is measured at runtime because the
// heading sits on a fluid clamp and no static number is right at every width.
//
// `--work-top-pad` still has a `2xl:` value, and that split is the surviving
// reason to keep one: at `2xl` the heading is ~50px rather than ~45 and the
// band can afford more air, because the map is at or near its native cap there
// and the reserve has stopped binding anyway.
//
// --- THE SIZE CAME BACK (2026-08-31) --------------------------------------
//
// The reserve cost ~10% of map wherever height binds, and an earlier note here
// said the only way to buy it back was a tighter SVG re-export. That turned out
// to be wrong twice over, and both fixes are in:
//
//   1. The map->Work gap was cut (60 -> 32 at `xl`, 80 -> 40 at `2xl`), and
//      because the reserve is derived, that space went straight into the map.
//   2. The map is fitted to the ARTWORK rather than to the SVG's box -- see
//      MAP_ART and MAP_FIT_WIDTH -- reclaiming the 6.7% of height the file
//      carries as empty margin.
//
// Together, +11 to +13% of map width across the laptop band, with the clearance
// under the Work heading unchanged at 26px. Measured across a six-viewport
// matrix; `npm run shoot` re-runs it.
//
// What layout still cannot reach is the 13.6% of wasted WIDTH in the same file.
// A tighter re-export is the only lever for that, and it buys nothing today
// because width is not the binding axis anywhere in this band.
const HERO_RESERVE =
  'calc(var(--hero-top-pad) + var(--work-top-pad) + var(--work-heading-h) + var(--hero-clearance))'

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
//
// The divisor is the ARTWORK's height, not the SVG box's 982. Height is the
// binding axis at every laptop size, so fitting the box meant reserving space
// for 65.5px of empty margin the reader sees as nothing -- 6.7% of map size
// spent on whitespace inside the file. Fitting the drawing instead and letting
// those two bands hang outside the layout box (see the map div's negative
// margins) reclaims all of it, with no re-export.
const MAP_FIT_WIDTH =
  `min(${MAP_NATIVE_WIDTH}px, 100%, ` +
  `calc((100svh - ${HERO_RESERVE}) * ${MAP_NATIVE_WIDTH} / ${MAP_ART.height}))`

// The Guide's position, both axes, as calc() against the map's WRAPPER -- which
// is why the Guide is a sibling of the map in the DOM rather than a child of it.
//
// Both were briefly derived in JS from a measured map rect instead, and both
// were wrong on load and stayed wrong: the rect gets read before layout has
// settled, so the Guide was positioned against a map 49px narrower than the one
// on screen and nothing re-derived it. A measured position has to be
// re-measured whenever anything upstream moves, and upstream here includes the
// type scale. calc() cannot desync.
//
// LEFT: the page's own left margin, the same clamp Container uses -- so the
// Guide lines up with the text further down the page rather than with the map.
// It used to sit 3% into the map box, in the corner the illustration reserves;
// that only works while the map is near native size (see MAP_SHIFT_X).
const GUIDE_LEFT = 'clamp(16px, 4vw, 48px)'

// TOP: 4% down the map box, plus whatever the artwork fit pulled the map upward
// by, so the Guide holds its position relative to the DRAWING rather than to the
// SVG's empty top band. 0.04 x (982/1622) = 0.024217 of the map's width.
const GUIDE_TOP = `calc(var(--map-w) * ${(0.04 * (MAP_NATIVE_HEIGHT / MAP_NATIVE_WIDTH) - MAP_ART.top / MAP_NATIVE_WIDTH).toFixed(6)})`

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

// Publishes the Work heading's real rendered height as `--work-heading-h`, one
// of the four terms the map's reserve is computed from.
//
// Measured rather than hardcoded because the heading sits on the fluid type
// scale: its height is a clamp, so no static number is correct at every width,
// and the previous hand-tuned reserve was only right because someone had
// checked it at two specific viewports. There is no layout loop to worry about
// -- the heading's height depends on the viewport width, never on the map.
function useWorkHeadingHeight() {
  useEffect(() => {
    const heading = document.querySelector('#work h2')
    if (!heading) return undefined
    const read = () => {
      document.documentElement.style.setProperty(
        '--work-heading-h',
        `${heading.getBoundingClientRect().height}px`,
      )
    }
    read()
    const ro = new ResizeObserver(read)
    ro.observe(heading)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty('--work-heading-h')
    }
  }, [])
}

// Exposes the hero's resolved geometry to the screenshot harness as a function
// on `window`, dev only.
//
// It was first written the other way round -- an effect that measured once and
// wrote the result to a data attribute for `--dump-dom` to scrape. That reports
// whatever was true when the effect last ran, and on the first shot of a run
// (the slowest navigation, before anything is warm) it published a layout that
// had not settled: A at 1280x800 came back claiming 671px of clearance under
// the Work heading where every other cell in the matrix said 26. One bad number
// in thirty, in a caption sitting under a screenshot that was itself correct,
// which is the worst way for a measurement to be wrong.
//
// Measuring when asked removes the race rather than papering over it with a
// longer wait: the harness settles the page first, then calls this, so the
// numbers describe the frame it is about to capture.
//
// The interesting numbers are about the ARTWORK, not the SVG's box: `artGap` is
// the white space a reader actually sees between the island and the Work
// heading, and `guideOverArt` is how far the Guide reaches past the island's
// left edge (negative means it clears). Both differ from the box-level numbers
// by the empty margins the file carries.
function useHeroMetrics() {
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined
    window.__heroMetrics = () => {
      const map = document.querySelector('[data-component="hero-map"]')
      const guide = document.querySelector('[data-component="guide"]')
      const heading = document.querySelector('#work h2')
      if (!map || !guide || !heading) return null
      const m = map.getBoundingClientRect()
      const g = guide.getBoundingClientRect()
      const h = heading.getBoundingClientRect()
      const scale = m.width / MAP_NATIVE_WIDTH
      return {
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        mapW: Math.round(m.width),
        scale: +scale.toFixed(3),
        artGap: Math.round(h.top - (m.bottom - MAP_ART.bottom * scale)),
        clearance: Math.round(window.innerHeight - h.bottom),
        guideOverArt: Math.round(g.right - (m.left + MAP_ART.left * scale)),
      }
    }
    return () => {
      delete window.__heroMetrics
    }
  }, [])
}

// Dev-only corner overlay: turns "this feels too small" into a number while
// resizing a real window, which is the fastest way to judge the map's size
// without running the whole screenshot matrix.
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

// The screenshot harness measures the page itself and captions its own shots,
// so it passes `?readout=0` to keep the overlay out of the images.
function readoutEnabled() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('readout') !== '0'
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

  useWorkHeadingHeight()
  useHeroMetrics()

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
      // Reads the same variable the reserve is computed from, rather than a
      // second copy of 24 that could drift from it.
      className="relative flex flex-col overflow-hidden bg-surface-canvas pt-[var(--hero-top-pad)]"
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
        // `relative` and the owner of `--map-w`: both the map and the Guide are
        // positioned against this box, which is the only element that knows the
        // hero's full width. Putting the Guide here rather than inside the map
        // is what lets it be placed by calc() instead of by a measured rect.
        <div className="relative flex flex-col" style={{ '--map-w': MAP_FIT_WIDTH }}>
          <div
            ref={mapRef}
            data-component="hero-map"
            className="relative"
            style={{
              width: 'var(--map-w)',
              // Replaces `mx-auto`. `100%` resolves against the hero, so this is
              // (total gutter) x (how far right) -- 0.5 would be plain centring.
              marginLeft: `calc((100% - var(--map-w)) * ${MAP_SHIFT_X})`,
              // The artwork fit. These pull the SVG's empty top and bottom bands
              // OUT of the layout box without touching this element's own box --
              // so the image and every hotspot positioned by percentage inside
              // it stay locked together, and only the parent's consumed height
              // changes. Expressed against the map's width because that is the
              // one dimension both axes scale from.
              marginTop: `calc(var(--map-w) * ${-(MAP_ART.top / MAP_NATIVE_WIDTH).toFixed(6)})`,
              marginBottom: `calc(var(--map-w) * ${-(MAP_ART.bottom / MAP_NATIVE_WIDTH).toFixed(6)})`,
            }}
          >
            <MapContent activeHotspotId={activeHotspotId} setActiveHotspotId={setActiveHotspotId} />
          </div>
          {/* Deliberately NOT scaled as a group. A transform here briefly
              shrank the whole Guide with the map, which also silently reset
              every type size inside it -- the bubble's 14px painted at 12,
              the name and role at 15.5. Type sizes belong to the type scale,
              not to a transform on a container. The Guide's crowding is
              handled by sizing its parts (see Avatar) and, still open, by
              making the bubble's width responsive in the type pass.

              A sibling of the map rather than a child of it, so `left`'s
              percentages resolve against the hero's width and the Guide can be
              placed either relative to the map or relative to the page. After
              the map in the DOM so it paints over the illustration. */}
          <div
            data-component="guide"
            className="absolute z-10 flex max-w-[320px] flex-col items-start gap-2"
            style={{ left: GUIDE_LEFT, top: GUIDE_TOP }}
          >
            <Guide />
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
      {import.meta.env.DEV && readoutEnabled() && (
        <ScaleReadout mapWidth={mapWidth} mapScale={mapScale} />
      )}
    </section>
  )
}
