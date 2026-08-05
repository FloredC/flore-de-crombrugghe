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
const FRAME_RATIO_SPACER = {
  large: '61.4335%', // 600 of 976.667
  medium: '68.5053%', // 385 of 562
  small: '108.5527%', // 385 of 354.667
}

// Artwork width as a share of the frame width, and the artwork's own ratio.
//
// These are shares of the *frame*, which is why the dashed border is drawn as
// an overlay below rather than as a real border on this box. A real border (or
// padding) shrinks the box the percentages resolve against, so every artwork
// came out ~0.4% narrow and the small variant's deliberate right-bleed stopped
// reaching the edge. With the border lifted out, the basis is the frame itself
// and these resolve to the Figma pixel sizes exactly.
const IMAGE_WIDTH = {
  large: '90.10%', // 880 of 976.667
  medium: '94.47%', // 530.904 of 562
  small: '90.23%', // 320 of 354.667
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
      className={`relative grid w-full min-w-0 overflow-hidden transition-shadow duration-200 [box-shadow:0_0_0_0_rgba(0,0,0,0)] group-hover:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)] group-focus-within:[box-shadow:0_0_20px_0_rgba(0,0,0,0.25)] ${FRAME_RADIUS[size]}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none w-0 [grid-area:1/1]"
        style={{ paddingTop: FRAME_RATIO_SPACER[size] }}
      />
      <div
        data-component="project-media-tint"
        className={`flex flex-col justify-center [grid-area:1/1] ${STACK_ALIGN[size]} ${FRAME_RADIUS[size]}`}
        style={{ backgroundColor: tint }}
      >
        <div
          className={`flex flex-col items-center justify-center ${STACK_GAP[size]}`}
          style={{ width: IMAGE_WIDTH[size] }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full object-cover"
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
          layout -- see IMAGE_WIDTH above for why. Solid, not dashed: the
          dashed stroke read as the "asset pending" convention on cards that
          have real artwork, and Flore changed it in Figma. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border border-solid border-border-grey ${FRAME_RADIUS[size]}`}
      />
      {badge}
    </div>
  )
}
