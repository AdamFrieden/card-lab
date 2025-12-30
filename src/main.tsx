import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Prevent pull-to-refresh on all touch-enabled browsers (especially Firefox Android)
let lastTouchY = 0;
let preventPullToRefresh = false;

document.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  lastTouchY = e.touches[0].clientY;
  // Only prevent if we're at the top of the page
  preventPullToRefresh = window.scrollY === 0;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (!preventPullToRefresh) return;

  const touchY = e.touches[0].clientY;
  const touchYDelta = touchY - lastTouchY;
  lastTouchY = touchY;

  // If scrolling down (positive delta) while at the top, prevent
  if (touchYDelta > 0) {
    e.preventDefault();
  }
}, { passive: false });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
