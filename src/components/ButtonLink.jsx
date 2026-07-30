import { Link } from 'react-router-dom'

const VARIANTS = ['primary', 'secondary', 'tertiary', 'menu', 'popover']

// text-body font-bold (18px/700) is confirmed from Figma for the primary variant's
// label. Applied uniformly across variants for now -- no direct sample yet for
// tertiary/popover/menu label size specifically.
const TYPE_CLASS = 'text-body font-bold'

export default function ButtonLink({ variant = 'primary', to, href, children, ...props }) {
  if (!VARIANTS.includes(variant)) {
    throw new Error(`ButtonLink: unknown variant "${variant}"`)
  }

  const dataAttrs = { 'data-variant': variant }

  if (to) {
    return (
      <Link to={to} className={TYPE_CLASS} {...dataAttrs} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={TYPE_CLASS} {...dataAttrs} {...props}>
      {children}
    </a>
  )
}
