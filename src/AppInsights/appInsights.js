import { ApplicationInsights } from '@microsoft/applicationinsights-web'

// eslint-disable-next-line import/no-mutable-exports
let appInsights

const init = ({ instrumentationKey }) => {
  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey,
    },
  })
  appInsights.loadAppInsights()
  appInsights.trackPageView()
}

export { appInsights, init }
