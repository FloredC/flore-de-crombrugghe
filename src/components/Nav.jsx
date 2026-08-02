import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ButtonLink from './ButtonLink'
import { ArrowBackIcon, MenuIcon, CloseIcon } from './icons'
import homeIcon from '../assets/icons/ic-home.svg'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
]

// Breakpoint where the desktop navbar becomes the mobile one. Not sampled
// from Figma -- the frames are 402px and 1622px with nothing in between, so
// this is my suggested 768px (Tailwind's `md`), flagged to Flore. Applied as
// CSS classes rather than a JS width check so there's no flash of the wrong
// navbar on first paint.

// Shared pill chrome, sampled from Figma's navbar variants: white bg, 1px
// bottom border in navbar/border, radius-60, drop-shadow 0/0/5 black 25%.
const PILL_CLASS =
  'items-center justify-between gap-6 rounded-radius-60 border-b border-border-grey bg-surface-background shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)]'

// 58px circular home avatar, ringed with the secondary/Contact button's
// border color+weight so it reads as the same treatment, not just "a border".
function HomeAvatar({ href, label }) {
  return (
    <a href={href} aria-label={label}>
      <img
        src={homeIcon}
        alt=""
        width={58}
        height={58}
        className="rounded-full border border-action-secondary-border"
      />
    </a>
  )
}

// Subpage navbar. Per Flore this is the same at every width -- "no hamburger
// menu, no access to the anchors, since it's on a different page" -- so there
// is deliberately no open/closed state here to get wrong. It's a dead end by
// design: back out, or get in touch. (Her Figma now models this as
// `variant=Subpage, state=all states`.)
//
// Contact is a real cross-document link (`/#contact`), not a bare `#contact`
// anchor, since the Contact section lives on the homepage and we aren't on it.
// Padding differs slightly between the two Figma subpage samples (desktop
// px-12/py-8, mobile pl-24/pr-4) -- carried over faithfully rather than
// unified, since the bare text link needs more breathing room from the pill
// edge than the Contact button does.
function SubpageNav() {
  return (
    <nav
      data-component="nav"
      data-variant="subpage"
      className={`${PILL_CLASS} flex py-space-8 pl-space-24 pr-space-4 md:px-space-12`}
    >
      <Link to="/" className="flex items-center gap-space-4 py-space-8 text-body font-bold text-text-primary">
        <ArrowBackIcon aria-hidden="true" />
        Back to Portfolio
      </Link>
      <ButtonLink variant="secondary" href="/#contact">
        Contact
      </ButtonLink>
    </nav>
  )
}

// Desktop homepage navbar: home avatar + section anchors + Contact button.
function DesktopHomeNav() {
  return (
    <nav data-component="nav" data-variant="homepage-desktop" className={`${PILL_CLASS} hidden p-2 md:flex`}>
      <HomeAvatar href="#hero" label="Back to the map" />
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
  )
}

// Mobile homepage navbar. Closed: home avatar + hamburger inside the
// radius-60 pill. Open: the pill squares off to radius-32 and grows a stacked
// menu (16px bold rows at px-12/py-14, 1px dividers between them) with the
// hamburger swapped for a close icon -- sampled from Figma's
// `variant=Homepage, state=closed` / `state=open`.
//
// Contact appears as a plain menu row here, not a button, matching Figma. The
// toggle is a real <button> (an action, no navigation) while every menu row
// is an <a>, per the tag-follows-behavior rule in CLAUDE.md.
function MobileHomeNav() {
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  const menuLinks = [...LINKS, { label: 'Contact', href: '#contact' }]

  return (
    <nav
      ref={navRef}
      data-component="nav"
      data-variant="homepage-mobile"
      data-open={open}
      className={`${PILL_CLASS} flex w-full max-w-[367px] flex-col !items-stretch p-space-4 md:hidden ${
        open ? 'gap-space-12 !rounded-radius-32 pb-space-16' : ''
      }`}
    >
      <div className="flex h-[58px] items-center justify-between gap-6">
        <HomeAvatar href="#hero" label="Back to the map" />
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
          className="flex items-center rounded-radius-32 p-space-8 text-text-primary"
        >
          {open ? <CloseIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <ul className="flex flex-col px-space-8" style={{ listStyle: 'none' }}>
          {menuLinks.map((link, index) => (
            <li key={link.href} className="w-full">
              {index > 0 && <div className="h-px w-full bg-border-divider" />}
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex w-full items-center px-space-12 py-space-14 text-[16px] font-bold text-text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

// Visibility: on the homepage the nav stays hidden until the Hero (#hero) has
// scrolled out of view, using an IntersectionObserver on the actual Hero
// element rather than a guessed scroll threshold -- so it adapts to however
// tall Hero renders at a given viewport. On subpages there's no #hero, so the
// nav is simply always visible.
export default function Nav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [visible, setVisible] = useState(!isHome)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) {
      setVisible(true)
      return undefined
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
      {isHome ? (
        <>
          <DesktopHomeNav />
          <MobileHomeNav />
        </>
      ) : (
        <SubpageNav />
      )}
    </div>
  )
}
