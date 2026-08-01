/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,mdx,md}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['HK Grotesk', 'sans-serif'],
      },
      // Desktop/* text styles pulled directly from Figma (get_design_context on
      // sampled nodes: section headers, project card title/description/meta,
      // contact heading/description, button label, badge label, wayfinding bubble).
      // Weight is applied separately via font-* utilities alongside these, since
      // Tailwind's fontSize scale doesn't carry font-weight.
      // Mobile compression is still an open item (CLAUDE.md flags it unresolved) --
      // 'caption-sm' below is the one confirmed mobile-named style sampled so far
      // (Mobile/caption, 12px), not a full mobile scale.
      fontSize: {
        h1: ['36px', { lineHeight: '1.4' }],
        h2: ['32px', { lineHeight: '1.4' }],
        'body-lg': ['20px', { lineHeight: '1.5' }],
        body: ['18px', { lineHeight: '1.5' }],
        'body-sm': ['16px', { lineHeight: '1.4' }],
        caption: ['14px', { lineHeight: '1.4' }],
        'caption-sm': ['12px', { lineHeight: '1.4' }],
      },
      colors: {
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
        'space-64': 'var(--spaces-64)',
        'space-80': 'var(--spaces-80)',
        'space-100': 'var(--spaces-100)',
        'space-120': 'var(--spaces-120)',
        'space-160': 'var(--spaces-160)',
        'space-200': 'var(--spaces-200)',
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
