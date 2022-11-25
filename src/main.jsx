import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { init } from './AppInsights/appInsights'
import { APP_INSIGHTS } from './CONSTANTS'
import ErrorBoundary from './ErrorBoundary'
import './main.scss'

init({ instrumentationKey: APP_INSIGHTS.INSTRUMENTATION_KEY })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="container">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </div>
  </React.StrictMode>
)
