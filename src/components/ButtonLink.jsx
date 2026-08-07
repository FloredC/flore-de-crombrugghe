import { Link } from 'react-router-dom'

const VARIANTS = ['primary', 'secondary', 'tertiary', 'menu', 'popover']

// 18px/700 (Desktop/body-bold), confirmed from Figma for BOTH the primary and
// secondary labels -- the Contact button samples as
// font-['HK_Grotesk:Bold'] text-[18px] in every navbar variant.
//
// This used to be applied only when a variant had no class of its own, which
// in practice meant never: every real variant has one, so primary/secondary
// silently inherited the page's font-weight and rendered at 400 instead of
// 700. Now baked into the variants that need it (see VARIANT_CLASS), so the
// fix lands at the root component rather than being patched per call site.
// Letter spacing is a deliberate divergence: every Figma text style sets
// letterSpacing 0, but the button labels are bold and set on a filled dark
// surface, where tight tracking hurts legibility. Flore's call, 2026-08-04.
// One value to tune if it wants to be looser or tighter.
const TYPE_CLASS = 'text-body font-bold tracking-[0.02em]'

// Shared pill shape/padding, sampled directly from the Figma "ButtonLink"
// primary variant: px-24/py-16 (Tailwind's default px-6/py-4 happen to equal
// those exact px values, not a coincidence to rely on if the default scale
// ever changes), rounded-32. Secondary reuses the same shape -- no direct
// Figma sample for it specifically, but it's the same button family, just an
// outline treatment instead of a filled one.
// Every variant gets the focus ring, not just the ones with chrome -- Figma's
// state=focus row shows a blue outline on all four (primary, secondary, menu,
// Popover), and previously only primary/secondary had one because the ring
// lived inside CHROME_CLASS.
export const FOCUS_CLASS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2'

const CHROME_CLASS = `inline-flex items-center gap-1 rounded-radius-32 border px-6 py-4 ${FOCUS_CLASS}`

// The link/menu treatment: one class shared by every plain-text ButtonLink
// usage in the app -- Footer's "Download CV", SubpageNav's "Back to
// Portfolio", and the navbar's Work/Approach/About links (desktop and
// mobile). Per Flore, these are literally the same Figma component, so
// their states should look the same rather than being split by usage.
//
// Color dims grey-90 -> grey-80 (hover) -> grey-70 (pressed) -- not disputed,
// still the real action-link tokens. NO underline on hover or pressed, for
// any of them: I'd previously split this into two classes on the theory that
// Download CV/Back to Portfolio had a sampled hover-underline (from the
// standalone Buttons&Controls grid) while the navbar links didn't -- Flore
// corrected that too: same component, same states, no hover underline either
// way. The Buttons&Controls grid's hover row showing an underline doesn't
// override that.
//
// Underline is reserved entirely for LINK_UNDERLINE_CLASS below, applied only
// to mark "this is the current section" on nav links -- never triggered by
// hover/active, and never used on Download CV/Back to Portfolio, which have
// no concept of "current" at all.
//
// Naming: Figma calls this variant "menu"; CLAUDE.md's button family calls the
// action-link treatment "Tertiary". Same thing, so both names map here rather
// than one silently rendering unstyled -- worth collapsing to one name in
// Figma eventually, flagged to Flore.
export const LINK_CLASS = `font-bold text-action-link-foreground hover:text-action-link-foreground-hover active:text-action-link-foreground-pressed ${FOCUS_CLASS}`

// The underline itself, matching Figma's rule under the label: ~2px thick,
// sitting 2px below the text. Used exclusively for the navbar's
// selected/current-section state (e.g. the underlined "Work" in
// NavbarDesktop placement=Homepage) -- not tied to any hover/active state.
export const LINK_UNDERLINE_CLASS = 'underline decoration-2 underline-offset-[3px]'

// No confirmed "surface-default" token for secondary -- components.css only
// defines surface-hover/pressed, implying an outline style: no fill at rest,
// a light grey fill appears on hover/press.
//
// Exported (not just kept in VARIANT_CLASS below) because the Contact
// section's email button needs this exact chrome on a <button>, not an <a>
// -- it copies to clipboard rather than navigating, so per CLAUDE.md's
// tag-follows-behavior rule it can't be a ButtonLink instance, but it's
// still visually the secondary button and must not drift from it.
export const SECONDARY_BUTTON_CLASS = `${CHROME_CLASS} ${TYPE_CLASS} bg-transparent border-action-secondary-border text-action-secondary-foreground hover:bg-action-secondary-surface-hover hover:border-action-secondary-border-hover hover:text-action-secondary-foreground-hover active:bg-action-secondary-surface-pressed active:border-action-secondary-border-pressed active:text-action-secondary-foreground-pressed`

// Per Flore: hover/pressed on the filled/outline variants is a text+surface
// color change, not a background wash on the plain-text ones.
const VARIANT_CLASS = {
  primary: `${CHROME_CLASS} ${TYPE_CLASS} bg-action-primary-surface border-action-primary-border text-action-primary-foreground hover:bg-action-primary-surface-hover hover:border-action-primary-border-hover hover:text-action-primary-foreground-hover active:bg-action-primary-surface-pressed active:border-action-primary-border-pressed active:text-action-primary-foreground-pressed`,
  secondary: SECONDARY_BUTTON_CLASS,
  // Reworked 2026-08-07 for the discipline-colour concept. It used to be plain
  // orange text with no chrome; Figma's Hotspot Popover (node 2760:18699) now
  // gives it a filled pill whose colour is the hotspot's discipline, so the
  // popover carries the same grouping the marker does.
  //
  // The surface is --discipline-surface, set by Popover rather than picked
  // here: this file has no idea which hotspot it's rendering for, and pushing
  // a colour prop through would put four hardcoded colour branches in a
  // component whose whole job is that there's one of each thing.
  //
  // Label colour steps to the SECONDARY foreground tokens, not the accent ones
  // it used before -- Figma's default state samples as button/secondary/text
  // (#0e0e0e), which is a real change, not a mis-sample. Hover and pressed
  // follow the same family. Figma defines no hover/pressed *surface* for this
  // button, so the fill holds and only the label moves; flagged to Flore.
  //
  // rounded-full, not a radius token: Figma's value is 64px on a pill roughly
  // 20px tall, and CSS clamps any radius past half the short side, so 64 and
  // "fully round" paint identically here. rounded-full can't go stale if the
  // label size changes; a literal 64 could.
  popover: `inline-flex items-center gap-1 rounded-full bg-[var(--discipline-surface)] px-space-8 py-space-0 text-caption font-semibold text-action-secondary-foreground hover:text-action-secondary-foreground-hover active:text-action-secondary-foreground-pressed ${FOCUS_CLASS}`,
  tertiary: `inline-flex items-center gap-1 ${LINK_CLASS}`,
  menu: `inline-flex items-center gap-1 ${LINK_CLASS}`,
}

export default function ButtonLink({ variant = 'primary', to, href, children, className: extraClassName, ...props }) {
  if (!VARIANTS.includes(variant)) {
    throw new Error(`ButtonLink: unknown variant "${variant}"`)
  }

  const dataAttrs = { 'data-variant': variant }
  const variantClass = VARIANT_CLASS[variant]
  const className = `${variantClass ? '' : TYPE_CLASS} ${variantClass || ''} ${extraClassName || ''}`.trim()

  if (to) {
    return (
      <Link to={to} className={className} {...dataAttrs} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={className} {...dataAttrs} {...props}>
      {children}
    </a>
  )
}
