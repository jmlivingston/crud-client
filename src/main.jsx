import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AppInsightsContextProvider } from './AppInsights/AppInsightsContext'
import ErrorBoundary from './ErrorBoundary'
import { getAppInsightsInfo } from './helpers/storageHelper'
import './main.scss'

const info = getAppInsightsInfo()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="container">
      <AppInsightsContextProvider sessionId={info.session.id}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AppInsightsContextProvider>
    </div>
  </React.StrictMode>
)
