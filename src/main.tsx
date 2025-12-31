import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Pull-to-refresh is prevented by CSS overscroll-behavior in index.html and App.css
// No JavaScript event listeners needed

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
