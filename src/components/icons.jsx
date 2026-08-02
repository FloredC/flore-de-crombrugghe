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
export { default as ArrowBackIcon } from '../assets/icons/ic-arrow-back.svg?react'
export { default as CopyIcon } from '../assets/icons/ic-copy.svg?react'
export { default as ExternalLinkIcon } from '../assets/icons/ic-external-link.svg?react'
export { default as MenuIcon } from '../assets/icons/ic-menu.svg?react'
export { default as CloseIcon } from '../assets/icons/ic-close.svg?react'
