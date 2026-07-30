import { Link } from 'react-router-dom'

const VARIANTS = ['primary', 'secondary', 'tertiary', 'menu', 'popover']

export default function ButtonLink({ variant = 'primary', to, href, children, ...props }) {
  if (!VARIANTS.includes(variant)) {
    throw new Error(`ButtonLink: unknown variant "${variant}"`)
  }

  const dataAttrs = { 'data-variant': variant }

  if (to) {
    return (
      <Link to={to} {...dataAttrs} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} {...dataAttrs} {...props}>
      {children}
    </a>
  )
}
