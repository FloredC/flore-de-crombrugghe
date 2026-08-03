// Aspect ratio is a property of the ProjectCard size variant, not of the
// individual project -- confirmed with Flore. Every Medium instance in Figma
// (WelcomeCity, Pitchpivot, Rega, SAC, SBB, myRIDE) is the same box, likewise
// every Small (Sinomocene, Teamchatviz, Roche). Sampled from the ProjectImage
// component set, node 2928:78077.
//
// Previously this forced a single 16/10 on all three, which cropped every
// card -- most visibly Artifakt, whose artwork is 1.97 against a 1.60 box, so
// `object-cover` was shaving ~17% off the sides.
const IMAGE_ASPECT = {
  // 880 x 447
  large: '880 / 447',
  // 530 x 315.18 -- rounded to 315; the 0.06% difference is sub-pixel here.
  medium: '530 / 315',
  // 320 x 278
  small: '320 / 278',
}

// The artwork sits inset inside the media frame rather than filling it, which
// is what lets the frame's background tint show around it (Figma: frame 562
// wide vs image 530 on Medium, 977 vs 880 on Large). Exact insets get revisited
// in the layout-system pass; these are the sampled proportions.
const FRAME_PADDING = {
  large: 'px-space-48 py-space-32',
  medium: 'px-space-16 py-space-20',
  small: 'px-space-16 py-space-20',
}

export default function ProjectMedia({ src, alt, caption, size = 'medium', badge }) {
  const isLarge = size === 'large'

  return (
    <div
      data-component="project-media"
      data-size={size}
      className={`relative w-full min-w-0 overflow-hidden border border-dashed border-border-grey ${
        isLarge ? 'rounded-radius-32' : 'rounded-radius-20'
      }`}
    >
      <div className={`flex flex-col items-center justify-center gap-space-12 ${FRAME_PADDING[size]}`}>
        <img
          src={src}
          alt={alt}
          className="w-full object-cover"
          style={{ aspectRatio: IMAGE_ASPECT[size] }}
        />
        {caption && (
          <p data-component="project-media-caption" className="w-full text-center text-caption font-normal">
            {caption}
          </p>
        )}
      </div>
      {badge}
    </div>
  )
}
