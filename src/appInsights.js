import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { getSession } from './helpers/sessionHelper'

let appInsights

if (!appInsights) {
  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: import.meta.env.VITE_APP_INSIGHTS_INSTRUMENTATION_KEY,
    },
  })

  appInsights.loadAppInsights()
  appInsights.trackPageView()
  const session = getSession()
  appInsights.context.session.id = session.id
}

window.appInsights = appInsights

export { appInsights }
