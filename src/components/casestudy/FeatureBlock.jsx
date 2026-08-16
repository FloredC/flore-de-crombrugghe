import Media from './Media'

// One product feature: title + body beside its screencast. Two instances.
//
// This is the page's ONE side-by-side composition, and `mediaSide` alternating
// between the two rows is what the build spec counts as a single pattern rather
// than two. Everything else on the page stacks.
//
// KNOWN CONFLICT, flagged for Flore: the Figma frame draws BOTH rows with text
// on the left (nodes 4774:7607 and 4774:7622 are both at x=0). The build spec
// asks for alternation and lists `mediaSide` as a prop that "(alternates)".
// Alternation is what's built, because the spec also says the draft's
// "alignment is not authoritative" -- but the two disagree and it's a visible
// call, so it should be confirmed rather than assumed.
//
// The media stage is `surface-canvas` at `radius-24` with a 1px grey border --
// sampled from the real VisualFrame (node 4774:7611), which binds
// Colors/Surface/canvas, Radius/24 and Colors/Border/grey.
export default function FeatureBlock({ title, body, media, mediaSide = 'right' }) {
  return (
    <div
      data-component="feature-block"
      data-media-side={mediaSide}
      // Single column until lg. Below that the text column would be too narrow
      // to hold a line of prose beside a 16:9 video, so the pair stacks --
      // media first is wrong there (the title should introduce it), so the
      // order override only applies from lg.
      className="grid grid-cols-1 items-center gap-space-32 lg:grid-cols-2 lg:gap-space-48"
    >
      <div className={`flex flex-col gap-space-16 ${mediaSide === 'left' ? 'lg:order-2' : ''}`}>
        {/* h3: the feature sits under the section's h2 heading, so the outline
            stays h1 -> h2 -> h3 with no skipped level. Type is `text-h2`,
            the nearest token to Figma's Desktop/h3 (24 SemiBold). */}
        <h3 className="m-0 text-h2 font-semibold text-text-primary">{title}</h3>
        <p className="m-0 text-body-lg font-normal text-text-primary">{body}</p>
      </div>

      <div className={mediaSide === 'left' ? 'lg:order-1' : ''}>
        <Media
          {...media}
          // The tinted stage belongs on the media frame, so the placeholder and
          // the real video occupy an identically-styled box.
          className="border border-border-grey bg-surface-canvas"
        />
      </div>
    </div>
  )
}
