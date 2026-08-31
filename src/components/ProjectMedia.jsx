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
  // `small` takes NEITHER regime treatment from `xl` up -- no artwork shrink
  // and no height cap. One frame ratio and one artwork width at every width.
  //
  // The artwork width, 81.1372% (287.77 of 354.67), is Flore's own from the
  // ProjectMedia instance (node 2928:78184) and is NOT touched by this pass --
  // only the artwork's crop and the frame's height moved.
  //
  // DERIVED, not sampled -- recomputed 2026-08-28 from the 3:2 crop above.
  // Against Figma's 354.667 card, with the artwork at 81.1372% (287.77 wide):
  //
  //   panel padding    Spaces/4 top + 12 bottom =  16
  //   caption          2 lines x 14 x 1.4       =  39.2   (reserved, below)
  //   caption gap      Spaces/8                 =   8
  //   artwork          whatever is left         = 191.85
  //                                              -------
  //   content                                     255.05 -> 71.91% of 354.667
  //
  // Read the other way round now that the artwork is flexible: this percentage
  // SETS the panel height, and the artwork gets the remainder. 71.91% keeps the
  // artwork at the 288x192 that Flore signed off ("it looks good"), while the
  // padding and the tighter caption gap come from her component. Raise this
  // number and the artwork gets taller; nothing else needs touching.
  //
  // The frame ratio and the content height are therefore THE SAME NUMBER, on
  // purpose. The frame is a grid cell holding a ratio spacer and the content,
  // so whichever is taller wins; making them equal means the panel is exactly
  // as tall as it needs to be and no taller, and every card in the row lands on
  // the same height. Re-derive this if the crop, the artwork width or the
  // caption reservation change -- it is arithmetic, not taste.
  //
  // Image cap re-derived with it: 287.77 / 255.05 = 1.1283.
  small:
    '[--media-frame:71.91%] [--media-image:81.1372%] ' +
    '[--media-frame-cap:100svh] [--media-image-cap:112.83svh]',
}

// --- `small`: WHY IT CANNOT BE LANDSCAPE YET (2026-08-27) -------------------
//
// Flore's goal for these three cards: "give them the same landscape ratio as
// the other cards. I don't think this rectangular aspect works."
//
// That is blocked on the ASSETS, not on this file, and the numbers are worth
// keeping so nobody re-attempts it in CSS:
//
//   every medium/large thumbnail   1062x631  (Artifakt 1760x910)   ratio 1.68
//   the three small thumbnails     1280x1112                       ratio 1.15
//
// The small trio's artwork is near-square while the rest of the family is
// landscape. Because the artwork sits CONTAINED on the tint rather than being
// cropped to the panel, its own height is what sets the panel's height floor —
// so a landscape panel can only be bought by shrinking the artwork.
//
// Measured against the 354.67 card, with the caption's 16 gap + 40 box:
//
//   to match `medium`'s 68.5% frame   panel 243   artwork must be 60.7% wide
//   Flore's current drawing            panel 340   artwork is       81.1% wide
//
// So true parity costs another ~25% off artwork that she already objected to
// as "very small and hard to see" (see the 2026-08-25 note below). The two
// goals are genuinely incompatible at this asset ratio.
//
// THE FIX IS A RE-EXPORT, and it is cheap: at 1.683 the artwork Flore has
// already drawn (81.14% = 287.77 wide) would be 171 tall, so the panel lands at
// 227 = 64% of the card — landscape, slightly MORE so than `medium`, with no
// shrinking at all. One line here follows.
//
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
  // `small` DECLARES NO RATIO -- Flore, 2026-08-28: "it doesn't work with
  // images of a fixed size... the images sizes should be more flexible."
  //
  // It briefly had `3 / 2` here, which is exactly the fixed size she is
  // objecting to: a hardcoded crop that every other number had to be arranged
  // around, and that silently overrode whatever ratio she exported. Her
  // component makes the artwork a MASK inside the panel instead (node
  // 2928:78065 -- `overflow-clip` with the image scaled larger behind it), so
  // the crop is a consequence of the box, not a declaration.
  //
  // `small` instead sets a FLOOR, not a size. The artwork is `flex-1` in the
  // stack below, so it takes whatever height is left after the caption, its gap
  // and the panel's padding -- but it will not shrink past 3:2, because on a
  // flex item `min-height: auto` resolves to the intrinsic size and an
  // `aspect-ratio` is what supplies that.
  //
  // That floor is what makes the group height adapt to the caption, which is
  // the behaviour Flore asked for ("The height of the small cards group should
  // adapt to the longest text (number of lines)"). Without it a longer caption
  // silently ate the artwork instead:
  //
  //   2-line caption   leftover 192 = the floor exactly -> panel 255, ratio wins
  //   3-line caption   leftover 172 < floor             -> artwork holds at 192
  //                                                        and the panel GROWS
  //
  // So the number is a minimum shape, not a fixed crop -- the artwork is free
  // to be less cropped whenever there is room, and the panel is free to be
  // taller whenever the words need it.
  smallFloor: '3 / 2',
  small: null,
}

// Gap between artwork and caption, inside the tinted area.
const STACK_GAP = {
  large: 'gap-space-24',
  medium: 'gap-space-12',
  // 8 as of 2026-08-28, from Flore's component (Image mask 2928:78065, whose
  // 252.66 height is 204.66 artwork + 8 + 40 caption).
  small: 'gap-space-8',
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

// RADIUS IS RESPONSIVE ON `large` ONLY -- Flore, 2026-08-28: "There seems to be
// a bug in the rounded corners of the artifakt media card on mobile (rounded
// corners are too big compared to the others)."
//
// It was a flat 32 at every width. That is right at `xl`, where the featured
// card really is the biggest thing on the page (977 wide against the 2-up's 562
// and the 3-up's 355) and a larger radius reads as proportional. Below `xl` the
// grids all collapse to one column, so every card is the SAME width -- and the
// only card with a 32 radius then looks like a mistake rather than a hierarchy.
//
// `xl` is the breakpoint because that is where the featured card stops sharing
// its width with everything else (see WORK_FEATURED_CARD in lib/layout.js).
const FRAME_RADIUS = {
  large: 'rounded-radius-20 xl:rounded-radius-32',
  medium: 'rounded-radius-20',
  small: 'rounded-radius-20',
}

export default function ProjectMedia({ src, alt, caption, size = 'medium', badge, tint, pattern }) {
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
        // PANEL PADDING is `small`-only, from Flore's component: Spaces/8 top
        // and bottom (node 2928:78064). The other two sizes have never had any
        // -- their artwork is centred in a frame with room to spare.
        // `pattern` is a background-IMAGE class (see mediaPatterns in
        // mediaTints.js); the inline colour below stays the ground it sits on.
        // The two do not fight: they are different properties.
        className={`flex flex-col justify-center [grid-area:1/1] ${STACK_ALIGN[size]} ${FRAME_RADIUS[size]} ${
          size === 'small' ? 'gap-space-12 py-space-8' : ''
        } ${pattern ?? ''}`}
        style={{ backgroundColor: tint }}
      >
        {size === 'small' ? (
          <>
            {/* THE CAPTION IS CENTRED ON THE PANEL, NOT ON THE ARTWORK --
                Flore, 2026-08-28, restructured in the component (node
                2928:78062): the caption wrapper moved OUT of the Image mask and
                is now its full-width sibling.

                It matters because the artwork is only 81% of the panel and is
                RIGHT-ALIGNED (see STACK_ALIGN -- the deliberate cropped-
                screenshot look), so a caption centred inside the artwork's
                column sat visibly off-centre in the tinted panel it appears to
                belong to. Now the artwork keeps its right-hand bleed and the
                caption reads as centred in the card.

                So the two are siblings here rather than one stack: the artwork
                sits in a right-aligned wrapper that takes the leftover height,
                and the caption spans the panel underneath it. */}
            <div
              // `flex-1` takes the height left after the caption and the
              // padding -- this is the flexible sizing from the previous pass,
              // just moved onto the wrapper now that the stack is gone.
              // `min-h-0` is NOT set, deliberately: the image's aspect-ratio
              // floor depends on `min-height: auto`. See IMAGE_ASPECT.
              className="flex min-h-0 flex-1 flex-col"
              style={{ width: 'min(var(--media-image), var(--media-image-cap))' }}
            >
              <img
                src={src}
                alt={alt}
                // `object-top` so the 18.8% the crop has to remove all comes
                // off the bottom rather than being split top and bottom -- the
                // top is where these images carry what identifies them.
                className="min-h-0 w-full flex-1 object-cover object-top"
                loading="lazy"
                decoding="async"
                style={{ aspectRatio: IMAGE_ASPECT.smallFloor }}
              />
            </div>
            {caption && (
              <p
                data-component="project-media-caption"
                // `w-full` is the whole point -- the panel's width, not the
                // artwork's.
                //
                // `px-space-16`, SYMMETRIC, as of 2026-08-28. It was `pr-12`,
                // which nudged the text 6px left of the panel's true centre --
                // I flagged that as a deliberate-looking lean toward the edge
                // the artwork bleeds away from, and Flore's answer was to even
                // it up. The text is now optically centred on the tint, which
                // is what "centre the caption on the background" asked for.
                //
                // TWO LINES RESERVED (`2.8em` = 2 x the token's 1.4
                // line-height, in `em` so it tracks `text-caption` as that ramps
                // 12 -> 13 -> 14). It is what keeps the three artworks the same
                // size as each other: the panels are equalised by subgrid, so
                // without a fixed caption box a one-line card would hand its
                // spare height to its artwork and the row would go uneven.
                //
                // `flex items-center` so a one-line caption sits centred in
                // that reserved box rather than clinging to its top edge,
                // matching the component's own `items-center` wrapper.
                className="flex min-h-[2.8em] w-full items-center justify-center px-space-16 text-center text-caption font-normal"
              >
                {caption}
              </p>
            )}
          </>
        ) : (
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
                className="w-full text-center text-caption font-normal"
              >
                {caption}
              </p>
            )}
          </div>
        )}
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
