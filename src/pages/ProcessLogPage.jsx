import { useParams, Navigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { getProjectBySlug, getProcessLogs } from '../lib/content'
import assetUrl from '../lib/assetUrl'

/**
 * A process-log document, framed with the site's navigation.
 *
 * WHY A ROUTE AROUND AN IFRAME, RATHER THAN EDITING THE HTML
 *
 * Figma asks for the subpage navbar on these pages (node 4897:4662 — the
 * "Subpage_artifakt_process log" frame, carrying a NavbarDesktop instance that
 * reads "← Back to Artifakt"). The obvious way to get it there is to paste a
 * header into each of the six HTML files. That is the wrong move: they are
 * GENERATED exports of Flore's working documents, and the repo already learned
 * this lesson once — `public/language-river.html` carries the note "It's
 * generated elsewhere — fix at the source, don't hand-edit." Six hand-edited
 * headers would be six edits to redo on every re-export, and the first
 * re-export that forgot one would ship a page with no way back.
 *
 * So the documents stay untouched and the app supplies the chrome. Re-exporting
 * a log is then a pure file drop.
 *
 * The cost is honest and worth naming: an iframe means the log's own content is
 * not in this document's outline, browser find-in-page searches the frame only
 * once it has focus, and the URL doesn't change as the reader scrolls the log.
 * For a linked reference document those are acceptable; they would not be for
 * primary content.
 *
 * SAME-ORIGIN, so no sandbox attribute is needed to make it work and none is
 * added to pretend at safety — the file is ours, served from our own `public/`.
 * The `:log` param is matched against the case study's own `processLogs` list
 * rather than interpolated into a path, so an unknown or crafted slug redirects
 * instead of framing whatever it names.
 *
 * HEIGHT: the viewport MINUS the nav's clearance. The log is a full document
 * with its own scrolling, unlike the pipeline embed which is a fragment sized to
 * its content — but the nav is `fixed`, so a frame starting at y=0 renders its
 * first heading underneath the pill. Measured at 108px (the pill plus the
 * wrapper's py-4); the frame is offset by that and shortened by the same, so the
 * document still ends exactly at the viewport bottom and the page itself never
 * gains a second scrollbar.
 *
 * `svh` rather than `vh` for the reason the map's crop viewport uses it — `vh`
 * tracks the largest mobile viewport and shifts as browser chrome collapses,
 * which would resize the frame mid-scroll.
 *
 * A constant rather than reading the nav's height at runtime: the nav is a fixed
 * pill whose height is set by its own type and padding, it does not change with
 * this page's content, and a ResizeObserver here would be machinery for a number
 * that only moves when someone redesigns the navbar. If that happens, this is
 * the line to change — hence the note.
 */
const NAV_CLEARANCE = 108
export default function ProcessLogPage() {
  const { slug, log } = useParams()
  const project = getProjectBySlug(slug)
  const entry = getProcessLogs(slug).find((candidate) => candidate.slug === log)

  // An unknown project or log falls back to the case study if there is one,
  // and to the homepage otherwise -- never a blank frame.
  if (!entry) return <Navigate to={project ? `/work/${slug}` : '/'} replace />

  // The title the nav's back link shows. `project.title` carries the full
  // "Artifakt — Tracing your way past the blank canvas"; the back link wants
  // just the name, which is everything before the em dash.
  const projectName = project?.title?.split('—')[0].trim() || 'the case study'

  return (
    <>
      <Nav backTo={`/work/${slug}`} backLabel={`Back to ${projectName}`} />
      <main>
        <iframe
          src={assetUrl(`/process/${slug}/${entry.file}`)}
          title={`${entry.title} — process log`}
          // `block` kills the inline-element baseline gap under the iframe,
          // which would otherwise add a few px of scroll to a full-height frame.
          className="block w-full border-0"
          style={{
            marginTop: NAV_CLEARANCE,
            height: `calc(100svh - ${NAV_CLEARANCE}px)`,
          }}
        />
      </main>
    </>
  )
}
