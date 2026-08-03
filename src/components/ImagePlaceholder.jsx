// Flore's own placeholder convention, sampled from the ValueCard component
// (4533:19711/19712): a dashed grey container with a centered "[ img ]" label
// in 12px text-secondary. Used wherever a real image hasn't landed yet, so a
// pending asset is visible on the page instead of silently rendering nothing.
//
// Callers set size and radius via className -- the ValueCard slot is a fixed
// 262px-tall block at radius 32, the AsideCard slot is 4:3 at radius 20.
export default function ImagePlaceholder({ className = '', label = '[ img ]' }) {
  return (
    <div
      data-component="image-placeholder"
      className={`flex items-center justify-center border border-dashed border-border-grey p-space-14 ${className}`}
    >
      <span className="text-center text-[12px] font-normal text-text-secondary">{label}</span>
    </div>
  )
}
