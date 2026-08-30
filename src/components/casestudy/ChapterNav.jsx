import { useEffect, useRef, useState } from 'react'
import { FOCUS_CLASS } from '../ButtonLink'
import { ArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from '../icons'
import { handleAnchorClick, scrollToTop } from '../../lib/anchorScroll'

/**
 * The floating chapter navigator — presentation only.
 *
 * Figma: the `Chapter Nav` component set (node 5052:7430), three variants --
 * `breakpoint=desktop`, `breakpoint=mobile closed`, `breakpoint=mobile open` --
 * plus the `chapter item` component (5052:7696) with its reg / hover / select
 * states. All three states are built here; `select` and `hover` differ only by
 * the 16x2 rule under the label, which is why the two are not the same class.
 *
 * Every "where is the reader" decision lives in `useChapterProgress`. This file
 * receives `activeId` and `visible` and draws them, so the responsive
 * presentation and the scroll logic can be changed independently.
 *
 * SECONDARY TO THE GLOBAL NAV, BY CONSTRUCTION rather than by intention:
 * `z-20` against the global nav's `z-30`, 16px labels against the pill's 18px
 * bold, and no shadow where the global pill has one. It is the louder of the
 * two surfaces since the inversion, but not the more important control.
 */

// ONE SHARED CAPSULE, not five pills.
//
// INVERTED 2026-08-30 -- Flore: "I edited the chapter nav again and made it
// inverted so that it's more visible." The control was a white pill on a white
// page and read as part of the page; a dark one reads as a control laid over it.
//
// AND THE BORDER WENT WITH IT, over two passes: first the two pills, then the
// expanded menu (which had briefly kept a rim in a raw #a8a8a8 -- the one value
// in this component with no token behind it). All three are borderless now. It
// was doing a job on white -- separating the pill from the page -- that black
// does on its own.
const CAPSULE_CLASS = 'bg-surface-inverted backdrop-blur-[2px]'

// The focus ring's 2px offset paints in `ring-offset-color`, which Tailwind
// defaults to WHITE -- on a black pill that draws a white halo round every
// focused chapter, which reads as a border rather than as focus. Pointing it at
// the capsule's own fill makes the gap disappear into the pill and leaves only
// the blue ring, which is what the offset is for.
const FOCUS_ON_DARK = `${FOCUS_CLASS} focus-visible:ring-offset-surface-inverted`

// PADDING IS PER-VARIANT, and has been since the inversion. The three used to
// share one value; the desktop row now has its own, because it gained a button
// on the right that needs less room from the edge than a text label does.
//
// All three stay ASYMMETRIC top-to-bottom for the same reason they always were:
// the active item's rule hangs below its label, so an even inset would leave
// the row sitting high in its own capsule.
const PAD_WIDE = 'pl-space-24 pr-space-12 pt-space-10 pb-space-8'
const PAD_TRIGGER = 'px-space-40 pt-space-14 pb-space-12'

// BOTH MOBILE VARIANTS ARE A FIXED 250 (nodes 5052:7428 and 5052:7429) -- Flore,
// 2026-08-30: "the chapter menu on mobile is too narrow now; make it larger as
// represented in Figma."
//
// This replaces `w-full` on the menu, which was the previous request ("make the
// size of the menu the same as the chapter bar") solved the wrong way. Tying the
// menu to the trigger did make them equal, but it also made them equal to the
// ACTIVE CHAPTER'S LABEL: with "Making it work" selected the trigger is wide and
// the menu looked right, and with "Overview" selected it collapsed to ~150 and
// wrapped "Back to top" onto two lines. A width that depends on which chapter
// you are reading is not a width.
//
// 250 is the answer to both requests at once: the two are the same size because
// they are the same number, and neither moves as the reader scrolls.
//
// Capped against the viewport for phones narrower than 250 + the wrapper's own
// gutters -- rare, but the failure would be a control hanging off the screen.
const MOBILE_WIDTH = 'w-[250px] max-w-[calc(100vw-32px)]'
// The expanded menu takes no vertical padding of its own -- its rows carry
// theirs to reach a 44px tap target, and stacking the two would double the
// inset above the first row.
const PAD_MENU = 'px-space-40'

// The active state's rule: 16x2, 4px under the label (node 5052:7655). A real
// element rather than `text-decoration`, because it is a fixed 16px centred
// under the label and not the width of the text -- an underline utility cannot
// draw that. It is also why LINK_UNDERLINE_CLASS (the global nav's
// current-section marker) is deliberately not reused: same idea, different mark.
//
// WHITE on all three variants, and the file now agrees. It briefly did not: the
// collapsed trigger still bound `Colors/Text/text-primary` after the inversion
// pass, i.e. a black rule on a black pill. This rendered white through that
// window and Flore inverted the layer on 2026-08-30, so the divergence is
// closed rather than standing.
const ACTIVE_RULE_CLASS = 'h-[2px] w-[16px] bg-text-inverted'

/**
 * One chapter label.
 *
 * THE INVISIBLE SEMIBOLD COPY is the load-bearing part. Figma's hover and
 * select states both step the label from Regular to SemiBold, which is wider --
 * so in a horizontal row every weight change would shove its neighbours
 * sideways. On hover that is a jitter; on the scrollspy it is worse, because
 * the capsule would visibly reflow while the reader is scrolling and not
 * touching it at all.
 *
 * So each label reserves its own SemiBold width up front and the visible text
 * is laid over it in the same grid cell. The result is a capsule whose geometry
 * never changes, at the cost of one `aria-hidden` duplicate per label.
 */
function ChapterLabel({ label, active }) {
  return (
    <span className="grid text-body-sm">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap font-semibold">
        {label}
      </span>
      <span
        className={`col-start-1 row-start-1 whitespace-nowrap transition-colors motion-reduce:transition-none ${
          active
            ? 'font-semibold text-text-inverted'
            : 'font-normal text-text-inverted-tertiary group-hover:font-semibold group-hover:text-text-inverted'
        }`}
      >
        {label}
      </span>
    </span>
  )
}

/**
 * A chapter as a link.
 *
 * A real `<a href="#id">`, per the tag-follows-behavior rule: this navigates
 * within the document, so it must be middle-clickable, cmd-clickable, and show
 * its destination in the status bar. Plain left-click is intercepted only to
 * choose the scroll behaviour and to avoid pushing a history entry per chapter
 * -- a reader who used the nav four times should not have to press Back four
 * times to leave the page. The `href` still resolves on its own for every other
 * kind of click, and `App.jsx`'s ScrollToHash handles it on a cold load.
 */
function ChapterLink({ chapter, active, onClose, className = '' }) {
  return (
    <a
      href={`#${chapter.id}`}
      aria-current={active ? 'true' : undefined}
      data-current={active || undefined}
      // The SAME handler every other anchor on the site uses -- it scrolls
      // smoothly, honours `scroll-margin-top`, respects reduced motion, leaves
      // modified clicks to the browser, and updates the URL with `replaceState`
      // so four chapter jumps don't become four presses of Back.
      //
      // This used to be a bespoke copy of that logic. Consolidating it is not
      // just tidying: the copy did not update the hash at all, so a chapter was
      // the one destination on the site whose URL a reader could not share.
      //
      // `onClose` runs first and unconditionally, so the mobile menu closes
      // even on a cmd-click that the scroll itself declines to handle.
      onClick={(event) => {
        onClose?.()
        handleAnchorClick(event, `#${chapter.id}`)
      }}
      className={`group flex flex-col items-center gap-space-4 rounded-radius-4 ${FOCUS_ON_DARK} ${className}`}
    >
      <ChapterLabel label={chapter.label} active={active} />
      {active && <span aria-hidden="true" className={ACTIVE_RULE_CLASS} />}
    </a>
  )
}

/**
 * Figma's `ButtonAction-small` — a ringed circle around an up arrow. It appears
 * at two sizes: 35px alone at the right end of the wide capsule (node
 * 5054:9071), and 24px inside the expanded menu's "Back to top" row (node
 * 5058:5592).
 *
 * PRESENTATIONAL, not a button. At 35 it IS the whole control; at 24 it is the
 * right-hand end of a row whose label is the other half, and only one of those
 * two can be the `<button>`. So the ring lives here and the semantics live at
 * the call sites — which is also why it is `aria-hidden`: whichever button wraps
 * it already carries the name.
 *
 * THE RING IS CSS, NOT THE EXPORTED ASSET. Figma composes the circle from an
 * ellipse image; it is a plain circular stroke, so drawing it as a border is the
 * same picture with nothing to keep in sync, and the ring then follows its
 * container's colour rather than being baked in. The ARROW is the real exported
 * icon — the same `ic-arrow-up.svg` the homepage nav's home avatar draws.
 *
 * The arrow is 57% of the circle at both sizes (20 of 35, 14 of 24), which is
 * the one number that has to travel between them.
 */
function TopArrowCircle({ size, arrow }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full border border-current"
      style={{ width: size, height: size }}
    >
      <ArrowUpIcon width={arrow} height={arrow} />
    </span>
  )
}

/**
 * The wide capsule's back-to-top: the 35px circle on its own, as a real
 * `<button>`. It scrolls, it does not navigate, and there is nothing on the page
 * to anchor to (see `scrollToTop` in lib/anchorScroll.js).
 *
 * 35px clears WCAG 2.2's 24px minimum target with room. No hover treatment,
 * because the Figma component defines none — flagged rather than invented.
 */
function BackToTopButton({ className = '' }) {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      data-component="chapter-nav-top"
      className={`flex shrink-0 items-center text-text-inverted ${FOCUS_ON_DARK} ${className}`}
    >
      <TopArrowCircle size={35} arrow={20} />
    </button>
  )
}

/** `breakpoint=desktop` (node 5052:7381) — five labels and the back-to-top. */
function ChapterNavWide({ chapters, activeId, className }) {
  return (
    <nav aria-label="Chapters" data-component="chapter-nav" data-variant="wide" className={className}>
      {/* CONTENT-SIZED WITH AN EXPLICIT GAP, where Figma sets a fixed 586px
          width and lets `justify-between` open the space between the last label
          and the button.
          
          The frame no longer sets a fixed width at all -- it is auto-width with
          an explicit `gap-32`, which is exactly what this had been
          reverse-engineering out of the old 586. The derived number is gone and
          the stated one is here, which is the better version of the same
          layout: it cannot drift as the fluid type resizes the labels. */}
      <div className={`${CAPSULE_CLASS} ${PAD_WIDE} flex items-center gap-space-32 rounded-radius-60`}>
        <ul className="flex items-start gap-space-16" style={{ listStyle: 'none', margin: 0 }}>
          {chapters.map((chapter) => (
            <li key={chapter.id} className="flex">
              <ChapterLink chapter={chapter} active={chapter.id === activeId} />
            </li>
          ))}
        </ul>
        <BackToTopButton />
      </div>
    </nav>
  )
}

/**
 * `breakpoint=mobile closed` (5052:7428) and `mobile open` (5052:7429).
 *
 * The trigger stays exactly where the wide capsule sits and the menu opens
 * ABOVE it -- not a bottom sheet, no overlay, no title, no close button. The
 * menu is anchored to the trigger (`bottom-full`, centred on it) so it reads as
 * belonging to the control that opened it, and capped at the viewport width so
 * a longer chapter list on a future page cannot push it off screen.
 */
function ChapterNavNarrow({ chapters, activeId, visible, className }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  // The nav can leave while the menu is open -- scroll past "Feedback or
  // comments?" with the menu up and it would fade out mid-open, then be found
  // still open on the way back. Closing with the nav keeps the two states from
  // getting out of step.
  useEffect(() => {
    if (!visible) setOpen(false)
  }, [visible])

  const activeChapter = chapters.find((chapter) => chapter.id === activeId) ?? chapters[0]

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {open && (
        <nav
          id="chapter-menu"
          aria-label="Chapters"
          data-component="chapter-nav"
          data-variant="narrow-menu"
          // `mb-space-8`: the small gap the menu keeps from its trigger.
          // `max-w-[calc(100vw-32px)]` matches the wrapper's own px-space-16
          // gutter, so the menu can never be wider than the screen it opens on.
          // `left-0` and the shared fixed width, so the menu sits exactly over
          // the trigger and matches it edge to edge. See MOBILE_WIDTH.
          className={`${CAPSULE_CLASS} ${PAD_MENU} ${MOBILE_WIDTH} absolute bottom-full left-0 mb-space-8 flex flex-col gap-space-24 rounded-radius-24`}
        >
          <ul className="flex flex-col items-start" style={{ listStyle: 'none', margin: 0 }}>
            {chapters.map((chapter) => (
              <li key={chapter.id} className="flex">
                <ChapterLink
                  chapter={chapter}
                  active={chapter.id === activeId}
                  // Close, then scroll. The scrollspy picks the active state up
                  // from the scroll like any other -- selection never sets it
                  // directly, so a click and a scroll can't leave the nav
                  // claiming two different chapters.
                  onClose={() => setOpen(false)}
                  // Figma's rhythm and the tap-target floor are the same number
                  // here, which is why neither had to be compromised: a 20px
                  // label with 12px of padding either side is a 44px row, and
                  // 44px of pitch is exactly the 24px gap the design draws
                  // between rows (node 5052:7429).
                  //
                  // `min-h-[44px]` is not belt-and-braces on that -- it is
                  // load-bearing, and only measurement showed it. The label is
                  // `text-caption`, which is fluid: at the 402 frame it renders
                  // 12.3px rather than 14, so the row came out 41px and missed
                  // the floor on exactly the viewport where touch is the only
                  // input. The floor is an accessibility constant, so it is
                  // stated as one rather than left to fall out of the type
                  // scale.
                  className="min-h-[44px] justify-center py-space-12"
                />
              </li>
            ))}
          </ul>

          {/* BACK TO TOP closes the menu — node 5054:9138. It is the one row
              here that is not a chapter, so it sits outside the list rather
              than as a sixth <li>: a screen reader should not hear "6 items"
              for five chapters.

              A FULL-WIDTH ROW, label left and the ringed circle right, since
              Flore's 2026-08-30 pass. It used to be a shrink-to-fit label with
              a bare arrow beside it; the row now spans the menu with
              `justify-between`, which puts the circle on the same right margin
              the menu's own padding sets and makes the whole row the target
              rather than just the words.

              The circle is decorative here (see TopArrowCircle) -- this button
              already carries the name, and two accessible names in one control
              is one too many.

              The 48px Figma draws between the last chapter and this row is
              built from `gap-space-24` plus the 12px each row already carries,
              so the chapter rhythm and this step cannot drift into two numbers.

              Quiet colour like an inactive chapter, because it is the same kind
              of thing: somewhere else you could be. */}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              scrollToTop()
            }}
            data-component="chapter-nav-top"
            className={`flex min-h-[44px] w-full shrink-0 items-center justify-between whitespace-nowrap py-space-12 text-body-sm font-normal text-text-inverted-tertiary transition-colors hover:text-text-inverted motion-reduce:transition-none ${FOCUS_ON_DARK}`}
          >
            Back to top
            <TopArrowCircle size={24} arrow={14} />
          </button>
        </nav>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-controls="chapter-menu"
        data-component="chapter-nav"
        data-variant="narrow-trigger"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        // radius-60 and `items-center`, both resampled 2026-08-30 (node
        // 5052:7428). The collapsed trigger used to square off to radius-24 and
        // top-align its arrow; it is now the same pill as the wide row, with the
        // arrow centred against the label-plus-rule stack. Only the EXPANDED
        // menu keeps radius-24 now, which reads better than it sounds -- the
        // squarer corner is what distinguishes the open panel from the pill
        // that opened it.
        // `justify-between`, not a gap: at a fixed 250 the label sits on the
        // left margin and the chevron on the right, which is what the frame
        // draws and what keeps the chevron in one place as the active label
        // changes length underneath it.
        className={`${CAPSULE_CLASS} ${PAD_TRIGGER} ${MOBILE_WIDTH} flex items-center justify-between rounded-radius-60 text-text-inverted ${FOCUS_ON_DARK}`}
      >
        {/* The visible label is the current chapter, which on its own reads as
            a statement rather than a control. The screen-reader prefix says
            what the button does; `aria-expanded` says what state it is in. */}
        <span className="sr-only">Chapters, current chapter: </span>
        <span className="flex flex-col items-center gap-space-4">
          <span className="text-body-sm font-semibold text-text-inverted">
            {activeChapter?.label}
          </span>
          <span aria-hidden="true" className={ACTIVE_RULE_CLASS} />
        </span>
        {/* A CHEVRON, not the up/down arrow, and SWAPPED rather than rotated.
            Both are Flore's call, 2026-08-30.

            The chevron is the point of the change: this trigger sits a few
            pixels from a back-to-top button, and with an arrow on each they read
            as one control pointing two ways. A chevron says "this opens", an
            arrow says "this goes somewhere".

            Swapped rather than rotated because Figma draws two variants and
            Flore exported two assets (nodes 5052:7428 collapsed, 5058:2897
            open). The paths ARE exact 180° rotations of each other -- checked,
            not assumed -- so `rotate-180` on the down chevron would render
            identically today and would animate, which is what this did before.
            It follows the file instead: if either icon is ever redrawn so they
            are no longer mirrors, a rotation would silently keep showing the
            wrong one, and a swap cannot. The cost is the small turn animation,
            which is one line to bring back. */}
        {open ? (
          <ChevronUpIcon aria-hidden="true" width={20} height={20} />
        ) : (
          <ChevronDownIcon aria-hidden="true" width={20} height={20} />
        )}
      </button>
    </div>
  )
}

export default function ChapterNav({ chapters, activeId, visible }) {
  return (
    <div
      // BELOW the global nav (z-30) and above page content. The two never
      // occupy the same corner, but the ordering is the part that has to be
      // deliberate rather than incidental.
      //
      // `fixed` + `pointer-events-none` on the wrapper: it spans the full width
      // to centre its child, and a full-width invisible strip across the bottom
      // of every case study would otherwise eat clicks on the content beneath
      // it. The capsule itself turns pointer events back on.
      //
      // bottom-space-24 is the floating offset in the design (the instances sit
      // 21-23px off the bottom of both example frames, 5047:3686 and 5052:7456).
      className={`pointer-events-none fixed inset-x-0 bottom-space-24 z-20 flex justify-center px-space-16 transition-[opacity,transform] duration-200 motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-space-8 opacity-0'
      }`}
      // Out of the tab order entirely while hidden. Opacity alone would leave
      // five invisible links focusable in the middle of the hero, which is the
      // classic way a "hidden" floating control breaks keyboard navigation.
      //
      // `inert` covers keyboard and assistive tech; the pointer-events toggle
      // on the two children below covers the mouse, and covers it in browsers
      // too old for `inert` as well. Belt and braces on purpose -- an
      // invisible full-width strip that still swallows clicks over the hero is
      // the worst failure mode this component has.
      inert={visible ? undefined : ''}
    >
      {/* Both variants render, and CSS picks one. A JS width check would flash
          the wrong control on first paint -- the same call Nav.jsx makes for
          the same reason.

          THE BREAKPOINT IS `md` (768px), and it MOVED UP from `sm` on
          2026-08-30 when the label went from 14px to 16px. Worth recording as a
          dependency rather than a revision: the collapse point is a function of
          the type size, so a type change silently invalidates whatever number
          was measured under the old one.

          Measured against the content column (Container's inner box), not the
          raw viewport, because that is the width the reader sees the capsule
          sitting inside:

            640   490 of 589   83%   crowded -- reads as near-full-width
            700   493 of 672   73%
            768   505 of 728   69%   comfortable

          At 640 the row now leaves 75px each side, against 167px when it was
          14px type. `md` is the first standard step where it is clearly not
          crowded, and it is the site's own established phone/tablet boundary
          (Nav.jsx), so this still adds no new breakpoint.

          It does mean both navs now change shape at the same width, which the
          `sm` choice was partly avoiding. That trade is worth taking: one
          phone/tablet boundary for the whole site is easier to reason about
          than two a few hundred pixels apart, and nobody watches both controls
          during a resize. */}
      <ChapterNavWide
        chapters={chapters}
        activeId={activeId}
        className={`hidden md:block ${visible ? 'pointer-events-auto' : ''}`}
      />
      <ChapterNavNarrow
        chapters={chapters}
        activeId={activeId}
        visible={visible}
        className={`md:hidden ${visible ? 'pointer-events-auto' : ''}`}
      />
    </div>
  )
}
