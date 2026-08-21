import Media from './Media'

/**
 * A tinted panel with artwork sitting on it, plus an optional caption INSIDE
 * the panel. The Artifakt page's one media pattern -- it appears nine times.
 *
 * WHY THE TINT LIVES HERE AND NOT IN THE FILE
 *
 * Flore's exported artwork is TRANSPARENT PNG (verified by opening the files,
 * not assumed: `how-it-works.png` and `against-the-defaults.png` both render
 * with no background of their own). Figma composes each one over a rectangle
 * filled with `Colors/surface/highlight`, and that rectangle is what makes the
 * artwork read as inset rather than floating on white. So the tint is the
 * panel's job, and an asset re-export can't accidentally bake in a colour that
 * then can't follow a token change.
 *
 * This is the Artifakt page's answer to the same question PitchPivot answers
 * with `bg-notebook` graph-paper panels. Deliberately different, per the Figma
 * frame -- flagged to Flore as a divergence between the two case studies
 * rather than silently unified.
 *
 * RADIUS: `radius-4` on the section stages, sampled -- Figma binds `Radius/4`
 * on every one of them (e.g. node 4897:4533). It is nearly square, which looks
 * like a mistake next to the site's usual 24, and it is not: the artwork
 * inside carries its own generous rounding, so a big radius on the panel too
 * would read as two nested pills. The final-product panel overrides to
 * `radius-60`, also sampled (node 4897:4639).
 *
 * PADDING: one value, `space-24`, for every stage. Figma's own insets vary
 * between roughly 27 and 45 depending on the artwork -- hand-placed, not a
 * system -- and reproducing each one would put five unexplainable numbers in
 * the code. 24 is the padding the site's existing media panels already use, so
 * a stage here breathes like a panel on the PitchPivot page. A deliberate
 * regularisation of the frame, not a sample.
 *
 * HEIGHT IS NEVER SET. The media reports its own dimensions and the panel
 * grows to fit (see Media.jsx -- the media sets the size, the layout adapts).
 * Figma draws fixed-height stages, so a few panels here end up marginally
 * taller or shorter than the frame; that is the correct trade, because a fixed
 * height would either crop artwork or letterbox it.
 */
export default function MediaStage({
  caption,
  radius = 'rounded-radius-4',
  className = '',
  children,
  ...media
}) {
  return (
    <figure
      data-component="media-stage"
      className={`m-0 flex flex-col items-center gap-space-16 overflow-hidden bg-surface-highlight p-space-24 ${radius} ${className}`}
    >
      {/* `children` is the escape hatch for the two stages that hold something
          other than a single asset -- today that is the pair of pipeline
          embeds, which are iframes Flore has not built yet. Everything else
          passes media props straight through. */}
      {children ?? <Media {...media} />}

      {caption && (
        // Inside the panel, not below it. Figma places every caption on the
        // tinted rectangle (nodes 4897:4605, 4897:4616, 4897:4646), which is
        // why this component owns the caption rather than delegating to
        // Media's own `caption` prop -- that one renders outside the frame,
        // which is right for the homepage cards and wrong here.
        <figcaption className="text-center text-caption font-normal text-text-primary">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
