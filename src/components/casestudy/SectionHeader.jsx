// The section title, six instances on this page.
//
// Renders INSIDE its section's first content block rather than as a block of
// its own, so it doesn't add an entry to the page's width sequence -- a header
// and the prose under it are one visual unit, and splitting them would put a
// width boundary through the middle of it.
//
// Type: Figma sets these as Desktop/h1 (36 Bold) -- confirmed by geometry, the
// title frames are 50px tall and 36 x 1.4 = 50.4 -- which is exactly the
// `text-h1` token. Not `text-h2`: h2 is the card-title size.
export default function SectionHeader({ title, eyebrow, as: Tag = 'h2' }) {
  return (
    <header className="flex flex-col gap-space-8">
      {eyebrow && (
        <p className="m-0 text-body-sm font-normal text-text-secondary">{eyebrow}</p>
      )}
      <Tag className="m-0 text-h1 font-bold">{title}</Tag>
    </header>
  )
}
