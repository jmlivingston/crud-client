import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { APP_INSIGHTS_CONFIG } from './CONSTANTS'
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
  appInsights.context.session.id = info.session.id
}

const APP_INSIGHTS_QUERIES = Object.freeze({
  REQUEST_BY_SESSION_ID_REQUEST_ID: 'REQUEST_BY_SESSION_ID_REQUEST_ID',
})

const getAppInsightsQueryUrl = ({ name, requestId, sessionId }) => {
  const getQueryByName = ({ name, requestId, sessionId }) => {
    let query
    switch (name) {
      case APP_INSIGHTS_QUERIES.REQUEST_BY_SESSION_ID_REQUEST_ID:
        query = `requests | where session_Id == "${sessionId}" and customDimensions contains "${requestId}"`
        break
    }
    return query
  }

  const query = getQueryByName({ name, requestId, sessionId })
  const url = `https://portal.azure.com/#@${
    APP_INSIGHTS_CONFIG.TENANT_ID
  }/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/resourceId/%2Fsubscriptions%2F${
    APP_INSIGHTS_CONFIG.SUBSCRIPTION_ID
  }%2FresourceGroups%2F${
    APP_INSIGHTS_CONFIG.RESOURCE_GROUP
  }%2Fproviders%2Fmicrosoft.insights%2Fcomponents%2F${
    APP_INSIGHTS_CONFIG.INSTANCE_NAME
  }/source/LogsBlade.AnalyticsShareLinkToQuery/query/${encodeURI(
    query
  )}/timespan/TIMESPAN`
  return url
}

const logAppInsightsQueryUrl = ({ name, requestId, sessionId }) => {
  const url = getAppInsightsQueryUrl({ name, requestId, sessionId })
  console.log(
    'Application Insights Log (WARNING: Not immediate and may take a few minutes.):',
    url
  )
}

export {
  APP_INSIGHTS_QUERIES,
  appInsights,
  getAppInsightsQueryUrl,
  logAppInsightsQueryUrl,
}
