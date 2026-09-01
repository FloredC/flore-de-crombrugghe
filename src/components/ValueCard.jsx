import ImagePlaceholder from './ImagePlaceholder'
import assetUrl from '../lib/assetUrl'

// The Figma ValueCard (4533:19717) is image + title + description, not just
// text: the top block is a dashed 262px container holding an illustration.
// That slot was missing from this component entirely until now -- it renders
// the "[ img ]" placeholder while the real illustrations are outstanding.
export default function ValueCard({ item }) {
  return (
    <article data-component="value-card" className="flex flex-col items-center gap-space-24">
      {/* THE FRAME IS CSS, THE ASSET IS JUST THE DRAWING -- Flore, 2026-08-28,
          restructured as `principles-media` (node 4645:5759).

          It used to be baked in: each SVG was the whole 278x262 slot, a rounded
          border path filled #D2D2D2 followed by the drawing. That made the
          frame unscaleable -- changing the box would have shrunk the asset's
          own border with it. The border path and its mask are stripped from all
          four files and the frame lives here now.

          THE FOUR ASSETS SHARE ONE 247x160 CANVAS, which is the thing that
          makes "evenly scaled and never cropped" work. Each drawing sits
          centred on that canvas at a single shared scale, so the browser has
          nothing to decide: the four render at their true relative sizes with
          no per-file fitting, and nothing is cropped because the canvas was
          sized to contain the largest of them.

          Re-exported larger 2026-09-01 (was 200x130). The three numbers below
          all come off that canvas and only agree by being changed together:
          the aspect ratio, the max-w cap, and the frame's own padding. Changing
          the canvas again means changing all three -- a stale ratio against a
          new file silently stretches the artwork, which is what the previous
          version did before it carried an aspect-ratio at all.

          That is why the <img> needs no `object-fit` at all. The box and the
          file are the same 247/160 ratio, so contain, cover and fill would all
          produce the same pixels.

          `max-w-[247px]` caps it at the canvas's own size so it never scales UP
          past its design size on a wide card; below that it scales down with
          the card and the frame's height follows, so the four cards stay equal
          without being told to.

          Padding is 0 horizontal / 8 vertical, bound in Figma to Spaces/0 and
          Spaces/8. The horizontal 0 is not a missing value: the image is
          centred at its own fixed width inside the full content box, which is
          what leaves the ~15px of visual side margin the frame appears to have.
          Card 278 = 247 image + 2 border + 29 of centring slack; height
          178 = 160 + 8 + 8 + 2 border.

          alt is empty because the illustration repeats the title sitting
          directly beneath it; captioning it would make a screen reader
          announce "Editing" twice. */}
      <div
        data-component="value-card-media"
        className="flex w-full items-center justify-center rounded-radius-32 border border-border-grey py-space-8"
      >
        {item.image ? (
          <img
            src={assetUrl(item.image)}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[247/160] w-full max-w-[247px]"
          />
        ) : (
          <ImagePlaceholder className="aspect-[247/160] w-full max-w-[247px]" />
        )}
      </div>
      <div className="flex w-full flex-col gap-space-12">
        {/* h3, not h4: this sits directly under its section's <h2>, the same
            level as a ProjectCard title. h4 here skipped a level, which
            breaks the document outline a screen reader announces. Size is
            set by the type class, so the tag change is invisible. */}
        <h3 className="text-body font-bold">{item.title}</h3>
        <p className="text-body font-normal">{item.description}</p>
      </div>
    </article>
  )
}
