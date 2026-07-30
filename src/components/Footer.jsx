export default function Footer() {
  return (
    <footer data-component="footer" className="flex items-center justify-between px-6 py-8 text-body-sm font-normal">
      <p>© {new Date().getFullYear()} Flore de Crombrugghe</p>
      <a href="mailto:flore.decrombrugghe@gmail.com">flore.decrombrugghe@gmail.com</a>
    </footer>
  )
}
