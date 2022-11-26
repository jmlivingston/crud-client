import { nanoid } from 'nanoid'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { init } from './AppInsights/appInsights'
import { APP_INSIGHTS, STORAGE_KEYS } from './CONSTANTS'
import ErrorBoundary from './ErrorBoundary'
import './main.scss'

init({
  instrumentationKey: APP_INSIGHTS.INSTRUMENTATION_KEY,
  sessionKey: STORAGE_KEYS.APP_INSIGHTS_INFO,
  sessionId: nanoid(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="container">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </div>
  </React.StrictMode>
)
