import { v4 as uuidv4 } from 'uuid'
import { APP_INSIGHTS, APP_NAME, ENVIRONMENT } from '../CONSTANTS'
import { getAppInsightsInfo } from './storageHelper'

const fetchHelper = async ({ resource, options, handleTelemetry }) => {
  const abortController = new AbortController()
  const resourcePath = new URL(resource).pathname
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
    appInsightsConfig: APP_INSIGHTS,
    environment: ENVIRONMENT,
    name: APP_NAME,
    options,
    requestId: appInsightsPropertiesRequestId,
    resource,
    resourcePath,
    response,
    sessionId: appInsightsContextSessionId,
  })

  return { cancel: abortController.abort, response }
}

export { fetchHelper }
