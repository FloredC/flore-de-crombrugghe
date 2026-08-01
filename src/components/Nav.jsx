import { Link } from 'react-router-dom'
import ButtonLink from './ButtonLink'
import homeIcon from '../assets/icons/ic-home.svg'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
]

// Sampled directly from Figma's "NavbarDesktop, placement=Homepage": pill
// shape (radius-60), white bg, border-b navbar-border, drop-shadow 0/0/5/0
// black 25% (same shadow as the popover), 58x58 circular avatar/home link
// (ic-home.svg -- the circular map crop Flore exported, resolving what that
// asset was for), 40px gap between nav links, 16px bold link text ("Mobile/
// body-bold" per Figma even on this desktop variant), Contact rendered as
// the existing secondary button chrome, not a plain link.
// Sticky/docking behavior: position:sticky is sufficient here since Nav now
// renders after Hero in the page -- it sits inline below the map at rest and
// docks to the top once scrolled past, matching CLAUDE.md's "Minimal below
// hero; docks to top on scroll" with no scroll-listener needed.
export default function Nav() {
  return (
    <div className="sticky top-0 z-30 flex justify-center px-6 py-4">
      <nav
        data-component="nav"
        className="flex items-center gap-6 rounded-radius-60 border-b border-border-grey bg-surface-background p-2 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)]"
      >
        <Link to="/" aria-label="Home">
          <img src={homeIcon} alt="" width={58} height={58} className="rounded-full" />
        </Link>
        <ul className="flex items-center gap-10" style={{ listStyle: 'none' }}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-[16px] font-bold text-text-primary">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <ButtonLink variant="secondary" href="#contact">
              Contact
            </ButtonLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}
