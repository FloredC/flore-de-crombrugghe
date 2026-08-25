/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,mdx,md}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['HK Grotesk', 'sans-serif'],
      },
      // Fluid type, anchored on the two real Figma frames: each clamp hits its
      // Mobile/* style exactly at 402 and its Desktop/* style exactly at 1622,
      // and only interpolates between. Both ends are measured, not chosen.
      //
      // rem, not px: px ignores the reader's browser font-size setting, so the
      // site could not be scaled up by anyone who needs that. The vw term is
      // what makes it fluid; the rem term is what keeps it accessible.
      //
      // Breakpoint steps were rejected for the same reason Container's padding
      // is a clamp -- a step can run the value backwards at the boundary, a
      // clamp cannot.
      //
      // Sizes live here and nowhere else: a component writes `text-body` and
      // gets the right size at every width, with no `md:text-*` to drift.
      // Figma's styles also carry weight, which Tailwind's fontSize cannot, so
      // weight stays a separate class at the call site -- the one place the
      // token can't enforce the pairing. Check it against the style name.
      fontSize: {
        // 36 -> 48 (Desktop/h1 -> Desktop/display), Bold 700, line-height 1.2.
        //
        // The case-study hero title, and the only step whose mobile end is not
        // measured: Figma draws the subpage at 1622 only, so `Mobile/display`
        // does not exist -- there is no 402 frame to sample. Rather than invent
        // a value, the low anchor is Desktop/h1 (36), which IS a real Figma
        // size and the same move `h2` already makes at its own low end (see
        // below: it lands on Desktop/h3 at 402). So both ends are values Figma
        // actually defines, even though only the top one is defined *here*.
        //
        // Flagged to Flore: 36 at 402 is the judgement call in this file. If
        // the hero title reads too heavy on a phone, this anchor is the one to
        // move -- the 48 end is measured and should stay.
        //
        // Line height is 1.2, not the 1.4 the rest of the headings carry --
        // that is Figma's own `Desktop/display`, not a divergence.
        display: ['clamp(2.25rem, 2.0029rem + 0.9836vw, 3rem)', { lineHeight: '1.2' }],
        // 28 -> 36 (Mobile/h1 -> Desktop/h1), Bold 700
        h1: ['clamp(1.75rem, 1.5852rem + 0.6557vw, 2.25rem)', { lineHeight: '1.4' }],
        // 24 -> 28. At 402 this lands on Figma's Desktop/h3, which is what the
        // mobile card titles actually use -- same pixels, different style name.
        //
        // The desktop end is 28, not Figma's 32: Flore's call on 2026-08-04,
        // the card titles read too heavy at the wide breakpoints. Deliberate
        // divergence from the file; don't restore 32 on the next sample. Only
        // the top anchor moved -- 402 is unchanged, so the reduction lands
        // where it was asked for and mobile stays as designed.
        //
        // Shared by the ProjectCard titles and the Contact "Say Hi!" heading,
        // so both stepped down together rather than splitting the token.
        h2: ['clamp(1.5rem, 1.4176rem + 0.3279vw, 1.75rem)', { lineHeight: '1.4' }],
        // 16 -> 20 (Mobile/body -> Desktop/body-lg)
        //
        // Line height 1.6, not Figma's 1.5 -- Flore's call on 2026-08-04, for
        // readability in the long card descriptions, which are the main run of
        // prose on the page. Deliberate divergence from the file; don't
        // "correct" it back on the next sample.
        //
        // body-lg ONLY. This was briefly applied to `body` as well and Flore
        // reverted that -- `body` keeps Figma's 1.5.
        'body-lg': ['clamp(1rem, 0.9176rem + 0.3279vw, 1.25rem)', { lineHeight: '1.6' }],
        // 16 -> 18 (Mobile/body -> Desktop/body). Converges with body-lg at 402
        // -- deliberate, that's what the frames show.
        body: ['clamp(1rem, 0.9588rem + 0.1639vw, 1.125rem)', { lineHeight: '1.5' }],
        // 14 -> 16 (Mobile/body-sm -> Desktop/body-sm)
        'body-sm': ['clamp(0.875rem, 0.8338rem + 0.1639vw, 1rem)', { lineHeight: '1.4' }],
        // 12 -> 14 (Mobile/caption -> Desktop/caption)
        caption: ['clamp(0.75rem, 0.7088rem + 0.1639vw, 0.875rem)', { lineHeight: '1.4' }],
        // Flat 12. Figma has no Desktop/caption-sm -- 12 exists only as
        // Mobile/caption -- so there is no second anchor to clamp between.
        // Left fixed rather than inventing a smaller mobile value.
        'caption-sm': ['0.75rem', { lineHeight: '1.4' }],
      },
      colors: {
        // The one primitive exposed directly. Normally components reference the
        // semantic layer, but Figma has no semantic wrapper for this -- it's a
        // raw variable used by the two badges and nothing else. Exposing it here
        // is still better than the literal bg-white/[0.33] they used before,
        // which was a copy of the token's value living in two component files.
        'white-transparent': 'var(--white-transparent)',
        text: {
          primary: 'var(--colors-text-text-primary)',
          secondary: 'var(--colors-text-text-secondary)',
          inverted: 'var(--colors-text-inverted)',
        },
        border: {
          grey: 'var(--colors-border-grey)',
          divider: 'var(--colors-border-divider)',
        },
        surface: {
          background: 'var(--colors-surface-background)',
          canvas: 'var(--colors-surface-canvas)',
          // The Artifakt case study's stage colour -- hero background, every
          // image stage, the final-product panel. Hand-added to semantic.css
          // (see the comment there) rather than re-exported.
          highlight: 'var(--colors-surface-highlight)',
          subtle: 'var(--colors-surface-subtle)',
          inverted: 'var(--colors-surface-inverted)',
        },
        illustration: {
          foreground: 'var(--colors-illustration-foreground)',
        },
        focus: {
          ring: 'var(--colors-focus-ring)',
        },
        chart: {
          yellow: {
            fill: 'var(--colors-chart-chart-yellow-fill)',
            stroke: 'var(--colors-chart-chart-yellow-stroke)',
            text: 'var(--colors-chart-chart-yellow-text)',
          },
          blue: {
            fill: 'var(--colors-chart-chart-blue-fill)',
            stroke: 'var(--colors-chart-chart-blue-stroke)',
            text: 'var(--colors-chart-chart-blue-text)',
          },
          green: {
            fill: 'var(--colors-chart-chart-green-fill)',
            stroke: 'var(--colors-chart-chart-green-stroke)',
            text: 'var(--colors-chart-chart-green-text)',
          },
          red: {
            fill: 'var(--colors-chart-chart-red-fill)',
            stroke: 'var(--colors-chart-chart-red-stroke)',
            text: 'var(--colors-chart-chart-red-text)',
          },
          purple: {
            fill: 'var(--colors-chart-chart-purple-fill)',
            stroke: 'var(--colors-chart-chart-purple-stroke)',
            text: 'var(--colors-chart-chart-purple-text)',
          },
        },
        action: {
          primary: {
            surface: {
              DEFAULT: 'var(--colors-action-primary-surface-default)',
              hover: 'var(--colors-action-primary-surface-hover)',
              pressed: 'var(--colors-action-primary-surface-pressed)',
              disabled: 'var(--colors-action-primary-surface-disabled)',
            },
            foreground: {
              DEFAULT: 'var(--colors-action-primary-foreground-default)',
              hover: 'var(--colors-action-primary-foreground-hover)',
              pressed: 'var(--colors-action-primary-foreground-pressed)',
              disabled: 'var(--colors-action-primary-foreground-disabled)',
            },
            border: {
              DEFAULT: 'var(--colors-action-primary-border-default)',
              hover: 'var(--colors-action-primary-border-hover)',
              pressed: 'var(--colors-action-primary-border-pressed)',
              disabled: 'var(--colors-action-primary-border-disabled)',
            },
          },
          secondary: {
            foreground: {
              DEFAULT: 'var(--colors-action-secondary-foreground-default)',
              hover: 'var(--colors-action-secondary-foreground-hover)',
              pressed: 'var(--colors-action-secondary-foreground-pressed)',
              disabled: 'var(--colors-action-secondary-foreground-disabled)',
            },
            border: {
              DEFAULT: 'var(--colors-action-secondary-border-default)',
              hover: 'var(--colors-action-secondary-border-hover)',
              pressed: 'var(--colors-action-secondary-border-pressed)',
              disabled: 'var(--colors-action-secondary-border-disabled)',
            },
            surface: {
              hover: 'var(--colors-action-secondary-surface-hover)',
              pressed: 'var(--colors-action-secondary-surface-pressed)',
            },
          },
          accent: {
            foreground: {
              DEFAULT: 'var(--colors-action-accent-foreground-default)',
              hover: 'var(--colors-action-accent-foreground-hover)',
              pressed: 'var(--colors-action-accent-foreground-pressed)',
              disabled: 'var(--colors-action-accent-foreground-disabled)',
            },
            surface: {
              hover: 'var(--colors-action-accent-surface-hover)',
              pressed: 'var(--colors-action-accent-surface-pressed)',
            },
          },
          link: {
            foreground: {
              DEFAULT: 'var(--colors-action-link-foreground-default)',
              hover: 'var(--colors-action-link-foreground-hover)',
              pressed: 'var(--colors-action-link-foreground-pressed)',
              disabled: 'var(--colors-action-link-foreground-disabled)',
            },
          },
        },
      },
      // Named with a 'space-'/'radius-' prefix rather than bare numbers --
      // Tailwind's own default scale already uses numeric keys (e.g. `4` =
      // 1rem/16px), and reusing those same numbers here to mean a literal
      // pixel value (Figma's --spaces-4 = 4px) silently collided with and
      // overrode the default scale everywhere gap-4/p-4/etc. were used
      // (4x smaller than intended, sitewide). Use gap-space-4, p-radius-16,
      // etc. when a value needs to match a specific Figma token exactly;
      // otherwise Tailwind's default scale is unaffected.
      spacing: {
        'space-0': 'var(--spaces-0)',
        'space-2': 'var(--spaces-2)',
        'space-4': 'var(--spaces-4)',
        'space-8': 'var(--spaces-8)',
        'space-10': 'var(--spaces-10)',
        'space-12': 'var(--spaces-12)',
        'space-14': 'var(--spaces-14)',
        'space-16': 'var(--spaces-16)',
        'space-20': 'var(--spaces-20)',
        'space-24': 'var(--spaces-24)',
        'space-32': 'var(--spaces-32)',
        'space-40': 'var(--spaces-40)',
        'space-48': 'var(--spaces-48)',
        'space-60': 'var(--spaces-60)',
        'space-64': 'var(--spaces-64)',
        'space-72': 'var(--spaces-72)',
        'space-80': 'var(--spaces-80)',
        'space-100': 'var(--spaces-100)',
        'space-120': 'var(--spaces-120)',
        'space-128': 'var(--spaces-128)',
        'space-140': 'var(--spaces-140)',
        'space-144': 'var(--spaces-144)',
        'space-160': 'var(--spaces-160)',
        'space-176': 'var(--spaces-176)',
        'space-192': 'var(--spaces-192)',
        'space-200': 'var(--spaces-200)',
        'space-240': 'var(--spaces-240)',
        'space-280': 'var(--spaces-280)',
        'space-300': 'var(--spaces-300)',
      },
      // The map markers' pulse. A named animation rather than Tailwind's
      // built-in `animate-ping` plus an arbitrary duration: `animate-ping` is
      // the `animation` SHORTHAND, so it resets animation-duration and an
      // `[animation-duration:...]` utility alongside it is silently ignored --
      // confirmed in the browser, where the duration stayed at ping's 1s.
      // Baking the duration into one shorthand removes the conflict, and lets
      // the halo travel a little further than ping's fixed 2x.
      keyframes: {
        'marker-pulse': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        'marker-pulse': 'marker-pulse 2.4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      borderRadius: {
        'radius-4': 'var(--radius-4)',
        'radius-8': 'var(--radius-8)',
        'radius-12': 'var(--radius-12)',
        'radius-16': 'var(--radius-16)',
        'radius-20': 'var(--radius-20)',
        'radius-24': 'var(--radius-24)',
        'radius-32': 'var(--radius-32)',
        'radius-36': 'var(--radius-36)',
        'radius-48': 'var(--radius-48)',
        'radius-60': 'var(--radius-60)',
        'radius-68': 'var(--radius-68)',
      },
    },
  },
  plugins: [],
}
