import { ApplicationInsights } from '@microsoft/applicationinsights-web'

let appInsights

if (!appInsights) {
  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: import.meta.env.VITE_APP_INSIGHTS_INSTRUMENTATION_KEY,
    },
  })

  appInsights.loadAppInsights()
  appInsights.trackPageView()
}

export { appInsights }
