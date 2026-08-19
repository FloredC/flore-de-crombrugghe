import { useState } from 'react'
import ImagePlaceholder from '../ImagePlaceholder'
import assetUrl from '../../lib/assetUrl'

/**
 * The page's one media primitive: image, video, or a labelled placeholder while
 * a file is still missing.
 *
 * THE MEDIA SETS THE SIZE. THE LAYOUT ADAPTS TO IT. (Flore's call, 2026-08-12.)
 *
 * This took three attempts and the two failed ones are worth recording, because
 * both looked fine in the code:
 *
 *  1. A declared `aspectRatio` on the frame with `object-cover` on the media.
 *     Wrong way round: any file whose real proportions differed even slightly
 *     from the declared ratio was silently CROPPED — edges shaved off a
 *     screencast with no error and nothing to notice.
 *
 *  2. `w-full h-auto` with no ratio at all, letting intrinsic size govern.
 *     Correct for images, broken for video: a <video> whose metadata hasn't
 *     loaded yet reports no dimensions, so `h-auto` collapses it to the UA
 *     default of 150px. Measured in the browser — a real screencast rendered as
 *     a 566x150 strip. If the metadata never loads (bad codec, 404) it stays
 *     that way permanently.
 *
 * What actually works is to MEASURE the media and adapt: the frame carries
 * `placeholderAspect` only until the file reports its own dimensions, then
 * switches to the real ratio. So the box always ends up the media's true shape,
 * nothing is ever cropped or letterboxed, and there is no collapse while
 * loading. `object-contain` is belt-and-braces: with a matching ratio it
 * changes nothing, but it makes a crop impossible even if a ratio is off by a
 * hair.
 *
 * BASE PATH: every `src` and `poster` goes through `assetUrl()`. Paths that
 * arrive as strings from a data file are invisible to Vite, so it never
 * rewrites them, and a literal `/images/...` would resolve against the domain
 * root — correct on localhost, 404 in production under /flore-de-crombrugghe/.
 * This cannot be caught by `npm run dev`; see assetUrl.js.
 */
export default function Media({
  kind = 'image',
  src,
  poster,
  alt,
  label,
  placeholderAspect,
  maxWidth,
  caption,
  className = '',
}) {
  // null until the file reports its own dimensions. Once set, it wins.
  const [naturalRatio, setNaturalRatio] = useState(null)

  // `maxWidth` is the design's display width (see MEDIA_WIDTH in
  // caseStudyLayout.js). It caps how large the media is drawn WITHOUT touching
  // its proportions -- the ratio below is still the file's own, so nothing is
  // cropped or squashed; the box simply stops growing. Both of Flore's rules
  // therefore hold at once: standard sizing from the design, and screencasts
  // (portrait 1432x1660) never cropped into a landscape frame.
  //
  // LEFT-ALIGNED within its block, like everything else on the page.
  //
  // This was briefly `mx-auto`, on the theory that Figma insets each asset in
  // its stage. Measured, that was wrong twice over: Figma puts the momentum
  // curve at x=0 of its frame (it only looked inset because a legend sat to its
  // right, and the build spec cuts that legend), and centring a 722-wide image
  // in the 1184 block pushed its left edge 231px in from the text above it --
  // visibly breaking the single left edge Flore asked for.
  //
  // FeatureBlock is the one place Figma genuinely centres its media, inside the
  // 617 VisualFrame. Left-aligning there too is a deliberate divergence for
  // consistency: one rule for the whole page beats a per-block exception, and
  // the media sits nearer its own text as a result. Flagged.
  const frame = (
    <div
      className={`w-full overflow-hidden rounded-radius-24 ${className}`}
      // The real ratio as soon as it's known; the declared one only before that.
      style={{ aspectRatio: naturalRatio ?? placeholderAspect, maxWidth }}
    >
      {!src ? (
        // Reuses the site's existing placeholder convention (dashed grey +
        // centred label). The label carries the intended filename, so a missing
        // asset is self-documenting on the page rather than an empty gap.
        <ImagePlaceholder className="h-full w-full" label={label} />
      ) : kind === 'video' ? (
        <video
          src={assetUrl(src)}
          poster={poster ? assetUrl(poster) : undefined}
          // Fires as soon as the dimensions are known, well before the video is
          // playable — which is exactly when we want to adopt the real ratio.
          onLoadedMetadata={(event) => {
            const { videoWidth, videoHeight } = event.currentTarget
            if (videoWidth && videoHeight) setNaturalRatio(videoWidth / videoHeight)
          }}
          // Per the asset contract: muted + autoplay + loop + playsinline, no
          // player chrome. `muted` is what makes autoplay legal at all in every
          // current browser; without it the video silently won't start.
          autoPlay
          muted
          loop
          playsInline
          // metadata, not auto: these sit below the fold and shouldn't compete
          // with the page for bandwidth before the reader is near them. It is
          // also what makes onLoadedMetadata fire without downloading the file.
          preload="metadata"
          // A looping, silent, chrome-less demo is decorative in the a11y sense
          // -- the caption carries the meaning -- but it still needs a name for
          // anyone who lands on it, hence aria-label rather than aria-hidden.
          aria-label={alt}
          className="block h-full w-full object-contain"
        />
      ) : (
        <img
          src={assetUrl(src)}
          alt={alt}
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget
            if (naturalWidth && naturalHeight) setNaturalRatio(naturalWidth / naturalHeight)
          }}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-contain"
        />
      )}
    </div>
  )

  if (!caption) return frame

  return (
    <figure className="m-0 flex flex-col gap-space-12">
      {frame}
      {/* `tight` from the three-step spacing scale: evidence -> its caption. */}
      <figcaption className="text-center text-body-sm font-normal text-text-secondary">
        {caption}
      </figcaption>
    </figure>
  )
}
