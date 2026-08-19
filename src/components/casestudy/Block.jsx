import Container from '../Container'
import { WIDTH, WIDTHS } from '../../lib/caseStudyLayout'

// The width primitive every case-study block renders through. One place that
// knows how a width name becomes a box, so Rule 1 can be reasoned about by
// reading the page's block list rather than by auditing per-component CSS.
//
// `bleed` skips Container entirely -- Container is what supplies the page's
// side padding and 1280 cap, and a bleed block exists precisely to escape
// both. Every other width sits inside it and narrows from there, so they can
// never be wider than the homepage's content column.
//
// `as` defaults to <section> because these are the page's top-level landmarks;
// Frame passes <header> and Onward passes <nav>-flavoured markup of its own.
export default function Block({ width = 'wide', as: Tag = 'section', className = '', children, ...props }) {
  if (!WIDTHS.includes(width)) {
    throw new Error(`Block: unknown width "${width}". Expected one of ${WIDTHS.join(', ')}.`)
  }

  // data-width is not decoration: it's what makes the width sequence readable
  // in devtools and what the dev-only Rule 1 check in CaseStudy.jsx reads back
  // off the DOM, rather than trusting a parallel list that could drift.
  const shared = { 'data-width': width, ...props }

  if (width === 'bleed') {
    return (
      <Tag className={`w-full ${className}`} {...shared}>
        {children}
      </Tag>
    )
  }

  // `className` lands on the CONTENT box, not the outer <Tag>.
  //
  // This was the other way round and it was silently broken: every caller
  // writes something like `flex flex-col gap-space-24`, meaning "lay my
  // children out". On the <Tag> that flex container has exactly one child --
  // the Container -- so the gap had nothing to act on and every block fell
  // back to the browser's default margins on <p> and <h*>. It looked roughly
  // plausible, which is why it survived a read-through; it only showed up as
  // a measured gap of 0 between two elements that were supposed to be 40
  // apart. Caught in the browser, not in the code.
  return (
    <Tag {...shared}>
      <Container>
        <div className={`${WIDTH[width]} ${className}`}>{children}</div>
      </Container>
    </Tag>
  )
}
