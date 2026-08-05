import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* basename comes from Vite's BASE_URL, which is the `base` set in
        vite.config.js -- not hardcoded, so the deploy path lives in exactly one
        place. Without it every in-app route would resolve against the domain
        root and miss the /flore-de-crombrugghe/ prefix in production. It stays
        '/' during local dev, so nothing changes here day to day. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
