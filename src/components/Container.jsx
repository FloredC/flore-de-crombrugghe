// The page's container chain, read off both Figma frames:
//
//   1622 page  ->  171 outer margin  ->  1280 content  ->  48 padding  ->  1184
//    402 page  ->   16 outer margin  ->        (none)  ->   0 padding  ->   369
//
// max-w-[1280px] + horizontal padding reproduces both ends exactly: at a
// 1622 viewport the leftover 342px splits into two 171px margins, and the
// inner box lands on 1184. At >= 1280 the inner box is *always* exactly
// 1184 -- which is what lets the Approach/About collage use real pixel
// offsets at `xl` without them drifting with the viewport.
//
// Above 1622 the content stays capped here and the margins keep growing
// (per Flore). The map is the deliberate exception -- it scales past 1622
// instead of capping; see Hero.jsx.
//
// Padding is fluid between the two Figma anchors rather than stepped through
// breakpoints. 4vw hits 16px at the 402 frame and 48px at 1280+ (where the
// clamp takes over), so both real values are exact and everything between is
// a straight interpolation instead of invented steps.
//
// Fluid rather than stepped for a concrete reason, not neatness: with
// breakpoint steps the inner width ran *backwards* at each one -- 1215px at
// a 1279 viewport, then 1184px at 1280, because the padding jumped 32->48
// faster than the viewport grew. Content getting narrower as the window
// widens is visible and looks like a bug. A clamp can't do that.
// `id` is passed through rather than spread: a container is sometimes the only
// element wrapping a page landmark (the case studies' closing contact block),
// and that block needs to be addressable. One named prop rather than {...rest}
// keeps the element's surface deliberate -- Container is a layout primitive, not
// a div with extra steps.
export default function Container({ children, className = '', id }) {
  return (
    <div
      id={id}
      className={`mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] ${className}`}
    >
      {children}
    </div>
  )
}
