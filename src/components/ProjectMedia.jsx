// The media frame is the card's full width at a fixed height, with the artwork
// sized and centred inside it -- so the "inset" around the artwork isn't
// padding, it's the leftover tinted background showing through. Pulled from
// the real ProjectCard instances (ProjectMedia nodes 2928:78193 / 2928:78175 /
// 2928:78184) rather than from the component defaults, since the tint and the
// artwork are both instance-level.
//
// Everything below is expressed as ratios and percentages rather than the raw
// pixel sizes Figma reports. At the desktop frame they resolve to exactly the
// Figma values; below it the whole frame scales instead of being correct at
// one width and broken everywhere else.

// Frame ratio = the card's width at its zone : the frame's fixed height,
// expressed as the height percentage a ratio spacer needs.
//
// A spacer rather than `aspect-ratio` deliberately: aspect-ratio makes the
// height *exact*, so at narrow viewports the caption ran past the bottom edge
// and got cut off by the frame's own overflow clipping (the large card lost
// ~3px of its caption at 402). The spacer sits in the same grid cell as the
// content, so the frame is the taller of the two -- Figma's ratio when the
// content fits, and content height when it doesn't. Nothing clips.
//
// That property is what makes the two caps below safe: they only ever shrink
// the SPACER, and the frame still falls back to its content height. There is
// no arrangement of viewport and card width that can clip a caption.
//
// --- The frame ratio and the artwork width, per size -------------------------
//
// ONE TABLE, and it has to be these literal class strings rather than values a
// helper composes: Tailwind scans this file as raw TEXT, so a class name that
// only exists after string concatenation is never generated. A parallel table
// of "the real numbers" alongside them would be a second source that nothing
// renders from -- the exact drift CLAUDE.md's no-duplication rule is about --
// so the numbers are documented here and stated once.
//
//   --media-frame      the spacer's padding-top: frame height as % of card width
//   --media-image      the artwork's width as a % of the frame width
//   --media-frame-cap  a ceiling on the frame height against the VIEWPORT height
//   --media-image-cap  the matching ceiling on the artwork width
//
// The frame renders `min(--media-frame, --media-frame-cap)` and the artwork
// `min(--media-image, --media-image-cap)`.
//
// THE RATIOS ARE THE FIGMA VALUES AT EVERY WIDTH AND HEIGHT. No regime changes
// them:
//
//   large   frame  61.4335%  (600 of 976.667)   image  90.10%  (880 of 976.667)
//   medium  frame  68.5053%  (385 of 562)       image  94.47%  (530.904 of 562)
//   small   frame 108.5527%  (385 of 354.667)   image  90.23%  (320 of 354.667)
//
// --- Why there is no laptop ratio (Flore, 2026-08-25) -----------------------
//
// There briefly was one. The 2026-08-25 density pass shortened `medium` and
// `small` to 58.5%/92.0% across the laptop band, with the artwork width pulled
// down in step (94.47% -> 80.77%, 90.23% -> 76.46%) so the tinted mat kept its
// proportion. `large` kept its ratio but picked up a 48svh height cap, which
// amounted to the same thing at laptop heights: at 1440x790 it rendered a 49.3%
// frame with the artwork at 72.3% instead of 90.1%.
//
// Flore reverted all of it. The reasoning is worth keeping because the tradeoff
// is real and someone will be tempted again:
//
// A card gets shorter either by being NARROWER or by holding LESS ARTWORK
// relative to its own width. The first preserves the media's design and is what
// the featured card now does -- it drops from 5 grid columns to 4 at `xl` (see
// WORK_FEATURED_CARD in lib/layout.js), and because the frame height is a ratio
// OF THE CARD WIDTH, a narrower card is a shorter frame for free. The second
// buys height by spending the design: the artwork shrinks inside a widening
// band of flat tint, and on `small` in particular that band is what its
// deliberate right-bleeding crop reads against.
//
// So the featured card takes the first route and the 2-up/3-up cards take
// neither. Their widths are fixed by their grids and their ratios are now fixed
// here, which leaves only the type scale and the card's own gaps -- about 45px
// each. That is the honest cost of the constraint, and it is a choice rather
// than an oversight: `medium` sits at 0.87 of a 1440x790 viewport where the
// laptop ratio had it at 0.79.
//
// --- The caps are now a safety ceiling, not a density lever -----------------
//
// 100svh, flat, at every width: media may never be taller than the screen.
// Nothing else. At the Figma card widths the tallest frame is 600, so this
// cannot fire above a 600px-tall viewport and does not touch any laptop.
//
// It is kept rather than deleted because it is the one statement here that
// stays true whatever the ratios above become, and because a frame taller than
// the window is the failure it exists to make impossible. Do NOT reach for it
// as a way to compact the cards -- lowering it is exactly the artwork-shrinking
// route Flore rejected above, just expressed in a different unit.
//
// The image caps are DERIVED, never chosen: the frame cap times the artwork's
// own width-to-frame-height ratio, so if the ceiling ever does fire the artwork
// shrinks in step with the frame instead of overflowing it.
//
//   large   100 x (880 / 600)      = 146.7svh
//   medium  100 x (530.904 / 385)  = 137.9svh
//   small   100 x (320 / 385)      =  83.1svh
//
// Safe by construction: a cap only ever shrinks the SPACER, and the frame is a
// grid cell holding both the spacer and the content, so it still falls back to
// content height. No viewport can clip a caption.
//
// `svh` not `vh`, the same call the map's crop viewport made (see
// PanZoomContainer): `vh` tracks the LARGEST mobile viewport and changes as the
// browser chrome collapses during scroll, which would resize the artwork
// mid-scroll.
//
// Custom properties rather than plain inline values because the frame and
// artwork percentages resolve against a box Tailwind has no utility for, and
// the `min()` mixes two units. Keeping them as variables also means a future
// regime, if one is ever wanted, is added here rather than by threading a prop.
const MEDIA_VARS = {
  large:
    '[--media-frame:61.4335%] [--media-image:90.10%] ' +
    '[--media-frame-cap:100svh] [--media-image-cap:146.7svh]',
  medium:
    '[--media-frame:68.5053%] [--media-image:94.47%] ' +
    '[--media-frame-cap:100svh] [--media-image-cap:137.9svh]',
  small:
    '[--media-frame:108.5527%] [--media-image:90.23%] ' +
    '[--media-frame-cap:100svh] [--media-image-cap:83.1svh]',
}

const IMAGE_ASPECT = {
  large: '880 / 447',
  medium: '530.904 / 315.719',
  small: '320 / 278',
}

// Gap between artwork and caption, inside the tinted area.
const STACK_GAP = {
  large: 'gap-space-24',
  medium: 'gap-space-12',
  small: 'gap-space-16',
}

// Small is the one variant whose artwork is right-aligned rather than centred:
// it bleeds off the right edge of the frame with the tint showing only on the
// left. Checked against the rendered Figma frame before building it -- it's a
// deliberate cropped-screenshot look, not a slip like the ValueCard row was.
const STACK_ALIGN = {
  large: 'items-center',
  medium: 'items-center',
  small: 'items-end',
}

const FRAME_RADIUS = {
  large: 'rounded-radius-32',
  medium: 'rounded-radius-20',
  small: 'rounded-radius-20',
}

export default function ProjectMedia({ src, alt, caption, size = 'medium', badge, tint }) {
  return (
    <div
      data-component="project-media"
      data-size={size}
      // The hover lift belongs on this frame rather than the <img> inside it.
      // The frame is the card's visual object -- it owns the radius, the
      // border overlay and the badge pinned to its corner -- so lifting it
      // moves the card as one thing. On the image it would instead float
      // inside a static bordered box, away from its own caption (which sits
      // below it in the same tinted panel), and `overflow-hidden` here would
      // trap the shadow inside the frame so it could never read as elevation.
      //
      // 0/0/20/25% continues the site's one shadow language, which is always
      // X0 Y0 at 25% black with only the blur scaling to the object: 5 for the
      // nav pill and popover, 10 for the hotspot dot, 20 for something card-
      // sized. Flore's values, from Figma.
      //
      // Driven by the card's hover, not this element's, so the whole card
      // responds together -- and by focus-within too, so keyboard users get
      // the same feedback as mouse users rather than just a ring on the CTA.
      //
      // Arbitrary `[box-shadow:...]` rather than Tailwind's `shadow-[...]`
      // utility, which does NOT work here. That utility sets `--tw-shadow` and
      // declares `box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-
      // shadow), var(--tw-shadow)` -- so the declaration text is byte-identical
      // at rest and on hover and only the custom property changes underneath.
      // Custom properties aren't in `transition-property`, so Chrome sees no
      // change to a transitionable property, never advances the transition, and
      // pins box-shadow at its pre-hover value permanently. Confirmed in the
      // browser: with `transition-shadow` the computed shadow stayed fully
      // transparent; setting transition-property to none made the exact same
      // classes paint rgba(0,0,0,0.25) 0 0 20px. A literal value at both ends
      // is what actually animates. Keep both ends literal if you touch this.
      className={`relative grid w-full min-w-0 overflow-hidden transition-shadow duration-200 [box-shadow:0_0_0_0_rgba(0,0,0,0)] group-hover:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)] group-focus-within:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)] ${MEDIA_VARS[size]} ${FRAME_RADIUS[size]}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none w-0 [grid-area:1/1]"
        style={{ paddingTop: 'min(var(--media-frame), var(--media-frame-cap))' }}
      />
      <div
        data-component="project-media-tint"
        className={`flex flex-col justify-center [grid-area:1/1] ${STACK_ALIGN[size]} ${FRAME_RADIUS[size]}`}
        style={{ backgroundColor: tint }}
      >
        <div
          className={`flex flex-col items-center justify-center ${STACK_GAP[size]}`}
          style={{ width: 'min(var(--media-image), var(--media-image-cap))' }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full object-cover"
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: IMAGE_ASPECT[size] }}
          />
          {caption && (
            <p
              data-component="project-media-caption"
              className={`w-full text-center text-caption font-normal ${
                size === 'small' ? 'pr-space-12' : ''
              }`}
            >
              {caption}
            </p>
          )}
        </div>
      </div>
      {/* The frame's border, as an overlay so it doesn't participate in
          layout -- see the --media-image note above for why. Solid, not
          dashed: the dashed stroke read as the "asset pending" convention on
          cards that have real artwork, and Flore changed it in Figma. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border border-solid border-border-grey ${FRAME_RADIUS[size]}`}
      />
      {badge}
    </div>
  )
}
