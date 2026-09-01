import { useEffect, useRef, useState } from 'react'

import { WAYFINDING_AVATAR_WIDTH } from '../lib/layout'

/**
 * The Plaza — Design Principles wayfinding avatar: hand on heart, blinking.
 *
 * Inline SVG rather than <img> so the named parts can be animated; the source
 * asset is committed unchanged at src/assets/illustrations/avatar-principles.svg.
 * Structure kept as exported, minus the two outer Figma frame wrappers (no
 * transform, defs, clipPath or mask anywhere, so nothing was lost and no id
 * resolves through url(#…)).
 *
 *   halo          static circle, behind everything
 *   arm-motion    the gesturing arm — ROTATED about the shoulder
 *   arm-static    the other arm; never moves
 *   torso, head, hair            static
 *   eyes-open / eyes-closed      the blink pair
 *
 * Sublayers inside those groups keep Figma's auto-generated `Vector NNNN`
 * names. They are left alone on purpose: nothing addresses them, and Figma
 * reissues ids for layers inside a group whenever the group changes, so a
 * selector pointing at one would break by itself.
 *
 * REWRITTEN 2026-09-01, MECHANISM CHANGED. This avatar used to swap between two
 * drawn poses (#arm-rest / #arm-lift) with a 140ms crossfade. Flore re-exported
 * it with a single #arm-motion layer to be rotated instead — the same shape as
 * the talks avatar. Rotation is the better mechanism for a rigid swing: it
 * tweens rather than cutting, needs no crossfade, and cannot show a double
 * image. Do not reintroduce the two-pose version.
 *
 * The same re-export also fixed the two things that had been flagged against
 * this drawing:
 *
 *   LIVE STROKES, NOT OUTLINES. 54 paths, 0 filled — where the previous export
 *   was 23 filled outlines. That is what made STROKE_WIDTH below possible; the
 *   outlined version had no stroke property to set.
 *
 *   SIZE. 60KB to 23KB, because outlining a stroke roughly triples its points.
 *
 * If the drawing is re-exported: re-paste the geometry AND re-derive the
 * transform origin. It is an anatomical point in viewBox units and does not
 * survive a re-export — this drawing has needed it on four separate exports,
 * including ones where the edit was somewhere else entirely.
 */
// Line weight of the figure, overriding the ~1.37-1.42 in the exported asset.
//
// 0.95 everywhere. 1.05 was chosen on 2026-09-01 from a rendered comparison of
// the whole set at 1.05 / 1.25 / 1.44; Flore asked for "a bit thinner" once the
// avatars were rendering larger too, and 0.95 is that.
//
// WHAT THE NUMBER MEANS IN REAL PIXELS, since a viewBox unit is not a pixel and
// these now render at three sizes:
//
//     render    1 unit     0.95 units
//      96px     0.897px     0.85px
//     106px     0.991px     0.94px
//     118px     1.103px     1.05px
//
// The floor note in AvatarPresentingIdle -- "below one device-independent pixel
// the stroke anti-aliases to grey and the drawing goes soft" -- was written when
// these rendered at 96px. At 118 there is more headroom than it implies, but at
// the 106 and 96 steps 0.95 does sit just under 1px. Fine on any 2x display;
// the 1x case is what to look at before going thinner again.
//
// It is a DECISION, not a divergence (Flore, 2026-09-01): all
// five avatars were re-exported with live strokes, the whole set was rendered
// at 1.05 / 1.25 / 1.44 side by side, and 1.05 -- the weight AvatarRega and
// AvatarPresentingIdle already shipped at -- was chosen. It is the same
// constant, with the same name, in all five components; change it in one and
// the set no longer matches.
//
// The halo keeps its own lighter 1.00824 from the asset and is untouched.
//
// This still differs from Figma, which draws ~1.44. If that ever gets set to
// 1.05 in the design file, these five constants can all come out.
const STROKE_WIDTH = 0.95

// `width` overrides the responsive class with an explicit px value, for the one
// caller whose width is sampled per-page rather than shared: the case-study
// Guide (see GUIDE_AVATAR_WIDTH in caseStudyLayout.js). It mirrors the prop
// AvatarPresentingIdle already had, including `height: auto` so the drawing
// scales on its own ratio instead of keeping the intrinsic height against a
// wider box. Undefined by default, so it emits no style attribute and every
// homepage call site renders byte-identically.
export default function AvatarPrinciples({ width, className = '' }) {
  const ref = useRef(null)
  // Paused until the row is actually on screen. Starting paused rather than
  // running-then-pausing avoids a frame of motion for a row far below the fold.
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <svg
      ref={ref}
      data-component="avatar-principles"
      data-animate={inView ? 'true' : 'false'}
      viewBox="0 0 107 93"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      // h-auto + the viewBox keeps the aspect ratio exact, so nothing stretches
      // and the box is reserved before paint -- no layout shift.
      className={`${width ? '' : WAYFINDING_AVATAR_WIDTH} h-auto shrink-0 ${className}`}
      style={width ? { width, height: 'auto' } : undefined}
    >
      <circle id="halo" cx="66.1035" cy="43.9736" r="39.4959" stroke="#D2D2D2" strokeWidth="1.00824" />
      {/* Torso motion. Three nested wrappers so each axis composes independently
          AND so none of them collides with the gesture transforms on the parts
          inside -- two animations on one element both writing `transform` would
          fight, and the later one would win outright. See the shared block in
          globals.css. */}
      <g className="avatar-sway"><g className="avatar-bob"><g className="avatar-breath">
      <g id="head">
        <path id="Vector 3287" d="M56.2604 22.1887C56.2343 22.1887 56.2081 22.1887 56.1537 22.2477C56.0024 22.412 55.8122 23.3266 55.6272 24.74C55.4847 25.8281 55.5696 26.4591 55.6909 27.2105C55.7886 27.8161 56.0019 28.87 56.2356 29.8072C56.6694 31.5469 57.0759 32.778 57.2129 33.4894C57.3613 34.2601 58.0571 35.763 58.8557 37.1264C59.5965 38.3912 60.4066 39.1855 60.6736 39.4368C61.1697 39.9037 62.7035 40.2465 63.809 40.47C65.1421 40.7394 66.8472 39.6084 67.1261 39.4283C67.6275 39.1044 68.7141 37.8245 69.6213 36.679C70.6434 35.3886 71.1437 34.024 71.4074 33.303C71.5574 32.8928 71.6711 32.3689 71.8432 31.5103C72.0153 30.6517 72.2247 29.4682 72.3358 28.6635C72.447 27.8587 72.4535 27.4686 72.4095 26.666C72.3654 25.8634 72.2705 24.6602 72.1382 23.5224C72.0059 22.3846 71.839 21.3486 71.6671 20.2812" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3290" d="M62.209 31.4579C62.1828 31.4513 62.1566 31.4448 62.1333 31.5168C61.8871 32.2781 62.1128 33.324 62.1918 33.6215C62.2297 33.764 62.297 33.8796 62.3895 33.9781C62.482 34.0766 62.6063 34.152 62.7211 34.1925C62.8358 34.2329 62.9373 34.2362 63.0713 34.21C63.2053 34.1839 63.3689 34.1281 63.4974 34.0715C63.6258 34.015 63.7141 33.9592 63.8052 33.9018" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3294" d="M63.4824 36.9951C63.4872 36.9951 63.5775 37.0332 63.7475 37.0957C63.9033 37.1296 64.098 37.1394 64.3148 37.1275C64.4128 37.1156 64.4864 37.0918 64.6271 37.0312" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g id="eyes-closed">
        <path id="Vector 3288" d="M58.5912 28.7356C58.5552 28.7356 58.5192 28.7356 58.4532 28.7503C58.3872 28.7651 58.2923 28.7946 58.322 28.8131C58.5087 28.8381 58.7817 28.8383 59.2104 28.7546C59.5278 28.6775 60.048 28.5299 60.5839 28.3779" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3289" d="M65.1055 27.5047C65.3618 27.4982 65.857 27.439 66.7114 27.2671C67.4171 26.9825 67.8541 26.7436 68.0371 26.6429C68.1284 26.5881 68.2167 26.5258 68.4366 26.4219" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g id="arm-static">
        <path id="Vector 3249" d="M81.135 59.6465C81.1251 59.6465 81.1151 59.6465 81.08 59.6752C80.9809 59.7565 81.3523 60.9147 82.0369 62.6462C82.3492 63.4363 82.6538 63.935 83.0634 64.5774C83.6025 65.4226 84.1427 66.1186 84.5862 66.8947C84.7414 67.1662 84.806 67.3847 84.9013 67.5407C85.0212 67.7368 85.2483 67.9519 85.4722 68.1861C85.7726 68.5003 85.7802 68.8826 85.9979 69.1909C86.2104 69.4918 86.2538 69.7617 86.3443 69.9051C86.3891 69.9761 86.4149 70.0536 86.3929 70.1146C86.3443 70.2497 85.6706 70.5218 84.6564 71.0216C83.7981 71.4445 83.3021 71.8005 82.9309 71.9714C81.8255 72.4807 80.9968 72.8624 80.1235 73.179C79.832 73.2846 79.6602 73.3954 79.406 73.5685C78.945 73.8824 77.9344 74.4372 76.7204 74.9718C75.7321 75.4071 75.2572 75.6706 74.7334 76.0465C74.392 76.2916 73.9652 76.4003 73.6123 76.5345C73.2418 76.6379 72.8448 76.7841 72.518 76.8803C72.4359 76.8957 72.3486 76.9007 72.2285 76.9285" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3250" d="M72.6286 76.6944C72.4908 76.6744 72.2467 76.6565 72.0547 76.6928C71.8209 76.7371 71.4128 76.9905 70.8225 77.3465C70.2185 77.7107 69.4581 78.3757 68.3041 79.3014C67.6496 79.8264 66.7811 80.367 66.1836 80.7315C64.8464 81.5474 64.2511 81.8398 63.6774 82.1333C62.3005 82.8378 61.7393 82.8203 61.2497 83.1118C60.9917 83.2654 60.5804 83.5621 60.3447 83.745C60.109 83.928 60.0691 84.0004 60.0747 84.0739C60.0803 84.1475 60.1327 84.2199 60.2157 84.3047C60.4014 84.4943 60.6039 84.6322 60.7858 84.7366C61.0109 84.8659 61.2932 84.9427 61.5733 85.0044C62.5007 85.2089 64.0374 84.9819 64.9626 84.8125C65.1812 84.7724 65.3701 84.722 65.4278 84.7138C65.4603 84.7091 65.2587 84.8389 65.1381 84.9811C65.0777 85.0522 65.0374 85.1357 65.0355 85.2156C65.0335 85.2955 65.0759 85.373 65.1401 85.4279C65.2043 85.4827 65.2891 85.5127 65.4425 85.5269C65.8138 85.5613 66.298 85.4886 66.7518 85.3929C67.5851 85.2173 68.4536 84.6286 69.2351 84.4164C69.7456 84.2779 70.2245 83.9223 70.6199 83.7414C71.2174 83.5455 71.5021 83.4295 71.8424 83.2478C72.1004 83.106 72.5317 82.8637 72.9761 82.6141" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3667" d="M82.2402 47.1992C83.4485 48.2473 85.1964 49.5118 86.0679 50.5482C86.6172 51.2014 87.1741 52.1239 87.7997 53.08C88.3396 53.9052 88.8717 54.5161 89.4706 55.4896C90.5452 57.2363 91.219 58.6141 91.5196 59.2013C91.9765 60.0939 92.4683 61.048 92.951 62.228C93.6804 64.0108 94.1843 65.4395 94.4418 65.9958C94.6002 66.3575 94.7694 66.827 95.11 67.9711C95.3365 68.7795 95.6716 70.0502 96.0861 71.556" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3668" d="M73.4465 76.1816C73.4123 76.1816 73.378 76.1816 73.4194 76.2618C74.1079 77.0108 75.1142 77.895 75.5872 78.476C75.8812 78.87 76.2849 79.4653 76.8162 80.3908" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3669" d="M73.1113 82.6462C73.2256 82.6158 73.8155 82.3168 74.5206 81.9517C75.1785 81.6109 75.9086 81.0404 76.3449 80.7086C76.5449 80.5564 76.7644 80.415 77.0423 80.3168C77.8679 80.0252 78.779 79.9063 79.5934 79.5774C80.3117 79.2874 81.5082 78.9863 83.5676 78.3529C84.7417 77.9919 86.193 77.4656 87.6241 76.8475C88.5684 76.4396 89.1459 76.2794 89.5334 76.0853C89.9415 75.881 91.2979 74.9145 93.1282 73.6219C94.1716 72.885 94.5422 72.4073 94.9739 72.0032C95.082 71.9084 95.1963 71.8092 95.3046 71.697C95.413 71.5849 95.512 71.4628 95.7871 71.0479" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g id="hair">
        <path id="Vector 3679" d="M63.9805 19.1147C64.1444 19.1059 65.042 19.0939 65.6444 19.1543C66.0258 19.1925 66.4996 19.4797 67.7062 20.2967C68.17 20.6108 68.4398 20.9049 68.6548 21.1248C68.9557 21.4324 69.3904 22.3272 69.8351 23.3727C69.968 23.7291 70.0982 24.0615 70.3607 24.8353C70.5502 25.4336 70.8539 26.4491 71.1669 27.4954" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3680" d="M64.2441 16.9957C64.25 16.9957 64.3435 16.9781 64.542 16.9574C65.4429 16.8632 66.796 17.5241 67.3192 17.7235C67.9472 17.9629 68.5225 18.5021 69.1346 18.7787C69.8921 19.3684 70.9917 20.4459 71.4719 21.2471C71.7298 21.7517 72.1883 22.6765 72.6607 23.6293" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3681" d="M71.2461 19.585C71.3308 19.7402 71.6488 20.3063 72.1358 21.7631C72.4045 22.567 72.714 23.9617 73.1034 26.1586C73.4928 28.3554 73.9075 31.3259 74.1343 33.8015C74.3611 36.277 74.3874 38.1676 74.3922 39.2469C74.3969 40.3262 74.3794 40.5369 74.3525 40.7895" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3682" d="M72.0332 32.2764C72.0332 32.3056 72.039 32.4407 72.0902 32.9825C72.1356 33.4043 72.2203 34.1242 72.318 35.3306C72.4156 36.5371 72.5237 38.2081 72.6439 39.9831" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3683" d="M69.4762 37.252C69.4353 37.2929 69.3944 37.3339 69.3631 37.4062C69.3318 37.4785 69.3114 37.581 69.3125 37.9747C69.3137 38.3684 69.3371 39.0503 69.3611 39.7529" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3684" d="M62.4326 19.2676C62.3978 19.2676 62.363 19.2676 62.3056 19.2792C62.1678 19.3071 61.7472 19.5798 60.9985 20.1436C60.0969 20.8227 59.5098 21.4168 59.2699 21.6829C58.9561 22.031 58.5951 22.926 57.6951 24.4036C57.3239 25.013 56.6301 25.8641 56.2108 26.4062C55.7915 26.9483 55.6245 27.1273 55.3204 27.409C55.0163 27.6906 54.5802 28.0695 54.1309 28.4599" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3685" d="M62.5453 17.5479C62.4803 17.5618 62.3564 17.5946 62.1834 17.6496C62.0289 17.7115 61.8527 17.8078 61.5751 17.9924C61.3996 18.1142 61.1537 18.2932 60.9004 18.4776" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3686" d="M61.3701 18.3584C61.3678 18.3584 61.3655 18.3584 61.3249 18.37C61.2054 18.4049 60.5651 19.0867 59.435 20.439C58.864 21.1336 58.298 21.8448 57.7148 22.5777" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3687" d="M55.8552 24.0859C55.8088 24.1138 55.7625 24.1417 55.7212 24.1875C55.6323 24.2859 55.3958 24.8465 54.9739 25.7615C54.603 26.5658 54.1794 27.1942 53.8217 27.7075C53.6496 27.9441 53.4965 28.1324 53.1961 28.449C52.8956 28.7657 52.4526 29.205 51.9961 29.6577" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3688" d="M63.1914 18.563C63.2679 18.5468 64.4071 18.4998 65.1211 18.5381C65.259 18.5767 65.4884 18.6657 65.8794 18.8399C66.1103 18.9466 66.4072 19.0908 66.7131 19.2392" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3689" d="M62.6641 17.6475C62.7012 17.6823 62.7383 17.7172 62.8026 17.7538C62.9518 17.8385 63.445 17.8658 63.9395 17.8973C64.6662 18.09 65.6327 18.4469 66.0367 18.7216C66.1447 18.8109 66.2723 18.9248 66.4037 19.0422" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3690" d="M61.9752 18.6822C61.9242 18.6822 61.8028 18.724 61.7051 18.763C61.9697 18.6146 62.2853 18.4504 62.5695 18.3285C62.6983 18.2763 62.7957 18.2438 63.0648 18.168" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3691" d="M65.7788 18.5137C65.7324 18.523 65.686 18.5323 65.7317 18.5545C66.3916 18.8755 67.3502 18.6262 67.5184 18.6834C67.9214 18.8207 69.2043 19.8709 69.9756 20.5085C70.5459 20.9801 71.2167 22.1496 71.5847 22.6742C71.9451 23.1879 72.2165 23.7989 72.557 24.4103C73.0638 25.3205 73.5126 25.9322 73.9175 26.4289C74.8141 27.4882 75.4855 28.2546 75.677 28.4208C75.785 28.5103 75.9149 28.6103 76.1471 28.7766" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3692" d="M55.0587 33.874C55.0636 33.8789 55.0685 33.8838 55.1115 33.8703C55.1546 33.8569 55.2356 33.8249 55.2822 33.7678C55.3289 33.7108 55.3387 33.6296 55.3438 33.5324C55.3488 33.4352 55.3488 33.3245 55.2015 34.099C55.0542 34.8736 54.7596 36.5368 54.5844 37.4809C54.4093 38.425 54.3627 38.5997 54.2402 38.9512" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3693" d="M55.3264 31.8682C55.3264 31.878 55.3264 31.8878 55.3227 32.0516C55.319 32.2154 55.3116 32.5328 55.3324 33.0518C55.3532 33.5708 55.4023 34.2818 55.4529 35.0144" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3694" d="M57.8789 37.8841C57.8789 37.8668 57.8789 37.8496 57.928 38.1458C57.9771 38.442 58.0753 39.0522 58.1765 39.6808" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3695" d="M58.7874 38.3838C58.7677 38.4822 58.7576 38.6461 58.7932 38.8828C58.9 39.1367 59.0298 39.3424 59.1473 39.4763C59.2083 39.5389 59.2722 39.5906 59.3826 39.6736" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3225" d="M66.1172 16.5459C66.1172 16.4967 66.1172 16.4476 66.1646 16.3911C66.2121 16.3346 66.3069 16.2723 66.418 16.2632C67.5644 16.1688 69.1975 17.6234 69.7751 18.1186C70.327 18.5916 70.8484 19.9473 71.9102 21.8746C72.1736 22.3529 72.329 22.8115 72.6234 24.067C72.8425 25.0014 73.0847 26.565 73.2589 27.7361C73.4332 28.9071 73.5019 29.6448 73.5896 30.3788C73.6774 31.1129 73.7821 31.821 73.8899 32.5506" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3227" d="M61.0818 17.977C61.0262 17.9409 60.9706 17.9048 60.8683 17.8912C60.7661 17.8775 60.6188 17.8874 60.4694 17.9465C59.5443 18.3127 58.6919 19.461 58.1623 20.0906C57.9063 20.395 57.7186 20.7602 57.5306 21.1153C57.3562 21.4447 56.8792 22.9999 56.1939 25.3124C55.918 26.2434 55.8521 26.7004 55.8034 27.4088C55.7547 28.1173 55.7416 29.068 55.7725 29.8955C55.8786 31.3983 56.0151 32.3957 56.1321 32.938C56.1902 33.1786 56.2459 33.3491 56.4221 33.5744" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3228" d="M58.1082 18.9404C58.0689 18.9404 57.9309 18.9404 57.6887 18.9978C57.5553 19.0294 57.4366 19.1699 57.2466 19.4585C56.7698 20.1824 56.4077 21.0396 56.1422 21.7926C55.8648 22.5791 55.7232 24.053 55.5352 26.0504C55.3619 27.8911 55.257 29.2579 55.0137 30.4418C54.425 33.3071 54.0545 33.8134 53.7735 34.2664C53.6186 34.4337 53.384 34.6261 53.1199 34.8573C53.0096 34.9706 52.9475 35.0755 52.8438 35.4319" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3229" d="M57.8308 19.0695C57.7588 19.0925 57.6868 19.1154 57.6825 19.083C57.6644 18.9487 57.9516 18.7299 58.2302 18.4654C58.4845 18.2241 58.7712 18.0537 59.125 17.8754C59.6137 17.6292 60.0765 17.5234 60.3519 17.4638C60.5978 17.4305 60.8565 17.4335 61.14 17.4599C61.2828 17.4732 61.4235 17.4863 61.7072 17.4998" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3232" d="M56.125 30.5137C56.125 30.6055 56.125 30.797 56.1659 32.0909C56.2068 33.2405 56.2886 35.3912 56.3258 36.7794C56.363 38.1676 56.3532 38.7282 56.3431 39.3058" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3233" d="M57.4121 33.9814C57.4121 34.1323 57.4121 34.2831 57.4137 34.5755C57.4154 34.8679 57.4187 35.2974 57.4596 35.9186C57.5005 36.5398 57.5791 37.3398 57.66 38.1639" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3234" d="M54.1797 34.002C54.1732 34.0479 54.1666 34.0937 54.0651 34.8534C53.9636 35.6131 53.7673 37.0851 53.5254 38.7706" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3236" d="M71.3741 34.875C71.3512 34.875 71.3283 34.875 71.3116 34.9422C71.2851 35.1438 71.2881 36.4953 71.3128 38.3906C71.3245 39.0729 71.3343 39.1876 71.4733 39.5443" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3237" d="M73.9299 32.0342C73.9299 32.0473 73.8939 32.2245 73.8426 32.6566C73.7709 33.2615 74.0729 34.7908 74.4625 36.6625C74.6198 37.367 74.6951 37.5735 74.7649 37.7275C74.8347 37.8814 74.8969 37.9765 75.0403 38.144" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g id="torso">
        <path id="Vector 3662" d="M56.0684 43.5263C56.4109 43.5339 58.0214 43.4807 59.9508 43.432C60.4899 43.4184 60.9392 43.3606 61.4061 43.3147C61.5987 43.2958 61.6864 43.1926 61.7487 43.0788C61.8919 42.5065 61.9839 41.9711 62.1104 41.5521C62.1836 41.3353 62.2749 41.1102 62.473 40.6816" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3665" d="M68.0234 39.0977C68.0423 39.2617 68.2492 39.8696 68.6719 40.8785C68.9673 41.5835 69.4874 42.3429 69.8434 42.9846C70.0338 43.3276 70.1731 43.6296 70.2959 43.841C70.3585 43.9489 70.4187 44.0601 70.5662 44.1304C70.946 44.2275 71.5243 44.3237 72.1064 44.4507C72.3495 44.509 72.4866 44.5548 72.8702 44.8101" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3670" d="M80.9243 59.8428C80.871 59.8428 80.8177 59.8428 80.7731 59.921C80.6505 60.1361 80.438 61.3319 80.0348 63.1103C79.7508 64.363 79.4485 65.3612 79.2467 66.2142C79.1013 67.755 79.131 70.0484 79.2659 70.9725C79.3007 71.2938 79.3388 71.7593 79.378 72.239" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3672" d="M46.4004 48.4314C46.5006 48.2549 46.8043 48.0497 47.1802 47.7017C48.039 46.9066 49.1898 46.3969 50.092 45.7933C50.6266 45.4356 51.9192 44.8185 52.9007 44.4792C53.5742 44.3288 54.1284 44.1708 54.4545 44.0803C54.6207 44.0395 54.7883 44.009 54.9609 43.9775" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3676" d="M47.6828 74.4268C47.08 75.9218 46.9579 76.6236 46.8705 77.2233C46.8505 77.3606 46.8378 77.4726 46.8466 77.5879C46.8644 77.8214 46.9786 78.0527 47.109 78.2851C47.4352 78.8666 48.2474 79.4706 48.7274 79.8317C49.6481 80.5242 51.7858 80.813 52.6499 81.0712C53.924 81.452 54.6257 81.6694 55.429 81.921C57.4513 82.5545 58.5461 83.0085 59.1759 83.2021C59.4409 83.2641 59.772 83.3045 60.2518 83.3282C60.5265 83.3374 60.8647 83.341 61.3003 83.3229" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3677" d="M67.1312 64.2607C67.1097 64.2968 67.0881 64.3328 67.1021 64.4073C67.2059 64.9565 67.8815 65.5435 68.4842 66.2136C69.2898 67.1094 70.9932 67.5727 71.9011 67.8194C72.2717 67.9201 72.7103 67.9276 73.1549 67.9059C73.6746 67.7715 74.3402 67.5249 75.1259 67.1304C75.3944 66.9616 75.7758 66.7021 76.1687 66.4346" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3696" d="M55.6011 44.0367C55.5319 43.9595 55.4627 43.8822 55.4192 43.8781C55.3757 43.874 55.3598 43.9453 55.3744 44.0414C55.4488 44.532 55.8864 45.1175 56.3833 45.7436C56.7914 46.2578 57.3083 46.62 57.6657 46.8945C58.0237 47.1694 58.6949 47.5232 59.8028 48.034C60.4349 48.3253 61.2547 48.5764 61.8994 48.7717C62.5441 48.9671 63.0007 49.072 63.6035 49.1836C64.2064 49.2951 64.9416 49.4099 65.4113 49.4751C66.0612 49.5652 66.8866 49.5683 67.8835 49.5693C68.3094 49.5698 68.7757 49.4255 69.4339 49.2187C69.9869 49.0449 70.5282 48.5914 71.3847 47.8783C72.2583 47.1508 72.7217 46.5487 72.8961 46.3141C73.1116 45.9562 73.2591 45.5137 73.3622 45.2109C73.3911 45.1556 73.4287 45.1041 73.5572 45.033" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3666" d="M73.4577 44.3701C73.4234 44.3778 73.3891 44.3854 73.4324 44.4027C73.819 44.5571 74.6292 44.5431 75.4167 44.6184C76.3318 44.7059 77.5121 44.9353 78.3963 45.1711C78.9027 45.3061 79.288 45.3491 79.5144 45.3969C80.0134 45.5023 80.6352 45.9795 81.2835 46.3826C81.6924 46.778 81.9883 47.1136 82.2224 47.281C82.3384 47.3531 82.4471 47.561 82.5609 47.6082" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g id="arm-motion">
        <path id="Vector 3659" d="M34.2776 80.5141C34.3132 80.5172 34.4808 80.5093 34.8056 80.4698C35.8063 80.3482 37.2832 79.4986 38.7704 78.6965C39.5425 78.2801 40.3439 77.8343 43.165 75.8508C45.9861 73.8672 50.8011 70.3568 53.4128 68.436C56.739 65.9896 57.4509 65.3946 58.0322 64.9023C58.7226 64.3177 59.6428 63.5024 60.135 63.0754C60.2672 62.9684 60.4221 62.8424 60.5576 62.7305C60.6932 62.6187 60.8048 62.5248 61.0691 62.2775" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3660" d="M60.8779 62.4689C61.9877 62.4086 65.5549 62.1274 66.825 61.7915C67.2557 61.6776 68.5516 60.4099 70.4216 58.6959C71.8498 57.3869 72.2991 56.7921 72.7805 56.3728C72.8829 56.2836 72.9117 56.1391 72.867 56.0646C72.8223 55.9901 72.6836 55.9715 72.4932 56.0253C72.0648 56.2058 71.6111 56.4058 71.1939 56.5421C70.9854 56.6089 70.7834 56.6709 70.416 56.8047" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3661" d="M59.6247 57.4441C59.593 57.4357 59.5614 57.4272 59.5463 57.3722C59.5313 57.3172 59.5338 57.2159 59.6229 57.0715C60.3131 55.9537 61.6494 55.1 61.9896 54.6908C62.3084 54.3073 62.6581 53.8328 63.0325 53.4613C63.7946 52.7052 65.0498 52.1965 65.5374 52.0102C65.7555 51.9268 65.9896 51.9156 66.1804 51.9399C66.2724 51.9516 66.3328 52.0496 66.3621 52.1464C66.4238 52.3499 66.3252 52.6768 66.2197 53.0363C66.0337 53.6702 65.3707 54.1769 64.7563 54.7391C64.6253 54.8591 64.568 54.939 64.5164 55.0316C64.4648 55.1242 64.424 55.2306 64.4141 55.3301C64.4042 55.4296 64.4265 55.519 64.4813 55.5813C64.5362 55.6436 64.6231 55.6761 64.7152 55.6886C64.9004 55.7136 65.9735 55.4195 67.6203 54.9896C68.6269 54.7268 69.316 54.6671 70.019 54.5632C71.3991 54.3594 72.2155 54.237 72.8136 54.2835C72.9341 54.2929 73.0612 54.3435 73.1687 54.3815C73.2761 54.4196 73.3578 54.46 73.4041 54.5283C73.4503 54.5966 73.4588 54.6915 73.4157 54.791C72.8882 55.2988 71.8273 55.999 71.0386 56.4935C70.7185 56.6997 70.5613 56.815 70.3992 56.9339" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3671" d="M57.487 58.7666C57.409 58.7406 57.331 58.7147 57.2731 58.7725C57.1168 58.9287 57.1131 59.4655 57.0679 60.0702C57.1487 61.2921 57.5101 63.2427 57.8336 64.0359C57.9138 64.1621 57.9944 64.2458 58.0774 64.332" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3673" d="M46.3046 48.4512C46.1667 48.6594 45.4793 49.656 43.9691 52.185C43.01 53.7908 41.5562 55.9885 40.5064 57.6629C39.4566 59.3373 38.8282 60.4058 38.2722 61.3015C37.7163 62.1973 37.2517 62.888 36.5706 63.9765C35.8895 65.065 35.006 66.5303 34.4138 67.5657C33.0329 69.9798 32.7394 71.0464 32.5386 71.6247C32.2255 72.5264 31.9431 74.0203 31.8168 75.1381C31.6644 76.4866 31.8682 77.5742 31.9468 77.9493C32.0135 78.2676 32.3088 78.6987 32.6928 79.2241C33.0006 79.6007 33.2712 79.8647 33.5227 80.0686C33.6408 80.1619 33.7399 80.2344 33.9457 80.3322" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3674" d="M37.7034 67.3316C37.6498 67.3768 37.5961 67.4219 37.6294 67.4255C37.7877 67.443 39.0763 66.475 41.0169 65.0403C42.1153 64.2282 43.2709 63.6331 44.5233 62.9905C45.7472 62.3625 47.8025 61.813 48.8246 61.4934C49.4187 61.3076 50.282 61.2448 52.0224 60.5941C53.576 60.0131 54.0827 59.7621 54.6491 59.5136C55.1764 59.2822 55.7084 59.0572 56.1478 58.7858C56.3871 58.6676 56.6271 58.587 56.8594 58.5283C56.9788 58.4942 57.101 58.4512 57.4345 58.2859" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3697" d="M57.6543 58.8431C57.6936 58.7877 57.984 58.5721 58.5294 58.1508C58.841 57.8817 59.0889 57.6794 59.2582 57.5745C59.3405 57.5291 59.4157 57.4994 59.493 57.4688" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g id="eyes-open">
        <path id="Vector 3292" d="M66.2273 26.6192C66.2227 26.6192 66.1697 26.6837 66.0987 26.8207C66.0641 26.8875 66.0899 26.9716 66.1165 27.0604C66.1432 27.1492 66.1846 27.246 66.2312 27.2694C66.2779 27.2927 66.3285 27.2397 66.3569 27.0695C66.4321 26.6183 66.3808 26.238 66.33 26.1434C66.3112 26.1086 66.2331 26.1849 66.1965 26.2629C66.16 26.341 66.1485 26.4402 66.1426 26.5431C66.1366 26.6461 66.1366 26.7498 66.1506 26.8916" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
        <path id="Vector 3293" d="M59.9102 27.4551C59.8228 27.7963 59.7732 28.0666 59.7765 28.1534C59.7933 28.584 59.8684 27.2211 59.8454 27.0797C59.8224 27.0606 59.7764 27.1482 59.7492 27.3178C59.7221 27.4875 59.7151 27.7365 59.8823 27.8882" stroke="#1E1E1E" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      </g></g></g>
    </svg>
  )
}
