// Side padding steps down gradually on smaller breakpoints, ending at 12px
// on mobile (per Flore) rather than staying fixed at 24px all the way down.
// Exact intermediate steps aren't sampled from Figma (Flore wasn't certain
// of them either) -- reasonable interpolation across Tailwind's default
// breakpoints using real spacing tokens, adjustable once seen.
export default function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-space-12 sm:px-space-16 md:px-space-20 lg:px-6 ${className}`}>
      {children}
    </div>
  )
}
