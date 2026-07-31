import { Link } from 'react-router-dom'

const VARIANTS = ['primary', 'secondary', 'tertiary', 'menu', 'popover']

// text-body font-bold (18px/700) is confirmed from Figma for the primary variant's
// label. Applied uniformly across variants for now -- no direct sample yet for
// menu label size specifically. Popover overrides to the sampled 14px/SemiBold.
const TYPE_CLASS = 'text-body font-bold'

// Per Flore: hover/pressed is a text-color-only change (matching the copy
// icon treatment), not a background wash -- corrected after the initial
// background-wash guess (based on identical hover/pressed samples in the
// Figma component) turned out to not match actual intent.
// "tertiary" maps to the action-link token family (dark, safe as plain text
// with no background dependency).
const VARIANT_CLASS = {
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
