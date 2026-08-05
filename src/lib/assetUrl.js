/**
 * Resolve a content-supplied asset path against the deployed base path.
 *
 * Vite rewrites the asset URLs it can SEE -- ES imports, and url() in CSS. It
 * cannot see a path that arrives as a plain string out of MDX frontmatter, so
 * those stay exactly as written. Written root-absolute ("/images/x.png") they
 * resolve against the domain root, which is correct on localhost and wrong in
 * production, where the site is served from /flore-de-crombrugghe/.
 *
 * This was a genuinely invisible bug: `npm run dev` and `vite preview` both
 * looked perfect, and it only appeared when the built site was served under its
 * real base path. Five project thumbnails were already loading as broken images
 * before this existed, and 21 paths in total are affected.
 *
 * Keeping the fix here rather than baking the prefix into the content files
 * matters: the .mdx files stay portable and readable, and the deploy path
 * remains defined in exactly one place (vite.config.js), which BASE_URL reads
 * back. Change the base for a custom domain and every one of these follows.
 *
 * Absolute URLs and data: URIs pass through untouched, so it's safe to apply to
 * a field that might hold either -- the Spotify embed and the local Language
 * River page both flow through the same prop.
 */
export default function assetUrl(path) {
  if (!path) return path
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(path) || path.startsWith('data:')) return path

  // BASE_URL is '/' in dev and '/flore-de-crombrugghe/' in the built site;
  // trimming the trailing slash keeps this from producing a double slash.
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}
