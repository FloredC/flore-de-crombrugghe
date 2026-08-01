import { Link } from 'react-router-dom'

const VARIANTS = ['primary', 'secondary', 'tertiary', 'menu', 'popover']

// text-body font-bold (18px/700) is confirmed from Figma for the primary variant's
// label. Applied uniformly across variants for now -- no direct sample yet for
// menu label size specifically. Popover overrides to the sampled 14px/SemiBold.
const TYPE_CLASS = 'text-body font-bold'

// Shared pill shape/padding, sampled directly from the Figma "ButtonLink"
// primary variant: px-24/py-16 (Tailwind's default px-6/py-4 happen to equal
// those exact px values, not a coincidence to rely on if the default scale
// ever changes), rounded-32. Secondary reuses the same shape -- no direct
// Figma sample for it specifically, but it's the same button family, just an
// outline treatment instead of a filled one.
const CHROME_CLASS =
  'inline-flex items-center gap-1 rounded-radius-32 border px-6 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2'

// Per Flore: hover/pressed is a text-color-only change (matching the copy
// icon treatment), not a background wash -- corrected after the initial
// background-wash guess (based on identical hover/pressed samples in the
// Figma component) turned out to not match actual intent.
// "tertiary" maps to the action-link token family (dark, safe as plain text
// with no background dependency).
const VARIANT_CLASS = {
  primary: `${CHROME_CLASS} bg-action-primary-surface border-action-primary-border text-action-primary-foreground hover:bg-action-primary-surface-hover hover:border-action-primary-border-hover hover:text-action-primary-foreground-hover active:bg-action-primary-surface-pressed active:border-action-primary-border-pressed active:text-action-primary-foreground-pressed`,
  // No confirmed "surface-default" token for secondary -- components.css only
  // defines surface-hover/pressed, implying an outline style: no fill at
  // rest, a light grey fill appears on hover/press.
  secondary: `${CHROME_CLASS} bg-transparent border-action-secondary-border text-action-secondary-foreground hover:bg-action-secondary-surface-hover hover:border-action-secondary-border-hover hover:text-action-secondary-foreground-hover active:bg-action-secondary-surface-pressed active:border-action-secondary-border-pressed active:text-action-secondary-foreground-pressed`,
  popover:
    'text-[14px] font-semibold text-action-accent-foreground hover:text-action-accent-foreground-hover active:text-action-accent-foreground-pressed',
  tertiary:
    'text-action-link-foreground hover:text-action-link-foreground-hover active:text-action-link-foreground-pressed',
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
