import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppInsightsContextProvider } from './AppInsights/AppInsightsContext'
import { APP_INSIGHTS } from './CONSTANTS'
import ErrorBoundary from './ErrorBoundary'
import './main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="container">
      <AppInsightsContextProvider
        instrumentationKey={APP_INSIGHTS.INSTRUMENTATION_KEY}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AppInsightsContextProvider>
    </div>
  </React.StrictMode>
)
