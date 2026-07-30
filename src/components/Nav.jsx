import ButtonLink from './ButtonLink'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  return (
    <nav data-component="nav" className="flex items-center justify-between px-6 py-6">
      <ButtonLink variant="tertiary" to="/">
        Flore de Crombrugghe
      </ButtonLink>
      <ul className="flex gap-6 text-body-sm font-normal" style={{ listStyle: 'none' }}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
