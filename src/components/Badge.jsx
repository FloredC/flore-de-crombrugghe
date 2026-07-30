export default function Badge({ status }) {
  const className = 'text-body-sm font-semibold'

  if (status === 'nda-project') {
    return (
      <span data-badge="nda" className={className}>
        NDA
      </span>
    )
  }
  if (status === 'full-case-study') {
    return (
      <span data-badge="case-study" className={className}>
        Case study
      </span>
    )
  }
  return null
}
