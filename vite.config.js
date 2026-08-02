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
