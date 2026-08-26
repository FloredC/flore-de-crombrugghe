/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,mdx,md}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['HK Grotesk', 'sans-serif'],
      },
      // The third density regime. `xl` (1280) is now the LAPTOP breakpoint and
      // `2xl` the large-desktop one; Tailwind's own 2xl is 1536 and was unused
      // anywhere in src/, so overriding it costs nothing.
      //
      // Why 1600 and not Flore's 1599 hypothesis: 1622 is the Figma frame, and
      // everything generous in the system is measured against it. 1600 is the
      // nearest round number below that, so `2xl` means "wide enough to be the
      // frame the design was drawn for" rather than an arbitrary cut.
      //
      // The bands, and what each is for:
      //   < 1280   phone/tablet -- untouched by the 2026-08-25 density pass.
      //   1280+    laptop. The design's proportions, at laptop density.
      //   1600+    large desktop. The Figma frame, unchanged.
      //
      // Read `xl:` as "from laptop up" and `2xl:` as "restore the generous
      // value". Min-width only, so it cascades and there is no max-width query
      // anywhere to reason about.
      screens: {
        '2xl': '1600px',
      },
      // Fluid type, anchored on the two real Figma frames: each clamp hits its
      // Mobile/* style exactly at 402 and its Desktop/* style exactly at 1622.
      // Both ends are measured, not chosen.
      //
      // PIECEWISE, with a laptop plateau (2026-08-25). The scale used to be a
      // single straight line 402 -> 1622, and the consequence was measurable:
      // at 1440 every token sat at 97-98% of its maximum, so the laptop band
      // rendered the 1622 design at full size. A regime that only exists as a
      // waypoint on a ramp is not a regime -- so the laptop value is now a real
      // PLATEAU, flat from 1280 to 1500, and the scale ramps to the Figma value
      // over the last stretch.
      //
      // Shape:  clamp(mobile, max(min(A, plateau), C), desktop)
      //   A         402 -> 1280, mobile value up to the laptop value
      //   min(A,P)  clips A once it reaches the plateau, so 1280-1500 is flat
      //   max(.,C)  C only overtakes the plateau above 1500, ramping to 1622
      //   clamp     pins both measured Figma ends exactly
      //
      // The 1500-1622 ramp is short and therefore steep, which is deliberate:
      // the alternative is a plateau that ends at 1600 and a 22px ramp, which
      // is a step in all but name. Monotonic throughout -- resizing never runs
      // a size backwards, which is the property the old single clamp was chosen
      // for and this keeps.
      //
      // rem, not px: px ignores the reader's browser font-size setting, so the
      // site could not be scaled up by anyone who needs that. The vw term is
      // what makes it fluid; the rem term is what keeps it accessible.
      //
      // Sizes live here and nowhere else: a component writes `text-body` and
      // gets the right size at every width, with no `md:text-*` to drift.
      // Figma's styles also carry weight, which Tailwind's fontSize cannot, so
      // weight stays a separate class at the call site -- the one place the
      // token can't enforce the pairing. Check it against the style name.
      //
      // To retune a plateau, edit scripts/type-scale.mjs and paste its output
      // back here -- the coefficients are derived, not hand-written, and a
      // hand-edited intercept silently moves an anchor Figma owns.
      fontSize: {
        // 36 -> 42 -> 48 (Desktop/h1 -> laptop -> Desktop/display), Bold 700.
        //
        // The case-study hero title, and the only step whose mobile end is not
        // measured: Figma draws the subpage at 1622 only, so `Mobile/display`
        // does not exist. Rather than invent a value, the low anchor is
        // Desktop/h1 (36), which IS a real Figma size.
        //
        // Line height is 1.2, not the 1.4 the rest of the headings carry --
        // that is Figma's own `Desktop/display`, not a divergence.
        display: [
          'clamp(2.25rem, max(min(2.0783rem + 0.6834vw, 2.625rem), -1.98566rem + 4.918vw), 3rem)',
          { lineHeight: '1.2' },
        ],
        // 28 -> 32 -> 36 (Mobile/h1 -> laptop -> Desktop/h1), Bold 700.
        //
        // The case-study SECTION headers -- the thing a reader scans for. Steps
        // down proportionally LESS than the body it sits above (11% against
        // body-lg's 10%, but from a much larger number), so the header keeps its
        // absolute presence while the prose under it gets denser.
        h1: [
          'clamp(1.75rem, max(min(1.63554rem + 0.4556vw, 2rem), -1.07377rem + 3.2787vw), 2.25rem)',
          { lineHeight: '1.4' },
        ],
        // 24 -> 24 -> 28. At 402 this lands on Figma's Desktop/h3, which is what
        // the mobile card titles actually use -- same pixels, different style
        // name.
        //
        // The desktop end is 28, not Figma's 32: Flore's call on 2026-08-04,
        // the card titles read too heavy at the wide breakpoints. Deliberate
        // divergence from the file; don't restore 32 on the next sample.
        //
        // FLAT 24 FROM 402 TO 1500, so this token has no ramp until the last
        // stretch. That is a real decision, not a degenerate case: the card
        // title only grows for the large-desktop frame, and everywhere else it
        // is one size. It was 26 for a day (Flore, 2026-08-25: still too big on
        // a laptop) and the step to 24 is what actually reads.
        //
        // The tradeoff, so it can be reversed knowingly: the title-to-body
        // ratio drops to 24/18 = 1.33 at laptop against 28/20 = 1.40 at the
        // desktop frame, so the title carries slightly less weight over its own
        // description. 25 is the value that holds 1.4 exactly if that ever
        // matters more than the absolute size.
        //
        // Shared by the ProjectCard titles and the Contact "Say Hi!" heading.
        h2: ['clamp(1.5rem, max(1.5rem, -1.57377rem + 3.2787vw), 1.75rem)', { lineHeight: '1.4' }],
        // 16 -> 18 -> 20 (Mobile/body -> laptop -> Desktop/body-lg).
        //
        // The site's reading size: card descriptions and every case-study
        // paragraph. The 18 plateau is the highest-leverage value in this file
        // for the case-study stretch problem, and the leverage is in the LEADING
        // rather than the glyph size: 20 x 1.6 is a 32px line, 18 x 1.5 is a
        // 27px line, so a 790px laptop viewport goes from ~25 rendered lines of
        // prose to ~29. Roughly a sixth more of a chapter visible at once, with
        // the section headings untouched.
        //
        // Line height is a VARIABLE, not a literal: --leading-reading steps
        // 1.6 -> 1.5 across the laptop band and back to 1.6 at 1600 (see
        // globals.css). A ratio rather than a length, so it still scales with
        // the reader's font size. Figma's own value is 1.5; the 1.6 at the two
        // ends is Flore's call on 2026-08-04 for the long card descriptions.
        //
        // body-lg ONLY. This was briefly applied to `body` as well and Flore
        // reverted that -- `body` keeps Figma's 1.5.
        'body-lg': [
          'clamp(1rem, max(min(0.94277rem + 0.2278vw, 1.125rem), -0.41189rem + 1.6393vw), 1.25rem)',
          { lineHeight: 'var(--leading-reading)' },
        ],
        // 16 -> 17 -> 18 (Mobile/body -> laptop -> Desktop/body). Converges with
        // body-lg at 402 -- deliberate, that's what the frames show.
        // Every button label on the site is this token.
        body: [
          'clamp(1rem, max(min(0.97138rem + 0.1139vw, 1.0625rem), 0.29406rem + 0.8197vw), 1.125rem)',
          { lineHeight: '1.5' },
        ],
        // 14 -> 15 -> 16 (Mobile/body-sm -> laptop -> Desktop/body-sm)
        'body-sm': [
          'clamp(0.875rem, max(min(0.84638rem + 0.1139vw, 0.9375rem), 0.16906rem + 0.8197vw), 1rem)',
          { lineHeight: '1.4' },
        ],
        // 12 -> 13 -> 14 (Mobile/caption -> laptop -> Desktop/caption)
        caption: [
          'clamp(0.75rem, max(min(0.72138rem + 0.1139vw, 0.8125rem), 0.04406rem + 0.8197vw), 0.875rem)',
          { lineHeight: '1.4' },
        ],
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
