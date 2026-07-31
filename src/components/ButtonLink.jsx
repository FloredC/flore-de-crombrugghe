import { Link } from 'react-router-dom'

const VARIANTS = ['primary', 'secondary', 'tertiary', 'menu', 'popover']

// text-body font-bold (18px/700) is confirmed from Figma for the primary variant's
// label. Applied uniformly across variants for now -- no direct sample yet for
// menu label size specifically. Popover overrides to the sampled 14px/SemiBold.
const TYPE_CLASS = 'text-body font-bold'

// Per Figma component samples: the popover/accent CTA text color doesn't
// actually change between default/hover/pressed (all #fd6d2b) -- the real
// interactive feedback is a background wash using the accent surface-hover/
// pressed tokens, applied as padding + rounded-full below.
// "tertiary" maps to the action-link token family (dark, safe as plain text
// with no background dependency).
const VARIANT_CLASS = {
  popover:
    'text-[14px] font-semibold rounded-full px-2 py-1 -mx-2 -my-1 text-action-accent-foreground hover:bg-action-accent-surface-hover active:bg-action-accent-surface-pressed',
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
