import avatarHero from '../assets/illustrations/avatar-hero.svg'
import avatarSectionsLeft from '../assets/illustrations/avatar-sections-left.svg'
import avatarSectionsRight from '../assets/illustrations/avatar-sections-right.svg'

const AVATAR_IMAGE = {
  hero: avatarHero,
  'sections-left': avatarSectionsLeft,
  'sections-right': avatarSectionsRight,
}

// The hero avatar is 108px wide natively and drops to 70 below `lg`, per
// Flore. This is now the only thing shrinking the Guide -- the wrapper's
// scale transform was removed because it resized the Guide's type as a side
// effect (see Hero.jsx).
//
// Only the hero variant is sized here. The `sections-*` avatars belong to
// Wayfinding, which doesn't track the map at all.
const HERO_SIZE = 'w-[70px] lg:w-[108px]'

export default function Avatar({ variant = 'hero' }) {
  return (
    <img
      src={AVATAR_IMAGE[variant]}
      alt=""
      data-avatar-variant={variant}
      className={variant === 'hero' ? HERO_SIZE : undefined}
    />
  )
}
