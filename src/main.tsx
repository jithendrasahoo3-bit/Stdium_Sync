/**
 * ============================================================
 * APPLICATION ENTRY POINT — StadiumSync 2026
 * ============================================================
 * 
 * File: main.tsx
 * Purpose: Root React application entry point that initializes the React DOM
 * and renders the main App component with StrictMode for development checks.
 * 
 * Dependencies:
 *   - React: Core React library
 *   - ReactDOM: React rendering engine for browser
 *   - App: Main application component with routing and layout
 *   - index.css: Global application styles
 * 
 * Functionality:
 *   1. Initializes React StrictMode for development warnings
 *   2. Creates a React root element in the DOM
 *   3. Renders the App component as the root component
 * 
 * StrictMode Benefits:
 *   - Identifies unsafe lifecycle methods
 *   - Warns about deprecated string ref API usage
 *   - Detects unexpected side effects
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize React root and render the App component with StrictMode enabled
// StrictMode is a development-only tool that highlights potential issues in an application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
