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

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />)
