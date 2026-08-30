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

## THESE FILES ARE HAND-EDITED. Re-apply after any re-export.

Added 2026-08-30. Everything else about this folder assumes a re-export is a
pure file drop — it no longer is, and this is the note that says so.

Flore's call, and it is the right one: these documents contain interactive cards
whose borders change colour on hover and click, so keeping them in step with the
site's own cards is a code concern, not something worth re-exporting a working
document for.

**The two rules applied to every border declaration in all six files:**

| | before | after |
|---|---|---|
| stroke width | `1.5px` | `1px` — matching the site's outline buttons |
| accent colour | `#7c3aed` | `#321366` — the site's `--colors-accent` |

Only `border*` properties were touched. The same purple still appears as TEXT
and as background tints (17 occurrences) and was deliberately left alone —
the instruction was about borders. If those should follow too, it is the same
one-line search-and-replace without the `border` restriction.

If you re-export a log, this reverts. The fix is a search-and-replace on the new
file, and it is cheap enough that it is not worth automating until it has been
needed twice.

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
