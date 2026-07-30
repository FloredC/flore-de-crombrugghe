import avatarHero from '../assets/illustrations/avatar-hero.svg'
import avatarSectionsLeft from '../assets/illustrations/avatar-sections-left.svg'
import avatarSectionsRight from '../assets/illustrations/avatar-sections-right.svg'

const AVATAR_IMAGE = {
  hero: avatarHero,
  'sections-left': avatarSectionsLeft,
  'sections-right': avatarSectionsRight,
}

export default function Avatar({ variant = 'hero' }) {
  return <img src={AVATAR_IMAGE[variant]} alt="" data-avatar-variant={variant} />
}
