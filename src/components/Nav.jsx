import ButtonLink from './ButtonLink'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  return (
    <nav data-component="nav">
      <ButtonLink variant="tertiary" to="/">
        Flore de Crombrugghe
      </ButtonLink>
      <ul style={{ display: 'flex', gap: 16, listStyle: 'none' }}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
