import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window {
    fbq: any;
  }
}

if (!window.fbq) {
  window.fbq = function() {
    (window.fbq.q = window.fbq.q || []).push(arguments);
  };
  window.fbq.q = window.fbq.q || [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', '968941662364020');
  window.fbq('track', 'PageView');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)