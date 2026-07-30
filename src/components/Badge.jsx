export default function Badge({ status }) {
  if (status === 'nda-project') {
    return <span data-badge="nda">NDA</span>
  }
  if (status === 'full-case-study') {
    return <span data-badge="case-study">Case study</span>
  }
  return null
}
