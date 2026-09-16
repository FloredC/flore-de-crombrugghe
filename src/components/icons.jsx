// Icons are imported straight from the exported SVG assets in
// src/assets/icons via vite-plugin-svgr's `?react` suffix, which compiles
// each file into a real inline <svg> component. The asset files stay the
// single source of truth -- previously the path data was hand-copied into
// JSX here, which meant a re-export from Figma silently wouldn't reach the app.
//
// The plugin is configured (see vite.config.js) to rewrite Figma's hardcoded
// #0E0E0E fill to `currentColor`, so every icon inherits the text color of
// whatever it sits in and can follow hover/pressed/focus states.
//
// Each icon keeps its intrinsic size from the SVG (20px for the arrow/link
// set, 24px for menu/close); pass width/height to override.
export { default as ArrowDownIcon } from '../assets/icons/ic-arrow-down.svg?react'
// CHEVRONS, added 2026-08-30 -- Flore: "I added chevron icons for the
// expandable menu so that it's not confused with the 'go up' icon."
//
// That distinction is the whole reason they exist, and it is worth keeping
// straight at the call sites: a CHEVRON means "this opens and closes", an ARROW
// means "this goes somewhere". The chapter nav needed both at once -- a trigger
// that expands a menu, and a button that returns to the top of the page -- and
// with two arrows they read as the same control pointing two ways.
export { default as ChevronDownIcon } from '../assets/icons/ic-chevron-down.svg?react'
export { default as ChevronUpIcon } from '../assets/icons/ic-chevron-up.svg?react'
export { default as ArrowBackIcon } from '../assets/icons/ic-arrow-back.svg?react'
// The forward arrow on the Artifakt case study's process-log links. The asset
// has been in src/assets/icons since the original export but was never
// re-exported here, so it was unreachable from JSX -- added 2026-08-21 with
// its first call site. Same fill-to-currentColor rewrite as the rest of the
// set, so it follows the link's hover and pressed colours.
export { default as ArrowRightIcon } from '../assets/icons/ic-arrow-right.svg?react'
// The one exception to the currentColor rule above: the home button's arrow is
// a *stroked* vector bound to the `Black` variable (#000000, not the #0E0E0E
// the rest of the set fills with), and Figma holds it at that same black
// through reg/hover/pressed/focus -- only the ring around it dims. So it stays
// a literal stroke colour and deliberately doesn't follow the parent's text.
// RE-EXPORTED 2026-08-30. This was the odd one out of the set: a hand-made
// stroke drawing on a 13.3x20.34 artboard, painted pure #000000 rather than the
// design system's #0E0E0E -- so alone among the icons it could not follow its
// container's colour, and it needed a per-call-site size. Flore added a real
// one to the library ("it was never in my design system"), and it is now a
// 20x20 filled glyph that mirrors `ic-arrow-down` exactly.
//
// Two things went away with it: a `#000000 -> currentColor` rule in
// vite.config.js that existed only for this file, and the bespoke sizes at its
// call sites. Both are gone; every use is now `width={20} height={20}` like the
// rest of the set.
export { default as ArrowUpIcon } from '../assets/icons/ic-arrow-up.svg?react'
export { default as CopyIcon } from '../assets/icons/ic-copy.svg?react'
export { default as ExternalLinkIcon } from '../assets/icons/ic-external-link.svg?react'
export { default as MenuIcon } from '../assets/icons/ic-menu.svg?react'
export { default as CloseIcon } from '../assets/icons/ic-close.svg?react'
