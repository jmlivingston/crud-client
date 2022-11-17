import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './appInsights'
import ErrorBoundary from './ErrorBoundary'
import './main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="container">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </div>
  </React.StrictMode>
)
