import avatarSectionsLeft from '../assets/illustrations/avatar-sections-left.svg'
import avatarSectionsRight from '../assets/illustrations/avatar-sections-right.svg'

// The `hero` variant is gone: the hero now renders AvatarPresentingIdle
// mirrored (see Hero.jsx). The import was dropped rather than left dangling,
// because an unconditional import keeps the 28KB avatar-hero.svg in the bundle
// even though nothing references it — verified it was still being emitted.
// The asset file itself stays in the repo, so reverting is a one-line change.
const AVATAR_IMAGE = {
  'sections-left': avatarSectionsLeft,
  'sections-right': avatarSectionsRight,
}

// The sections avatars render at their natural size; only the hero was ever
// sized here, and the hero no longer uses this component. Its old 70/108 pair
// carried over to AVATAR_WIDTH.hero in AvatarPresentingIdle, so the hero avatar
// is the same width it has always been.
//
// SHARED COMPONENT — additive change, 2026-08-14, same pattern as
// SpeechBubble's `maxWidth`. `width` is undefined by default, which emits no
// style attribute at all, so every homepage call site renders byte-identically
// and the map and wayfinding rows cannot regress. It exists because the
// case-study Guide is drawn larger than the homepage one (Flore's call) — the
// natural size is 80x75 and both surfaces were rendering at exactly that.
//
// `height: auto` is set alongside so the SVG scales on its own ratio rather
// than stretching; without it the intrinsic 75 would be kept against a wider
// box.
export default function Avatar({ variant = 'sections-left', width, className = '' }) {
  return (
    <img
      src={AVATAR_IMAGE[variant]}
      alt=""
      data-avatar-variant={variant}
      className={className}
      style={width ? { width, height: 'auto' } : undefined}
    />
  )
}
