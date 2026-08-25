# Artifakt process logs

Drop the six exported documentation HTML files here, with **exactly** these
filenames — the case study links to them by path:

    reveal-ai-integration.html
    prompting-process.html
    visual-system.html
    loading-animations.html
    scaffold-process.html
    final-screen-redesign.html

## Why here and not in `src/`

`public/` is copied to the build root verbatim and served as-is, so each file
keeps working as a standalone page with no import, no bundling and no route.
`public/language-river.html` is the existing precedent for the same thing.

Anything in `src/` would need to go through Vite, which would try to bundle it.

## Two things that will bite

**Paths.** The site is served from `/flore-de-crombrugghe/` in production, not
from `/`. The case study builds these URLs through `assetUrl()`, so the code
side is handled — but if a log file links to *another* log, or to an image, use
a **relative** path (`./prompting-process.html`, `./img/foo.png`), never a
root-absolute one (`/process/...`). A root-absolute path works on localhost and
404s on the deployed site, and `npm run dev` cannot catch it. Use
`npm run preview:pages` to test.

**Self-contained.** Inline the CSS, JS and fonts. `language-river.html` pulls
Chart.js from a CDN and a font from fonts.bunny.net, and it is the one thing on
this site that can visibly fail mid-demo if the network is unhappy. Don't add a
second.

Images belong in a sibling folder (`public/process/artifakt/img/`) referenced
relatively, or as data: URIs inside the file.
