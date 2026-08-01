import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
// with a ring matching the secondary/Contact button's border color+weight
// (was a lighter border-grey before -- corrected to border-action-secondary-
// border so it's visually the same treatment, not just "a border"), 40px gap
// between nav links, 16px bold link text, Contact rendered as the secondary
// button chrome.
//
// Visibility: hidden until the Hero (#hero) has scrolled out of view, using
// an IntersectionObserver on the actual Hero element rather than a guessed
// scroll-position threshold -- adapts automatically to however tall Hero
// actually renders (which varies by viewport, see Hero's own 100vh sizing).
// On subpages (no #hero present, e.g. ProjectPage) the nav is just always
// visible.
export default function Nav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [visible, setVisible] = useState(!isHome)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`sticky top-0 z-30 flex justify-center px-6 py-4 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <nav
        data-component="nav"
        className="flex items-center gap-6 rounded-radius-60 border-b border-border-grey bg-surface-background p-2 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)]"
      >
        {isHome ? (
          <a href="#hero" aria-label="Back to the map">
            <img
              src={homeIcon}
              alt=""
              width={58}
              height={58}
              className="rounded-full border border-action-secondary-border"
            />
          </a>
        ) : (
          <Link to="/" aria-label="Back to the homepage">
            <img
              src={homeIcon}
              alt=""
              width={58}
              height={58}
              className="rounded-full border border-action-secondary-border"
            />
          </Link>
        )}
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
