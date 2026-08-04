import avatarHero from '../assets/illustrations/avatar-hero.svg'
import avatarSectionsLeft from '../assets/illustrations/avatar-sections-left.svg'
import avatarSectionsRight from '../assets/illustrations/avatar-sections-right.svg'

const AVATAR_IMAGE = {
  hero: avatarHero,
  'sections-left': avatarSectionsLeft,
  'sections-right': avatarSectionsRight,
}

// The hero avatar is 108px wide natively. It drops to 70 below `lg` per
// Flore -- and note it also sits inside the Guide's scale transform in the
// fit branch, so 70 renders at ~60 there and at a full 70 in the stacked
// branch below 768. Both land in the 60-70 she asked for.
//
// Only the hero variant is sized here. The `sections-*` avatars belong to
// Wayfinding, which doesn't scale with the map.
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
