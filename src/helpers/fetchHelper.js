import { v4 as uuidv4 } from 'uuid'
import { handleTelemetry } from '../AppInsights/appInsightsHelper.js'
import { APP_INSIGHTS, ENVIRONMENT } from '../CONSTANTS'
import { getAppInsightsInfo } from './storageHelper'

const fetchHelper = async ({ resource, options, appInsights }) => {
  const abortController = new AbortController()
  const appInsightsPropertiesRequestId = uuidv4()
  const appInsightsContextSessionId = getAppInsightsInfo().session.id

  options = {
    ...options,
    headers: new Headers({
      appInsightsPropertiesRequestId,
      appInsightsContextSessionId,
    }),
    signal: abortController.signal,
  }

  let response = await fetch(resource, options)
  const json = await response.json()
  response = {
    ...response,
    data: json,
    headers: response.headers,
    json: () => Promise.resolve(json),
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
  }

  handleTelemetry({
    appInsights,
    appInsightsConfig: APP_INSIGHTS,
    environment: ENVIRONMENT,
    logToConsole: true,
    options,
    requestId: appInsightsPropertiesRequestId,
    resource,
    response,
    sessionId: appInsightsContextSessionId,
    tier: 'CLIENT',
  })

  return { cancel: abortController.abort, response }
}

export { fetchHelper }
