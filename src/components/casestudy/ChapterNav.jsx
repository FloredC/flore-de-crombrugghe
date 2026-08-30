import { useEffect, useRef, useState } from 'react'
import { FOCUS_CLASS } from '../ButtonLink'
import { ArrowDownIcon } from '../icons'
import { scrollToChapter } from '../../lib/useChapterProgress'

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
 * `z-20` against the global nav's `z-30`, a 1px grey border where the global
 * pill carries a drop shadow, and 14px caption type against the pill's 18px
 * bold. Nothing here competes for the same job.
 */

// ONE SHARED CAPSULE, not five pills. Figma's padding is asymmetric --
// pt-12 / pb-8 -- because the active item's rule hangs below the label and the
// smaller bottom inset is what keeps it optically centred. Carried over as-is;
// evening it out is what makes the capsule look bottom-heavy.
const CAPSULE_CLASS = 'border border-border-grey bg-surface-background px-space-40 backdrop-blur-[2px]'

// Figma's vertical padding for the two CLOSED capsules -- the wide row and the
// collapsed trigger. Resampled 2026-08-30 after Flore made the control less
// self-effacing: it was 12/8 against a 14px label, and is now 14/12 against a
// 16px one. Both halves of that change matter, and it is worth saying why the
// padding moved at all: a bigger label inside the old insets would have made
// the capsule read as tight rather than as louder.
//
// Still asymmetric, and still for the same reason -- the active item's rule
// hangs below its label, so an even inset would leave the row sitting high in
// its own capsule.
//
// The expanded menu deliberately does NOT take this. Figma left that variant on
// the old 12/8 (node 5052:7429), and in our build its rows carry their own
// padding to reach a 44px tap target anyway -- stacking the two would double
// the inset above the first row.
const CAPSULE_PAD_Y = 'pt-space-14 pb-space-12'

// The active state's rule: 16x2, `text-primary`, 4px under the label
// (node 5052:7655). A real element rather than `text-decoration`, because it is
// a fixed 16px centred under the label and not the width of the text -- an
// underline utility cannot draw that. It is also why LINK_UNDERLINE_CLASS (the
// global nav's current-section marker) is deliberately not reused: same idea,
// different mark, and the global nav's is the louder one.
const ACTIVE_RULE_CLASS = 'h-[2px] w-[16px] bg-text-primary'

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
            ? 'font-semibold text-text-primary'
            : 'font-normal text-text-tertiary group-hover:font-semibold group-hover:text-text-primary'
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
function ChapterLink({ chapter, active, onSelect, className = '' }) {
  return (
    <a
      href={`#${chapter.id}`}
      aria-current={active ? 'true' : undefined}
      data-current={active || undefined}
      onClick={(event) => {
        // Leave modified clicks to the browser -- they mean "open elsewhere".
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
        event.preventDefault()
        onSelect(chapter.id)
      }}
      className={`group flex flex-col items-center gap-space-4 rounded-radius-4 ${FOCUS_CLASS} ${className}`}
    >
      <ChapterLabel label={chapter.label} active={active} />
      {active && <span aria-hidden="true" className={ACTIVE_RULE_CLASS} />}
    </a>
  )
}

/** `breakpoint=desktop` (node 5052:7381) — all five labels in one capsule. */
function ChapterNavWide({ chapters, activeId, onSelect, className }) {
  return (
    <nav aria-label="Chapters" data-component="chapter-nav" data-variant="wide" className={className}>
      <ul
        className={`${CAPSULE_CLASS} ${CAPSULE_PAD_Y} flex items-start justify-center gap-space-16 rounded-radius-60`}
        style={{ listStyle: 'none', margin: 0 }}
      >
        {chapters.map((chapter) => (
          <li key={chapter.id} className="flex">
            <ChapterLink chapter={chapter} active={chapter.id === activeId} onSelect={onSelect} />
          </li>
        ))}
      </ul>
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
function ChapterNavNarrow({ chapters, activeId, onSelect, visible, className }) {
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
          className={`${CAPSULE_CLASS} absolute bottom-full left-1/2 mb-space-8 max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-radius-24`}
        >
          <ul className="flex flex-col items-start" style={{ listStyle: 'none', margin: 0 }}>
            {chapters.map((chapter) => (
              <li key={chapter.id} className="flex">
                <ChapterLink
                  chapter={chapter}
                  active={chapter.id === activeId}
                  onSelect={(id) => {
                    // Close first, then scroll. The scrollspy takes the active
                    // state from there like any other scroll -- selection does
                    // not set it directly, so a click and a scroll can never
                    // leave the nav claiming two different chapters.
                    setOpen(false)
                    onSelect(id)
                  }}
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
        className={`${CAPSULE_CLASS} ${CAPSULE_PAD_Y} flex items-center gap-space-4 rounded-radius-60 ${FOCUS_CLASS}`}
      >
        {/* The visible label is the current chapter, which on its own reads as
            a statement rather than a control. The screen-reader prefix says
            what the button does; `aria-expanded` says what state it is in. */}
        <span className="sr-only">Chapters, current chapter: </span>
        <span className="flex flex-col items-center gap-space-4">
          <span className="text-body-sm font-semibold text-text-primary">
            {activeChapter?.label}
          </span>
          <span aria-hidden="true" className={ACTIVE_RULE_CLASS} />
        </span>
        <ArrowDownIcon
          aria-hidden="true"
          width={20}
          height={20}
          className={`transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  )
}

export default function ChapterNav({ chapters, activeId, visible }) {
  const onSelect = (id) => scrollToChapter(id)

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
        onSelect={onSelect}
        className={`hidden md:block ${visible ? 'pointer-events-auto' : ''}`}
      />
      <ChapterNavNarrow
        chapters={chapters}
        activeId={activeId}
        onSelect={onSelect}
        visible={visible}
        className={`md:hidden ${visible ? 'pointer-events-auto' : ''}`}
      />
    </div>
  )
}
