import { nanoid } from 'nanoid'
import { appInsights } from '../AppInsights/appInsights'
import {
  getSessionInfo,
  handleTelemetry,
} from '../AppInsights/appInsightsHelper.js'
import { APP_INSIGHTS, ENVIRONMENT, STORAGE_KEYS } from '../CONSTANTS'

const fetchHelper = async ({ resource, options }) => {
  const abortController = new AbortController()
  const appInsightsPropertiesRequestId = nanoid()
  const appInsightsContextSessionId = getSessionInfo({
    key: STORAGE_KEYS.APP_INSIGHTS_INFO,
  }).session.id

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
