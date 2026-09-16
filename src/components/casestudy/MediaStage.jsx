import Media from './Media'

/**
 * A tinted panel with artwork sitting on it, plus an optional caption INSIDE
 * the panel. The Artifakt page's one media pattern -- it appears nine times.
 *
 * WHY THE TINT LIVES HERE AND NOT IN THE FILE
 *
 * Flore's exported artwork is TRANSPARENT PNG (verified by opening the files,
 * not assumed: `how-it-works.webp` and `against-the-defaults.webp` both render
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
 * RADIUS AND TINT ARE BOTH PER-STAGE, and neither default is worth trusting
 * blind. Flore stripped the yellow off most of the stages on 2026-08-24, so the
 * page now runs a mix. Read off the frame, stage by stage:
 *
 *   how-it-works     highlight   radius 4    (node 4897:4533)
 *   five-artists     white       radius 0    (node 4931:4525)
 *   cake             white       radius 20   (node 4928:2804)
 *   the-reveal       white       radius 12   (node 4930:2994)
 *   the-scaffold     white       radius 12   (node 4929:2872)
 *   the-defaults     white       radius 12   (node 4929:2871)
 *   user-testing     highlight   radius 4    (node 4929:2906)
 *   final-product    highlight   radius 60   (node 4897:4639)
 *   pipeline embeds  highlight   radius 4    (node 4897:4571)
 *
 * The defaults below are white + radius 12, which is the plurality (the three
 * mid-page evidence panels) and NOT a rule -- every other stage names its own.
 * Worth knowing before anyone "simplifies" this: the yellow is now the
 * exception, and it lands on the establishing image, the testing photos, the
 * closing gallery and the two pending embeds.
 *
 * The white stages bind `Colors/Surface/background`, a real token -- except the
 * cake panel, which has no surface fill at all. Same painted result, so it uses
 * the same token here rather than inventing a "no fill" case.
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
  radius = 'rounded-radius-12',
  tint = 'bg-surface-background',
  className = '',
  children,
  ...media
}) {
  return (
    <figure
      data-component="media-stage"
      className={`m-0 flex flex-col items-center gap-space-16 overflow-hidden p-space-24 ${tint} ${radius} ${className}`}
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
