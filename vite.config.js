import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

// The site is served from a CUSTOM DOMAIN, floredecrombrugghe.com, which is a
// domain ROOT -- so built asset URLs need no path prefix.
//
// It WAS a project site (https://floredc.github.io/flore-de-crombrugghe/) until
// 2026-09-01, which is why so much hangs off this one constant: it is also the
// router's basename (src/index.jsx reads it back via import.meta.env.BASE_URL)
// and the depth the 404 shim keeps (public/404.html, now 0 segments). All three
// still derive from here, so moving back to a subpath stays a one-line change.
//
// The domain itself is asserted by public/CNAME, which Pages reads out of the
// deployed artifact on every deploy. Delete that file and the site silently
// reverts to the github.io URL while this constant still says root -- so the
// two belong together, and neither is meaningful alone.
const BASE = '/'

// Applied to the BUILD only, so `npm run dev` keeps serving at
// http://localhost:5173/ rather than making you remember a subpath every day.
// Nothing depends on the two matching: everything that needs the base reads
// import.meta.env.BASE_URL, which Vite sets to '/' in dev and to BASE in the
// built site, so both are correct without a second constant.
//
// The catch, worth knowing: a base-path bug therefore CANNOT show up in dev.
// That's how five broken thumbnails got this far. To exercise the real thing,
// build and serve dist under the base path -- there's a small Pages simulator
// for exactly this, see the deploy notes in README/commit history.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE : '/',
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
    // #FD6D2B (orange-70) added 2026-08-07 for the map highlight overlays.
    // Every one of the nine was exported as flat orange back when all markers
    // were orange; they now take their hotspot's discipline colour. Rewriting
    // the fill here means the colour comes from a token at render time and
    // Flore doesn't have to re-export nine files to change a palette.
    // No icon in src/assets/icons uses this colour, so nothing else moves.
    svgr({
      svgrOptions: {
        replaceAttrValues: {
          '#0E0E0E': 'currentColor',
          '#0e0e0e': 'currentColor',
          '#FD6D2B': 'currentColor',
          '#fd6d2b': 'currentColor',
        },
      },
    }),
  ],
}))

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
