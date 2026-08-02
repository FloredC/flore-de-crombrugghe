import { LINK_CLASS } from './ButtonLink'

// The label changed from "Download CV" to "View CV" (view in a new tab), so
// this switched back to Drive's own /view URL -- the uc?export=download form
// used before actively forced a download, which would have silently
// mismatched a "View" label. Two caveats worth knowing: this only works
// while the file stays shared as "anyone with the link", and Drive can show
// a scan interstitial for larger files. Self-hosting the PDF in /public
// would avoid both -- worth doing before launch.
const CV_URL = 'https://drive.google.com/file/d/14uiYk10FyuIpIn2WLVAzPt83-Al84F6T/view'

// Sampled from Figma's Footer (Breakpoint=Desktop / Breakpoint=Mobile): a
// full-width divider above a credits row. Desktop lays the row out
// horizontally with the copyright and CV link pushed apart (px-64/py-80);
// mobile stacks them left-aligned with a 24px gap (px-24/py-48).
//
// The year is computed rather than hardcoded to 2026 as in the design, so it
// can't silently go stale.
export default function Footer() {
  return (
    <footer data-component="footer" className="flex flex-col items-center px-space-24 py-space-48 md:px-space-64 md:py-space-80">
      <div className="flex w-full flex-col gap-space-32 md:gap-space-24">
        <div className="h-px w-full bg-border-divider" />
        <div className="flex flex-col items-start gap-space-24 md:flex-row md:items-center md:justify-between">
          <p className="text-[16px] font-normal leading-[1.4] text-text-primary">
            {new Date().getFullYear()} © Flore de Crombrugghe
          </p>
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`py-space-8 text-[16px] font-bold leading-[1.5] ${LINK_CLASS}`}
          >
            View CV
          </a>
        </div>
      </div>
    </footer>
  )
}
