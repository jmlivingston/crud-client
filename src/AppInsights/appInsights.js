import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { getSessionInfo, setSessionInfo } from './appInsightsHelper'

// eslint-disable-next-line import/no-mutable-exports
let appInsights

const init = ({ instrumentationKey, sessionKey, sessionId }) => {
  try {
    getSessionInfo({ key: sessionKey })
  } catch {
    setSessionInfo({ key: sessionKey, sessionId })
  }

  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey,
    },
  })
  appInsights.loadAppInsights()
  appInsights.trackPageView()
}

export { appInsights, init }
