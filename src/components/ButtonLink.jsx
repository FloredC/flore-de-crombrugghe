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
const TYPE_CLASS = 'text-body font-bold'

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

// The link/menu treatment, sampled from Figma's "variant=menu" column: text
// dims grey-90 -> grey-80 (hover) -> grey-70 (pressed) AND gains an underline
// on both hover and pressed. The underline was missing entirely before -- I
// had this as a color-only change. Exported so the bare <a>s in Nav and Footer
// get identical states without re-deriving the classes.
//
// Naming: Figma calls this variant "menu"; CLAUDE.md's button family calls the
// action-link treatment "Tertiary". They're the same thing, so both names map
// here rather than one silently rendering unstyled. Worth collapsing to one
// name eventually -- flagged to Flore.
export const LINK_CLASS = `font-bold text-action-link-foreground hover:text-action-link-foreground-hover hover:underline active:text-action-link-foreground-pressed active:underline ${FOCUS_CLASS}`

// The underline itself, matching Figma's rule under the label: ~2px thick,
// sitting 2px below the text. Used both for hover/pressed (above) and for the
// selected/current-section state, which draws the same underline at rest --
// see the underlined "Work" in NavbarDesktop placement=Homepage.
export const LINK_UNDERLINE_CLASS = 'underline decoration-2 underline-offset-[3px]'

// Per Flore: hover/pressed on the filled/outline variants is a text+surface
// color change, not a background wash on the plain-text ones.
const VARIANT_CLASS = {
  primary: `${CHROME_CLASS} ${TYPE_CLASS} bg-action-primary-surface border-action-primary-border text-action-primary-foreground hover:bg-action-primary-surface-hover hover:border-action-primary-border-hover hover:text-action-primary-foreground-hover active:bg-action-primary-surface-pressed active:border-action-primary-border-pressed active:text-action-primary-foreground-pressed`,
  // No confirmed "surface-default" token for secondary -- components.css only
  // defines surface-hover/pressed, implying an outline style: no fill at
  // rest, a light grey fill appears on hover/press.
  secondary: `${CHROME_CLASS} ${TYPE_CLASS} bg-transparent border-action-secondary-border text-action-secondary-foreground hover:bg-action-secondary-surface-hover hover:border-action-secondary-border-hover hover:text-action-secondary-foreground-hover active:bg-action-secondary-surface-pressed active:border-action-secondary-border-pressed active:text-action-secondary-foreground-pressed`,
  popover: `inline-flex items-center gap-1 text-[14px] font-semibold text-action-accent-foreground hover:text-action-accent-foreground-hover active:text-action-accent-foreground-pressed ${FOCUS_CLASS}`,
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
