import Media from './Media'
import { FOCUS_CLASS } from '../ButtonLink'
import { Link } from 'react-router-dom'
import { ARTIFAKT } from '../../lib/caseStudyLayout'

/**
 * The six process-log thumbnails under "How I worked" -- a screenshot of each
 * log document with its name underneath.
 *
 * LINKED as of 2026-08-24 to the standalone documents in
 * `public/process/artifakt/` (see the README there). A log with no `href` still
 * renders as a plain <div> -- not as an <a> with
 * a dead or placeholder target, and not as a disabled-looking control that
 * promises an interaction the page can't honour.
 *
 * Adding the links later is one field per entry in the content file; this
 * component already renders the <a>, hover lift and focus ring for any entry
 * that has one. That is the whole reason the branch exists now rather than
 * later -- so "add the URLs" stays a content edit and never becomes a
 * component rewrite.
 *
 * GRID: three across, wrapping to two rows, matching Figma's two explicit rows
 * of three (nodes 4897:4630 / 4897:4634) -- but as a real grid rather than two
 * hardcoded rows, so it can reflow to two-up and one-up on narrower screens
 * instead of overflowing. Gap 32, sampled.
 *
 * CAPPED AT THE PAGE'S PROSE MEASURE, not left to fill the content column.
 * Figma puts the whole card block in a 712-wide container (node 4897:4629),
 * which is exactly 3 x 216 + 2 x 32 -- so the cards sit under the paragraph at
 * the paragraph's own width rather than spanning the page. Uncapped they came
 * out 373 wide each, which is nearly double the design and made six thumbnails
 * read as the section's main event rather than as an index to it. The 720 cap
 * yields ~219 per card, within 3px of the drawn size.
 *
 * CARD CHROME sampled from the `card-process log` component (4885:4376): white
 * fill, 2px grey border, radius 12, image cropped to fill. The 2px is real and
 * unusual -- every other bordered surface on the site is 1px -- so it is
 * written as an explicit `border-2` rather than left to the default.
 *
 * HOVER: the border goes grey -> black. Sampled from the component's `hover`
 * variant, which Flore added 2026-08-24 (node 4932:4708): it swaps
 * Colors/Border/grey for Colors/Action/primary/border/default and changes
 * nothing else -- no lift, no shadow, no scale.
 *
 * The small translate that used to be here is gone with it. It was invented,
 * not sampled, and the reason Flore drew this variant was that the cards did
 * not read as clickable; a 2px border darkening to near-black states that far
 * more plainly than a 2px nudge. `border-color` is also cheap to animate,
 * where the transform was compositing six cards on every pointer move.
 *
 * On the LINK, not the card div, so the border responds to keyboard focus as
 * well -- the focus ring and the darkened border now arrive together.
 *
 * CROPPING IS CORRECT HERE, and it is the one place on this page that crops.
 * These are thumbnails of long documents; the delivered files are all 432x300
 * (exactly 2x Figma's 216x150), so `object-cover` in a fixed-ratio box shows
 * the top of each document at a consistent size. Media.jsx deliberately never
 * crops, which is why these use a plain <img> through it with a fixed aspect
 * rather than fighting that rule.
 */
export default function ProcessLogCards({ logs }) {
  return (
    <ul className={`m-0 grid list-none grid-cols-2 gap-space-32 p-0 sm:grid-cols-3 ${ARTIFAKT.prose}`}>
      {logs.map((log) => {
        const card = (
          <>
            <div className="w-full overflow-hidden rounded-radius-12 border-2 border-border-grey bg-surface-background transition-colors group-hover:border-action-primary-border group-focus-visible:border-action-primary-border">
              <Media
                kind="image"
                src={log.src}
                alt={log.alt}
                label={log.label}
                placeholderAspect="216 / 150"
                className="!rounded-none"
              />
            </div>
            <span className="text-center text-caption font-normal text-text-primary">
              {log.title}
            </span>
          </>
        )

        return (
          <li key={log.title} className="m-0">
            {log.href ? (
              // A React Router Link, not an <a>: `log.href` is an in-app
              // route (/work/artifakt/process/:log) that frames the document
              // with the site nav, so it should navigate in-app and keep the
              // reader's history. Router links also get the base path applied
              // by the router itself, so no assetUrl here.
              <Link
                to={log.href}
                className={`group flex flex-col items-center gap-space-8 no-underline ${FOCUS_CLASS}`}
              >
                {card}
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-space-8">{card}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
