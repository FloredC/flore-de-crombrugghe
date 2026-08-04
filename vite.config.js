import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }) },
    react({ include: /\.(jsx|js|mdx|md)$/ }),
    // Lets `import Icon from './x.svg?react'` return a real inline <svg>
    // component, so the exported asset files in src/assets/icons stay the
    // single source of truth instead of having their path data hand-copied
    // into JSX.
    //
    // replaceAttrValues rewrites the hardcoded #0E0E0E fill that Figma bakes
    // into every export into `currentColor` -- without this the icons render
    // as fixed near-black and can't take the hover/pressed/focus colors the
    // button states call for.
    svgr({
      svgrOptions: {
        replaceAttrValues: { '#0E0E0E': 'currentColor', '#0e0e0e': 'currentColor' },
      },
    }),
  ],
})

// Editing tailwind.config.js does NOT reach a running dev server.
//
// Tailwind 3's PostCSS plugin resolves the config once and holds it for the
// life of the Node process. The config is ESM, so it can't be uncached, and
// Vite's own `server.restart()` reuses the same process -- an auto-restart
// plugin was tried here and measured: it logged a restart and kept serving the
// old CSS. A browser reload doesn't help either, since the stale CSS is
// generated server-side.
//
// Only killing the process and starting again picks up a token change. Verified
// both ways: same-process restart served the old line-height, cold start served
// the new one. This bit the type pass twice -- the page looked plausible while
// painting the previous scale, and it was only caught by reading the served CSS
// rule directly rather than trusting the render.
