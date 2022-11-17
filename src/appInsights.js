import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { getAppInsightsInfo } from './helpers/storageHelper'

let appInsights

if (!appInsights) {
  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: import.meta.env.VITE_APP_INSIGHTS_INSTRUMENTATION_KEY,
    },
  })

  appInsights.loadAppInsights()
  appInsights.trackPageView()
  const info = getAppInsightsInfo()
  // appInsights.context.operation.id = info.operation.id TODO
}

window.appInsights = appInsights

export { appInsights }
