import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from '@vercel/analytics/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
);

// Register Service Worker for aggressive offline caching of 3D models, images, and app shell
if ('serviceWorker' in navigator) {
  const registerSW = () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed:', err);
    });
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', registerSW);
  } else {
    registerSW();
  }
}

