import { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * Catches a render error anywhere below it and shows a way out instead of a
 * blank page.
 *
 * WHY THIS EXISTS, and it is worth being precise because the fix is not a
 * diagnosis. On 2026-09-01 Flore hit a fully white page going from Artifakt to
 * PitchPivot via the "next project" rail — no nav, no content, recoverable only
 * by reloading. That signature is React 18 unmounting the whole tree after an
 * uncaught error during render: with no boundary anywhere above it, the root is
 * emptied and nothing is left to paint.
 *
 * The cause was never reproduced. It did not appear at a real 1512x850 viewport
 * on the live site, with no errors on the page and none in the console, across
 * repeated runs. So this component does NOT fix the bug. What it does is bound
 * the damage: the worst outcome becomes a small message with a link back to the
 * work, rather than a white screen in front of someone she is showing the site
 * to.
 *
 * IT ALSO REPORTS. The error message and component stack are printed to the
 * console and rendered on the page behind a <details>, because the next time
 * this fires the message is the single most useful thing anyone can have. A
 * boundary that silently swallows the error would trade a visible failure for
 * an invisible one, which is worse — the page would look fine and the bug would
 * go unfixed.
 *
 * KEYED ON PATHNAME by the caller (see App.jsx). A boundary latches: once it has
 * caught, it renders the fallback until its state is reset. Remounting it on
 * every route change means a reader who hits this can simply navigate away and
 * carry on, rather than being stuck in the fallback for the rest of the session.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Deliberately console.error and not a silent capture: this is the only
    // record of what went wrong, and it is what Flore can screenshot.
    console.error('Render error caught by ErrorBoundary:', error, info?.componentStack)
    this.setState({ info })
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="mx-auto flex min-h-[60svh] max-w-[640px] flex-col justify-center gap-space-16 px-space-24">
        <h1 className="text-heading-md text-text-primary">This page didn’t load.</h1>
        <p className="text-body-md text-text-secondary">
          Something went wrong rendering it. Reloading usually fixes it — or head back to the work.
        </p>
        <p className="flex gap-space-16">
          <Link className="underline" to="/">
            Back to Work
          </Link>
          <button className="underline" type="button" onClick={() => window.location.reload()}>
            Reload this page
          </button>
        </p>
        <details className="text-body-sm text-text-secondary">
          <summary>Technical details</summary>
          <pre className="mt-space-8 overflow-x-auto whitespace-pre-wrap">
            {String(this.state.error?.stack || this.state.error)}
            {this.state.info?.componentStack}
          </pre>
        </details>
      </main>
    )
  }
}
