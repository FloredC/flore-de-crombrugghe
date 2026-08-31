import useReveal from '../lib/useReveal'

/**
 * The scroll-reveal boundary: everything inside this element animates in
 * together when the element's top edge comes up past the trigger line.
 *
 * WHY THIS IS THE ONLY COMPONENT IN THE SYSTEM
 *
 * The obvious shape is a `<Reveal>` per animated thing. That shape does not
 * survive this codebase: the items that need to move are already grid children
 * (project cards), flex children (the Guide) and section headings, so wrapping
 * each one puts a new div between a grid and its item and quietly breaks the
 * layout it was meant to decorate.
 *
 * So nothing gets wrapped. This marks a CONTAINER that already exists — a Work
 * subsection, a case-study section — and the things inside it are marked with
 * plain `data-reveal` attributes on elements that already exist too. The CSS
 * does the rest off the group's `data-reveal-in` state. Adding a reveal to a
 * new block is therefore an attribute, not a new element in the tree.
 *
 * `as` because these containers are not all divs — a case-study section is a
 * real <section> and must stay one for the chapter nav's anchors.
 *
 * ORDER: `data-reveal-in` is set only once revealed, and the CSS keys the
 * hidden state off its ABSENCE (`:not([data-reveal-in])`). That is deliberate
 * and not interchangeable with keying the visible state off its presence — see
 * the cascade note in globals.css, which is a bug this actually had.
 */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const { ref, revealed } = useReveal()

  return (
    <Tag
      ref={ref}
      data-reveal-group
      // Attribute, not a class: `undefined` removes it entirely, so the
      // `:not([data-reveal-in])` selector reads as a real state rather than
      // depending on a class string that might arrive empty.
      data-reveal-in={revealed ? '' : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}
