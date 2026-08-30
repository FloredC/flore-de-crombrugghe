import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { handleAnchorClick } from '../lib/anchorScroll'
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
  'min-h-[70px] items-center justify-between gap-6 rounded-radius-60 border-b border-border-grey bg-surface-background shadow-[0px_0px_5px_0px_rgba(0,0,0,0.25)]'

// WHY THE HEIGHT IS DECLARED RATHER THAN LEFT TO THE CONTENTS -- Flore,
// 2026-08-30: "Navbars should have the same size across pages."
//
// Without it they only agree by luck, and they didn't. The homepage pill is
// sized by the 53px home avatar, which is a fixed pixel size, so it drew 70 at
// every width. The subpage pill has no avatar -- its tallest child is the
// Contact button, whose height rides the fluid `body` token -- so it measured
// 67 on a phone, 68 at `md` and 70 only at the Figma frame. Same padding, same
// components, three different heights, and nothing in the code said otherwise.
//
// 70 is not derived here, it is the component height Figma draws on all four
// closed variants (4449:12901 homepage desktop, 4449:12978 homepage mobile,
// 4449:12972 / 4449:13002 subpage). Stating it once is what makes "the same
// size across pages" a property of the code rather than a coincidence between
// two content stacks.
//
// A MINIMUM, not a fixed height: the mobile pill's open state grows a menu
// below the bar and must stay free to. This sets the floor the closed states
// all sit on.

// 53px circular home avatar, ringed with the secondary/Contact button's
// border color+weight so it reads as the same treatment, not just "a border".
//
// 53, NOT 58, since 2026-08-30 (node 4449:12869). Flore: "the back to top
// button in the nav [is] now too big compared to the other cta". It was sized
// when the Contact button was 58-61px tall; the button came down and the avatar
// did not, so the pill's two ends stopped agreeing. 53 is now exactly the
// ButtonLink's own height at the Figma frame, which is what makes the pill read
// as balanced rather than as an avatar with a button next to it.
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
      // "Back to the map" is an in-page jump like any other, so it scrolls
      // rather than relying on a fragment navigation that does nothing once
      // the URL already says `#hero`.
      onClick={(event) => handleAnchorClick(event, href)}
      className={`group relative block shrink-0 rounded-full ${FOCUS_CLASS}`}
    >
      <img
        src={homeIcon}
        alt=""
        width={53}
        height={53}
        className="rounded-full border border-action-secondary-border transition-colors group-hover:border-action-secondary-border-hover group-active:border-action-secondary-border-pressed"
      />
      {/* SIZE STATED, not inherited from the asset -- part of consolidating
          Flore's 2026-08-30 re-export. `ic-arrow-up` used to be a one-off
          20.34-tall stroke drawing that was never in the design system; it is
          now a proper 20x20 filled icon matching `ic-arrow-down`, so it renders
          at the same size as every other icon on the site and follows its
          container's colour like them.
          
          The visible arrow IS smaller than before -- the old glyph inked ~88%
          of its box and the new one 60% -- which is the "renders a bit smaller"
          Flore noticed. Left at the system's 20 rather than scaled up to match
          the old drawing: this is now one icon at one size everywhere, which is
          what consolidating it means. Flagged as a number to raise if the arrow
          reads too quiet on the 53px thumbnail. */}
      <ArrowUpIcon
        aria-hidden="true"
        width={20}
        height={20}
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
//
// PADDING IS NOW ONE SET OF VALUES AT EVERY WIDTH (nodes 4449:12972 desktop and
// 4449:13002 mobile, resampled 2026-08-30): pl-12 / pr-8 / py-8. This used to
// carry a responsive split -- `pl-24 pr-4` below `md`, `px-12` above -- read off
// two Figma samples that disagreed at the time. They no longer do, so the
// breakpoint went with them: an override that says the same thing on both sides
// is just a second place to edit.
//
// The asymmetry that remains is real and survives: the bare text link needs
// more room from the pill edge (12) than the chromed Contact button does (8),
// because the button's own border already draws that gap for it.
// `onBackClick` lets a page intercept the back link. It stays a real <Link>
// with a real `to`, so middle-click, cmd-click and "open in new tab" all still
// work and the destination is visible in the status bar -- the handler only
// changes what a plain left-click does. See ProcessLogPage on why.
// THE LABEL IS "Work", not "Back to Portfolio" -- Flore's Figma change,
// 2026-08-30, on both subpage variants (nodes 4449:12972 desktop and
// 4449:13002 mobile, which draw "← Work" identically).
//
// The arrow is what says "back", so the words only have to name the
// destination. That also makes the label the same word the homepage navbar
// uses for the same place, which is the more useful consistency: a reader who
// followed "Work" into a project is offered "Work" to get back out.
//
// It stays a PROP with a default rather than a hardcoded string, because the
// process-log pages legitimately point somewhere else -- see the `backTo`
// note further down.
// `contactHref` -- where the Contact button goes. Defaults to the homepage's
// section, and every case-study subpage overrides it with its own (see
// ProjectPage). Flore, 2026-08-30: "the contact button on the subpages should
// lead to the contact section at the bottom of these specific subpages (not the
// home page)."
//
// A PROP WITH A DEFAULT rather than a hardcoded in-page anchor, because not
// every page that renders this nav has a contact section: the process-log pages
// are a rendered document with no exit block of their own, and pointing them at
// a `#case-study-outro` that isn't in the DOM would be a button that scrolls to
// the top of the page and calls it done. They keep the homepage target.
function SubpageNav({ backTo, backLabel = 'Work', contactHref = '/#contact', onBackClick }) {
  return (
    <nav
      data-component="nav"
      data-variant="subpage"
      // WIDTH IS DECLARED, not left to the contents -- Flore, 2026-08-30: "the
      // subpage nav is not wide enough now... so that the navbar gets a bit
      // bigger again."
      //
      // Shortening the label to "Work" took 79px out of a pill that was already
      // only as wide as what was in it, so the two controls collapsed toward
      // each other and the bar stopped reading as a bar. Figma answers this by
      // giving the component a FIXED width and letting `justify-between` spread
      // the two children across it -- 300 at desktop (node 4449:12972) and 367
      // on mobile (node 4449:13002).
      //
      // That is why there is no gap value here to copy: the space between the
      // back link and Contact is 94px at desktop and 161px on mobile, neither of
      // which is a spacing token, because neither is a spacing decision. They
      // are both just "whatever is left". Setting the width is the honest
      // translation; a hardcoded 94px gap would be a derived number that stops
      // being right the moment a label changes.
      //
      // `min-w` rather than `w` for the same reason the pill's height is a
      // `min-h`: it reproduces Figma exactly while the content is smaller, and
      // grows instead of overflowing if a label is ever longer -- which the
      // process-log pages already exercise with "Back to Artifakt".
      //
      // 367 on mobile is also the mobile HOMEPAGE nav's width, so the two match
      // there as Flore asked. `w-full` under the cap because a phone narrower
      // than 367 has to win.
      className={`${PILL_CLASS} flex w-full max-w-[367px] py-space-8 pl-space-12 pr-space-8 md:w-auto md:min-w-[300px] md:max-w-none`}
    >
      <Link
        to={backTo}
        onClick={onBackClick}
        className={`flex items-center gap-space-4 py-space-8 text-body font-bold ${LINK_CLASS}`}
      >
        <ArrowBackIcon aria-hidden="true" />
        {backLabel}
      </Link>
      <ButtonLink variant="secondary" href={contactHref}>
        Contact
      </ButtonLink>
    </nav>
  )
}

// Desktop homepage navbar: home avatar + section anchors + Contact button.
function DesktopHomeNav({ currentSection }) {
  return (
    // `p-space-8` (node 4449:12901). This went 8 -> 4 -> 8 across two passes and
    // the round trip is worth recording rather than looking like a mistake: 4
    // was right while the Contact button was still being resized, and once it
    // settled at 53 Flore put the inset back. 53 + 8 + 8 + the 1px bottom border
    // is the 70px pill the component now draws.
    <nav data-component="nav" data-variant="homepage-desktop" className={`${PILL_CLASS} hidden p-space-8 md:flex`}>
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
                onClick={(event) => handleAnchorClick(event, link.href)}
                // `inline-block py-space-8` -- Figma's own ButtonLink
                // variant=menu is 40x40 (px-0, py-8 around a 24px line), and
                // these were rendering as bare 24px-tall inline text. The pill
                // is unchanged either way, since `items-center` sizes it off
                // the taller Contact button; what grows is the click target.
                // `inline-block` because vertical padding on an inline element
                // paints outside its line box without contributing height --
                // it would have overflowed the row instead of filling it.
                className={`inline-block py-space-8 text-body-sm ${LINK_CLASS} ${
                  isCurrent ? LINK_UNDERLINE_CLASS : ''
                }`}
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
      // `p-space-8`, matching the desktop pill and both Figma mobile states --
      // closed is 367x70 (node 4449:12978) and open is 367x364 (node 4516:3617),
      // and both take the same 8px inset. The open state's own overrides below
      // (gap-12, pb-16, radius-32) are unchanged; only the base inset moved.
      className={`${PILL_CLASS} flex w-full max-w-[367px] flex-col !items-stretch p-space-8 md:hidden ${
        open ? 'gap-space-12 !rounded-radius-32 pb-space-16' : ''
      }`}
    >
      {/* 53 to match the avatar, down from 58 -- the mobile closed pill is
          367x62 in Figma (node 4449:12978), which is 53 + the 4px inset either
          side + the 1px bottom border. */}
      <div className="flex h-[53px] items-center justify-between gap-6">
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
                onClick={(event) => {
                  setOpen(false)
                  handleAnchorClick(event, link.href)
                }}
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
export default function Nav({ backTo: backToOverride, backLabel, contactHref, onBackClick }) {
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
        <SubpageNav
          backTo={backTo}
          backLabel={backLabel}
          contactHref={contactHref}
          onBackClick={onBackClick}
        />
      )}
    </div>
  )
}
