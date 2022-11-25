import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { APP_INSIGHTS } from '../CONSTANTS'

let appInsights

if (!appInsights) {
  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: APP_INSIGHTS.INSTRUMENTATION_KEY,
    },
  })
  appInsights.loadAppInsights()
  appInsights.trackPageView()
}

export default appInsights
