# Fonts in `public/`

Copies of three HK Grotesk weights, for the **standalone HTML pages** in
`public/` — the embeds under `public/embeds/`, and anything else served as its
own document rather than through the React app.

The app itself does NOT use these. It imports the originals from
`src/assets/fonts/` so Vite fingerprints and cache-busts them; see
`globals.css`. These copies exist because a standalone page in `public/` has no
build step and can only reach a font by URL.

Duplicated on purpose, ~100 KB total. The alternative is having the embeds
point at the app's hashed font filenames, which change on every build.

If HK Grotesk is ever replaced, replace it in BOTH places.
