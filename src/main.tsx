import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Declare global hsAppReady function
declare global {
  interface Window {
    hsAppReady?: () => void
  }
}

function Root() {
  useEffect(() => {
    // Signal that the app is ready after first render
    if (window.hsAppReady) {
      window.hsAppReady()
    }
  }, [])

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

const rootElement = document.getElementById('root')!

// The marketing site is prerendered by capturing the fully-rendered DOM with a headless
// browser (scripts/prerender.mjs). That snapshot is NOT hydration-safe — lazy routes,
// Suspense, and client-only state cause React hydration mismatches (errors #418/#423),
// which the global error handler surfaces as an "Unable to Load" screen. So we always
// client-render: search crawlers and AI engines still receive the prerendered HTML in the
// initial response (SEO/AEO benefit), while users get a clean render with no hydration errors.
rootElement.innerHTML = ''
ReactDOM.createRoot(rootElement).render(<Root />)
