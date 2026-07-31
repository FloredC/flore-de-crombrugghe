import { Link } from 'react-router-dom'

const VARIANTS = ['primary', 'secondary', 'tertiary', 'menu', 'popover']

// text-body font-bold (18px/700) is confirmed from Figma for the primary variant's
// label. Applied uniformly across variants for now -- no direct sample yet for
// tertiary/menu label size specifically.
const TYPE_CLASS = 'text-body font-bold'

// Per Figma semantic tokens: popover CTA uses the accent-orange action color.
// Other variants don't have a confirmed color sample yet, so left to inherit.
const VARIANT_COLOR_CLASS = {
  popover: 'text-action-accent-foreground',
}

export default function ButtonLink({ variant = 'primary', to, href, children, className: extraClassName, ...props }) {
  if (!VARIANTS.includes(variant)) {
    throw new Error(`ButtonLink: unknown variant "${variant}"`)
  }

  const dataAttrs = { 'data-variant': variant }
  const className = `${TYPE_CLASS} ${VARIANT_COLOR_CLASS[variant] || ''} ${extraClassName || ''}`.trim()

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
