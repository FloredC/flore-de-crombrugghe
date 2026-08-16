// A numbered takeaway: index, claim title, body, and an open evidence slot.
//
// The evidence slot is the point of this component, per the build spec: it
// takes quotes, bars, media or nothing, so the same block carries the whole
// Takeaways section here and every future project's learnings without being
// rewritten. That's why `evidence` is a React node rather than a typed shape --
// the block deliberately doesn't know what kind of evidence it's holding.
//
// The index is rendered as part of the heading text ("01 — ...") rather than as
// a separate badge, matching Figma. That keeps it in the accessible name of the
// heading, so a screen-reader user navigating by heading hears the number and
// the claim together, which is how the section is meant to be scanned.
export default function LearningBlock({ index, title, body = [], evidence }) {
  return (
    <div data-component="learning-block" className="flex flex-col gap-space-16">
      {/* text-h2 is the nearest token to Figma's Desktop/h3 (24 SemiBold) on
          these titles. Claim headings are full sentences by content rule --
          see CASE-STUDY-SYSTEM.md -- which is why they get a real heading size
          rather than a small label treatment. */}
      <h3 className="m-0 text-h2 font-semibold text-text-primary">
        {index} — {title}
      </h3>
      {body.map((paragraph) => (
        <p key={paragraph} className="m-0 text-body-lg font-normal text-text-primary">
          {paragraph}
        </p>
      ))}
      {/* Rendered only when there is something to render, so an evidence-less
          takeaway doesn't leave an empty gap behind it. */}
      {evidence ? <div className="pt-space-8">{evidence}</div> : null}
    </div>
  )
}
