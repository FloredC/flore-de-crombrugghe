import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ButtonLink, { FOCUS_CLASS, LINK_CLASS, LINK_UNDERLINE_CLASS } from './ButtonLink'
import { ArrowBackIcon, ArrowUpIcon, MenuIcon, CloseIcon } from './icons'
import homeIcon from '../assets/icons/ic-home.svg'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
]

const MENU_LINKS = [...LINKS, { label: 'Contact', href: '#contact' }]

// Which section the reader is currently in, so its nav link can carry the
// selected state. Figma's NavbarDesktop placement=Homepage ships this in its
// default state -- "Work" is underlined there while Approach and About aren't
// -- which I'd missed, rendering all three links identically.
//
// A section counts as current while it crosses a thin band near the top of
// the viewport (via rootMargin), rather than on raw scroll offsets, so it
// doesn't need re-tuning per breakpoint as sections change height. Falls back
// to the last section scrolled past so something is always selected once the
// nav is visible.
function useCurrentSection() {
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    const sections = MENU_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(Boolean)
    if (!sections.length) return undefined

    const visible = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        // Keep document order rather than intersection-callback order, so two
        // sections in the band at once resolve to the higher one.
        const inOrder = sections.filter((section) => visible.has(section.id))
        if (inOrder.length) setCurrent(inOrder[0].id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return current
}

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
//
// States from Figma's ButtonAction variant=home row: the ring dims grey-90 ->
// grey-80 (hover) -> grey-70 (pressed), and focus draws the blue focus ring.
// It had no states at all before -- a static border. The ring lives in CSS
// rather than the asset (ic-home.svg is a stroke-less circle filled with the
// map image), which is what makes it animatable at all.
//
// The up arrow sits centred on top of the map thumbnail (node 4449:12869, and
// present unchanged in all four states) -- testers read the bare thumbnail as
// decoration rather than as a way back up to the map. It's a separate overlay
// rather than baked into ic-home.svg so the arrow can't be re-exported away
// with the thumbnail, and it's pointer-events-none so the whole 58px circle
// stays one hit target instead of the arrow eating the middle of it.
function HomeAvatar({ href, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`group relative block shrink-0 rounded-full ${FOCUS_CLASS}`}
    >
      <img
        src={homeIcon}
        alt=""
        width={58}
        height={58}
        className="rounded-full border border-action-secondary-border transition-colors group-hover:border-action-secondary-border-hover group-active:border-action-secondary-border-pressed"
      />
      <ArrowUpIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
// `onBackClick` lets a page intercept the back link. It stays a real <Link>
// with a real `to`, so middle-click, cmd-click and "open in new tab" all still
// work and the destination is visible in the status bar -- the handler only
// changes what a plain left-click does. See ProcessLogPage on why.
function SubpageNav({ backTo, backLabel = 'Back to Portfolio', onBackClick }) {
  return (
    <nav
      data-component="nav"
      data-variant="subpage"
      className={`${PILL_CLASS} flex py-space-8 pl-space-24 pr-space-4 md:px-space-12`}
    >
      <Link
        to={backTo}
        onClick={onBackClick}
        className={`flex items-center gap-space-4 py-space-8 text-body font-bold ${LINK_CLASS}`}
      >
        <ArrowBackIcon aria-hidden="true" />
        {backLabel}
      </Link>
      <ButtonLink variant="secondary" href="/#contact">
        Contact
      </ButtonLink>
    </nav>
  )
}

// Desktop homepage navbar: home avatar + section anchors + Contact button.
function DesktopHomeNav({ currentSection }) {
  return (
    <nav data-component="nav" data-variant="homepage-desktop" className={`${PILL_CLASS} hidden p-2 md:flex`}>
      <HomeAvatar href="#hero" label="Back to the map" />
      <ul className="flex items-center gap-10" style={{ listStyle: 'none' }}>
        {LINKS.map((link) => {
          const isCurrent = currentSection === link.href.slice(1)
          return (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={isCurrent ? 'true' : undefined}
                data-current={isCurrent || undefined}
                className={`text-body-sm ${LINK_CLASS} ${isCurrent ? LINK_UNDERLINE_CLASS : ''}`}
              >
                {link.label}
              </a>
            </li>
          )
        })}
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
function MobileHomeNav({ currentSection }) {
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
          className={`flex items-center rounded-radius-32 p-space-8 text-action-secondary-foreground transition-colors hover:text-action-secondary-foreground-hover active:text-action-secondary-foreground-pressed ${FOCUS_CLASS}`}
        >
          {open ? <CloseIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <ul className="flex flex-col px-space-8" style={{ listStyle: 'none' }}>
          {MENU_LINKS.map((link, index) => {
            const isCurrent = currentSection === link.href.slice(1)
            return (
            <li key={link.href} className="w-full">
              {index > 0 && <div className="h-px w-full bg-border-divider" />}
              {/* Same ButtonLink component as the desktop nav links and
                  Footer's Download CV (per Flore) -- same LINK_CLASS, same
                  states: color on hover/pressed, no underline. The
                  persistent underline is reserved for the current section. */}
              <a
                href={link.href}
                aria-current={isCurrent ? 'true' : undefined}
                data-current={isCurrent || undefined}
                onClick={() => setOpen(false)}
                className={`flex w-full items-center px-space-12 py-space-14 text-body-sm ${LINK_CLASS} ${
                  isCurrent ? LINK_UNDERLINE_CLASS : ''
                }`}
              >
                {link.label}
              </a>
            </li>
            )
          })}
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
// `backTo`/`backLabel` let a page override where the subpage nav points. Only
// the process-log pages do -- they sit one level below a case study, so "Back
// to Portfolio" would skip the page the reader came from.
export default function Nav({ backTo: backToOverride, backLabel, onBackClick }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  // Going back from a case study returns the reader to the card they left
  // from, not to the top of the map. Every subpage slug has a matching
  // `#project-<slug>` card in the Work grid (only non-NDA projects get a
  // route, and all of those have a card), so the anchor always resolves.
  const projectSlug = pathname.startsWith('/work/') ? pathname.slice('/work/'.length) : ''
  // A slug like "artifakt/process/prompting-process" would make a nonsense
  // anchor, so only the bare slug is used -- and an override wins outright.
  const backTo = backToOverride ?? (projectSlug ? `/#project-${projectSlug.split('/')[0]}` : '/')
  const [visible, setVisible] = useState(!isHome)
  const currentSection = useCurrentSection()

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
      // `fixed`, not `sticky`: a sticky wrapper stays in normal flow, so while
      // the nav is hidden over the hero it still reserved its full 110px of
      // layout -- an invisible band of dead space between the map and Work,
      // and the single biggest contributor to that gap. Fixed takes it out of
      // flow entirely; the pill already overlays content once stuck, so this
      // changes nothing about how it looks or behaves when visible.
      className={`fixed inset-x-0 top-0 z-30 flex justify-center px-6 py-4 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {isHome ? (
        <>
          <DesktopHomeNav currentSection={currentSection} />
          <MobileHomeNav currentSection={currentSection} />
        </>
      ) : (
        <SubpageNav backTo={backTo} backLabel={backLabel} onBackClick={onBackClick} />
      )}
    </div>
  )
}
