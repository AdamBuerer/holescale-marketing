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

// Check if the root has pre-rendered content (from react-snap)
// If it does, hydrate instead of render to preserve SEO benefits
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, <Root />)
} else {
  ReactDOM.createRoot(rootElement).render(<Root />)
}
