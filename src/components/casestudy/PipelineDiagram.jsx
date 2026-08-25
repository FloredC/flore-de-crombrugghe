import { useState } from 'react'
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useHover,
  useClick,
  useDismiss,
  useInteractions,
  useTransitionStyles,
  safePolygon,
  FloatingPortal,
} from '@floating-ui/react'
import Media from './Media'
import { FOCUS_CLASS } from '../ButtonLink'
import emphasise from '../../lib/emphasis'

/**
 * The two-pass image pipeline: five steps with hover/click previews, plus a
 * grid of notes.
 *
 * WHY THIS IS A COMPONENT AND NOT AN IFRAME
 *
 * It was an iframe first (`public/embeds/artifakt/how-the-pipeline-works.html`,
 * removed 2026-08-25) and the previews were clipped at the frame's bottom edge.
 * That is not a bug an embed can be fixed out of: an iframe is a hard clipping
 * boundary, the parent sizes it to the document's `scrollHeight`, and an
 * absolutely-positioned popover contributes nothing to scrollHeight. Every
 * available workaround -- reserving bottom padding, flipping the popover
 * upward, measuring with one open -- trades one clipped edge for another.
 *
 * In the page there is no boundary to escape: the popover portals to <body>,
 * and `flip`/`shift` keep it on screen wherever the step happens to sit.
 *
 * Three things fell out of the move that are worth more than the bug fix:
 *
 *   - The embed hardcoded #420bc1 and #8b5cf6 because an iframe cannot read its
 *     parent's custom properties. Those are `chart-purple-text` and
 *     `chart-purple-stroke`, real tokens, used directly here.
 *   - It carried its own copies of three HK Grotesk weights in `public/fonts/`
 *     for the same reason. Gone; this inherits the page's type.
 *   - It duplicated a reset, a type scale and a colour scale in a second
 *     stylesheet nobody would think to update.
 *
 * INTERACTION: hover AND click, which is Flore's ask -- "they should appear on
 * hover and click to increase the chance of people discovering them". Both are
 * wired through the same floating-ui setup the map hotspots use (see
 * Hotspot.jsx), so the behaviours match the rest of the site rather than being
 * a second, subtly different popover:
 *
 *   useHover + safePolygon   opens on hover, and the bridge means moving the
 *                            cursor diagonally toward the preview doesn't close
 *                            it on the way.
 *   useClick                 tap/click toggles, which is what makes this work
 *                            on touch, where hover either never fires or sticks.
 *   useDismiss               Escape and outside-click close it.
 *
 * ONE AT A TIME, held by the parent rather than by each step, so opening a
 * second preview closes the first. Five previews open at once would overlap
 * each other and there would be no way to tell which belonged to what.
 *
 * THE CLOSE MUST BE GUARDED, and this is not defensive coding -- it is a real
 * bug that shipped and was reported (Flore, 2026-08-25: "Gesture + Material and
 * Artwork don't work on hover, or only after a first click").
 *
 * Moving the pointer from one step to its neighbour fires two callbacks: OPEN
 * on the step being entered, and CLOSE on the step being left. Their order is
 * not guaranteed, and React batches both into one render, so last-writer-wins.
 * With a naive `setOpenIndex(open ? index : null)` a close arriving second
 * overwrites the open that arrived first, and the popover never appears. The
 * pointer really is over the step -- `:hover` matches, `aria-expanded` says
 * false. Clicking works because a click fires only one callback.
 *
 * It looked step-specific because it depends on which neighbour you approach
 * from, which is why two of five seemed broken rather than all of them.
 *
 * The guard makes a close idempotent and scoped: a step may only close ITSELF.
 * A close from a step that is no longer the open one is ignored, so it cannot
 * clobber the neighbour that just opened.
 *
 * NOTE FOR LATER: `Hero.jsx` line 180 drives the map hotspots with the exact
 * same unguarded shape. It is the same latent bug; it rarely fires there only
 * because the hotspots are far apart, so a pointer seldom crosses from one
 * straight into another. Flagged rather than changed here.
 */

// The two generative passes carry the accent; input, pre-process and output are
// supporting cast. Driven by `accent` on the step data rather than by index, so
// reordering the pipeline can't silently recolour the wrong boxes.
const STEP_BASE =
  'relative flex-1 basis-[190px] min-w-[190px] max-w-[280px] cursor-pointer rounded-radius-12 border bg-surface-background px-space-14 py-space-12 text-left'

export default function PipelineDiagram({ title, intro, steps, notes }) {
  // Index of the open step, or null. Lifted here so only one can be open.
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <figure data-component="pipeline-diagram" className="m-0 flex w-full flex-col gap-space-32">
      {(title || intro) && (
        <div className="flex flex-col gap-space-12">
          {title && <h3 className="m-0 text-h2 font-semibold">{title}</h3>}
          {intro && <p className="m-0 max-w-[68ch] text-body font-normal">{emphasise(intro)}</p>}
        </div>
      )}

      {/* Flex-wrap rather than a fixed five-column grid: the steps carry
          different amounts of copy, and at narrow widths they need to reflow
          rather than squeeze. The arrows are flex items too, so they wrap with
          the steps instead of stranding at the end of a row.
          `max-w` on the step is what stops a step that wraps onto a row alone
          from stretching to the full width and reading as a different kind of
          object -- it did exactly that before the cap. */}
      <div className="flex flex-wrap items-stretch gap-space-10">
        {steps.map((step, index) => (
          <PipelineStep
            key={step.name}
            step={step}
            isOpen={openIndex === index}
            // Functional update, and the `current === index` guard is the fix
            // described above -- do not simplify it back to `open ? index : null`.
            onOpenChange={(open) =>
              setOpenIndex((current) => (open ? index : current === index ? null : current))
            }
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      {notes?.length > 0 && (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-space-12 p-0">
          {notes.map((note) => (
            <li
              key={note.title}
              className="rounded-radius-12 border border-border-grey bg-surface-background p-space-14"
            >
              <h4 className="m-0 mb-space-8 text-body-sm font-semibold">{note.title}</h4>
              <p className="m-0 text-caption font-normal leading-relaxed text-text-secondary">
                {emphasise(note.body)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </figure>
  )
}

function PipelineStep({ step, isOpen, onOpenChange, isLast }) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange,
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    // `flip` is what actually fixes the reported bug: near the bottom of the
    // viewport the preview flips above the step instead of being cut off, and
    // `shift` slides it sideways rather than letting it run off the edge.
    middleware: [offset(10), flip({ padding: 12 }), shift({ padding: 12 })],
  })

  const hover = useHover(context, { handleClose: safePolygon(), move: false })
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, click, dismiss])
  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, { duration: 120 })

  return (
    <>
      {/* A real <button>: it toggles a disclosure and navigates nowhere, which
          is the rule this project applies everywhere (see CLAUDE.md). It also
          means keyboard users reach it by Tab and open it with Enter or Space
          without any of that being hand-rolled. */}
      <button
        ref={refs.setReference}
        type="button"
        aria-expanded={isOpen}
        className={`${STEP_BASE} ${FOCUS_CLASS} ${
          step.accent
            ? 'border-chart-purple-stroke hover:border-chart-purple-text'
            : 'border-border-grey hover:border-chart-purple-text'
        }`}
        {...getReferenceProps()}
      >
        {/* The badge is the affordance. Flore's point when the previews were
            first dropped: they ARE the strength of this diagram, so it has to
            advertise them rather than let them be found by accident.
            `pr` on the kicker keeps the label clear of it. */}
        <span className="absolute right-space-10 top-space-8 text-caption-sm font-semibold text-chart-purple-text">
          ⊡ preview
        </span>
        <span className="block pr-[62px] text-caption-sm font-semibold uppercase tracking-[0.06em] text-text-secondary">
          {step.kicker}
        </span>
        <span className="mt-space-4 block text-body-sm font-semibold">{step.name}</span>
        <span className="mt-space-4 block text-caption font-normal text-text-secondary">
          {step.detail}
        </span>
      </button>

      {!isLast && (
        // Hidden below `sm`, where every step is a full row and the vertical
        // stack already implies the sequence -- horizontal arrows there read as
        // debris. `aria-hidden` because the order is already in the DOM.
        <span aria-hidden className="hidden self-center text-border-grey sm:block">
          →
        </span>
      )}

      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, ...transitionStyles }}
            className="z-50 w-[300px] rounded-radius-12 border-2 border-chart-purple-stroke bg-surface-background p-space-8 shadow-[0_8px_28px_0_rgba(80,40,140,0.18)]"
            {...getFloatingProps()}
          >
            {/* Through Media so the preview gets the same no-crop, no-collapse,
                base-path-aware handling as every other image on the page. */}
            <Media
              kind="image"
              src={step.preview.src}
              alt={step.preview.alt}
              placeholderAspect={step.preview.aspect}
              className="!rounded-radius-8"
            />
            <p className="m-0 mt-space-8 text-caption-sm font-normal leading-relaxed text-text-secondary">
              {step.preview.caption}
            </p>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
