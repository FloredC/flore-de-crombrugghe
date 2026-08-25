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
// --- The four media variables, per size and per regime ----------------------
//
// ONE TABLE, and it has to be these literal class strings rather than values a
// helper composes: Tailwind scans this file as raw TEXT, so a class name that
// only exists after string concatenation is never generated. A parallel table
// of "the real numbers" alongside them would be a second source that nothing
// renders from -- the exact drift CLAUDE.md's no-duplication rule is about --
// so the numbers are documented here and stated once.
//
//   --media-frame      the spacer's padding-top: frame height as % of card width
//   --media-frame-cap  the same height, capped against the VIEWPORT height
//   --media-image      the artwork's width as a % of the frame width
//   --media-image-cap  the same width, capped against the viewport height
//
// The frame renders `min(--media-frame, --media-frame-cap)` and the artwork
// `min(--media-image, --media-image-cap)`, so whichever constraint is tighter
// wins and the other is inert.
//
// --- Base: the Figma frame, and what `2xl` restores -------------------------
//
//   large   frame  61.4335%  (600 of 976.667)   image  90.10%  (880 of 976.667)
//   medium  frame  68.5053%  (385 of 562)       image  94.47%  (530.904 of 562)
//   small   frame 108.5527%  (385 of 354.667)   image  90.23%  (320 of 354.667)
//
// --- Laptop, 2026-08-25 -----------------------------------------------------
//
// The three sizes get there by different routes, and the split is deliberate.
//
// LARGE takes it out of the VIEWPORT HEIGHT, not the ratio. It already narrows
// from 5 grid columns to 4 at `xl` (see WORK_FEATURED_CARD in lib/layout.js),
// which takes the card 977 -> 769 and the frame 600 -> 472 for free, with every
// internal proportion intact. That alone lands it at 0.94 of a 1440x790
// viewport -- it fits, but only just, and at 1366x670 it does not fit at all,
// because the card's height does not know how tall the window is. So the cap
// drops to 48svh across the laptop band and becomes the binding constraint
// there: the featured card is height-driven at laptop sizes and width-driven
// everywhere else. 0.82 at 1440x790, 0.88 at 1366x670, and it stays under 1.0
// on any laptop shape rather than on the ones we happened to test.
//
// MEDIUM and SMALL keep their card widths (the 2-up and 3-up grids are not
// changing), so the ratio itself is the only lever. Each pair is derived rather
// than picked -- hold the artwork's share of the frame height constant and the
// tinted mat scales with everything else:
//
//   medium  frame 68.5053% -> 58.5%   (385 -> 329 on a 562 card)
//           image 94.47%   -> 80.77%  (531 -> 454 wide, so 270 tall --
//                                      270/329 = 316/385, the share preserved)
//   small   frame 108.5527% -> 92.0%  (385 -> 327 on a 355 card)
//           image 90.23%    -> 76.46% (320 -> 271 wide, 236 tall, same share)
//
// So their artwork does shrink, by about 15% -- but the mat around it shrinks
// with it rather than swelling, which is what would have turned the card into a
// small photo floating on a big colour field.
//
// --- Why these are custom properties ----------------------------------------
//
// All four land in `style` (percentages of a box Tailwind has no utility for,
// and a `min()` of two different units), and an inline style has no
// breakpoints. Switching the VARIABLE through the normal `xl:`/`2xl:` variants
// keeps the regime change in the same system as every other responsive value on
// the site, instead of a media query buried in a component.
const MEDIA_VARS = {
  large:
    '[--media-frame:61.4335%] [--media-image:90.10%] ' +
    '[--media-frame-cap:100svh] [--media-image-cap:146.7svh] ' +
    'xl:[--media-frame-cap:48svh] xl:[--media-image-cap:70.4svh] ' +
    '2xl:[--media-frame-cap:62svh] 2xl:[--media-image-cap:90.93svh]',
  medium:
    '[--media-frame:68.5053%] [--media-image:94.47%] ' +
    '[--media-frame-cap:100svh] [--media-image-cap:137.9svh] ' +
    'xl:[--media-frame:58.5%] xl:[--media-image:80.77%] ' +
    'xl:[--media-frame-cap:40svh] xl:[--media-image-cap:55.16svh] ' +
    '2xl:[--media-frame:68.5053%] 2xl:[--media-image:94.47%]',
  // `small` takes NEITHER regime treatment from `xl` up -- no artwork shrink and
  // no height cap. Its artwork is 90.23% of the frame at every width, and the
  // frame is just tall enough to hold it plus a band of tint. See the note
  // below.
  small:
    '[--media-frame:108.5527%] [--media-image:90.23%] ' +
    '[--media-frame-cap:100svh] [--media-image-cap:83.1svh] ' +
    'xl:[--media-frame:96%]',
}

// --- `small`: the panel hugs the artwork (Flore, 2026-08-25) ----------------
//
// Flore: "there's no need for them to be rectangles" -- the Sinomocene,
// Teamchatviz and Roche cards -- followed by "I don't want you to shrink the
// artwork (otherwise it will be very small and hard to see), I want you to
// reduce the height slightly."
//
// Those two are not both satisfiable at every width, so the priority is hers:
// artwork legibility first.
//
// THE GEOMETRY, because it is what makes this variant awkward. All three assets
// are near-square (640x556). In a 355px column an artwork at 90.23% is 320 wide
// and therefore 278 TALL, which is most of the panel on its own. Add the 16
// caption gap and the caption itself and the content is ~312 -- so the frame
// can never be shorter than that, whatever the ratio says (the spacer only sets
// a MINIMUM; see the note at the top of this file). Figma's 108.5527% draws it
// at 385, leaving ~36px of empty tint above and below.
//
// So `96%` is not a chosen number: it is 312 of content plus a ~14px band of
// tint, expressed against the 355 card. It happens to serve both regimes with
// one value because the only thing that differs between them is the caption's
// own line height, which moves the content by 1.4px.
//
// WHAT WAS REMOVED, and why it was working against her:
//
//   xl:[--media-image:76.46%]     shrank the artwork to 263 wide at laptop
//   xl:[--media-image-cap:33.25svh]  shrank it further on a short window --
//                                    223 wide at 1366x670
//   xl:[--media-frame-cap:40svh]     the frame cap those two existed to serve
//
// Together those were the "very small and hard to see" she is objecting to.
// Restoring the artwork costs height at laptop rather than saving it -- the
// card goes 558 -> 583 at 1440x790 -- which is the opposite of "reduce the
// height", and is the trade she chose knowingly. At 1600+ both goals align and
// the card drops 672 -> 628.
//
// `medium` and `large` keep their caps: their artwork is not the one that was
// getting too small, and `large`'s cap is what keeps the featured card on a
// laptop screen at all.

// --- The viewport-height caps, and why they are the numbers they are --------
//
// This is the one place on the homepage that asks how TALL the window is, and
// media is the only term big enough to deserve it: 52-68% of a project card.
//
// Everything else in this pass is a width query, because width is the only
// signal CSS gives that says "this is a laptop". But the quantity that decides
// whether a card reads as a contained object is its height against the
// viewport's, and those two had come apart badly: card height was CONSTANT from
// 1280px up, while laptop viewport height runs ~670 (1366x768) to ~870
// (1512x982) against 1000-1300 on an external monitor. The identical card was
// 0.74 of one screen and 1.12 of another. Same shape as the Artifakt
// screencast's own cap (see SCREENCAST_MAX_WIDTH in CaseStudyArtifakt.jsx) --
// this is that idea applied to the card grid.
//
//              < xl      xl (laptop)   2xl (large desktop)
//   large      100svh      48svh          62svh
//   medium     100svh      40svh          40svh
//   small      100svh     100svh         100svh   (see the `small` note above)
//
// 100svh BELOW `xl` MEANS "NO CAP", written as a real limit rather than as a
// disable. Below the desktop grid a card is full-bleed and its media is
// naturally proportional to a narrow card -- the phone layout is drawn that way
// in Figma and Flore asked for it to stay. Left ungated, 40svh cut the small
// card's media from 402 to 316 at the 402 frame, which is a mobile change
// nobody asked for. 100svh still says something true (media may never exceed
// the whole screen) and can only ever fire in a viewport shorter than the card
// is wide.
//
// THE 2xl CAPS ARE CHOSEN NOT TO BITE ON A TALL WINDOW, which is what keeps the
// promise that 1600px+ is unchanged: large's frame is 600 at the desktop card
// width, so 62svh only starts cutting below a 968px-tall viewport; medium/small
// are 385, so 40svh cuts below 963. Above that the ratio wins and the Figma
// frame renders exactly -- verified at 1728x1000, where every measurement is
// identical to the pre-2026-08-25 page. On a genuinely SHORT window at 1600px+
// the cap does engage, and that is intended: a card taller than the screen is
// the problem being fixed, and it is not a problem only laptops have.
//
// The image caps are DERIVED, never chosen: frame cap x the artwork's own
// width-to-frame-height ratio, so the artwork shrinks in step with the frame
// instead of overflowing it.
//
//                base 100svh x r      xl              2xl
//   large  r =  880/600   = 1.467    146.7   70.4    90.93
//   medium r = 530.904/385 = 1.379    137.9   55.16    -
//   small  r =  320/385    = 0.831     83.1   33.25    -
//
// One image cap covers BOTH ratio regimes for medium and small, because their
// laptop pairs scale image width and frame height by the same factor --
// medium's 80.77/58.5 = 1.3806 against the base 530.904/385 = 1.379. Re-derive
// if a laptop ratio is ever retuned on its own.
//
// Safe by construction: a cap only ever shrinks the SPACER, and the frame is a
// grid cell holding both the spacer and the content, so it still falls back to
// content height. No viewport can clip a caption.
//
// `svh` not `vh`, the same call the map's crop viewport made (see
// PanZoomContainer): `vh` tracks the LARGEST mobile viewport and changes as the
// browser chrome collapses during scroll, which would resize the artwork
// mid-scroll.

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
