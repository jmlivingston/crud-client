import { v4 as uuidv4 } from 'uuid'
import { appInsights, logAppInsightsQueryUrl } from '../appInsights'
import { APP_INSIGHTS } from '../CONSTANTS'

const fetchHelper = async (resource, options) => {
  const abortController = new AbortController()
  const appInsightsPropertiesRequestId = uuidv4()
  const appInsightsContextSessionId = appInsights.context.session.id
  let response
  const headers = new Headers({
    'Content-Type': 'application/json',
    appInsightsPropertiesRequestId,
    appInsightsContextSessionId,
  })
  const updatedOptions = {
    ...options,
    headers,
    signal: abortController.signal,
  }
  try {
    response = await fetch(resource, updatedOptions)
    const json = await response.json()
    response = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      json: () => Promise.resolve(json),
    }
    appInsights.trackEvent(
      {
        name: APP_INSIGHTS.LOG_NAME,
      },
      {
        request: { resource, options: updatedOptions },
        requestId: appInsightsPropertiesRequestId,
        response: json,
      }
    )
    if (!response.ok) {
      logAppInsightsQueryUrl({
        isClient: false,
        method: 'error',
        url: json.error.appInsights.url,
      })
    }
  } catch (error) {
    appInsights.trackEvent(
      {
        name: APP_INSIGHTS.LOG_NAME,
      },
      {
        error,
        request: { resource, options: updatedOptions },
        requestId: appInsightsPropertiesRequestId,
      }
    )
    response = error
  }
  logAppInsightsQueryUrl({
    isClient: true,
    method: 'info',
    name: APP_INSIGHTS.QUERIES.REQUEST_BY_SESSION_ID_REQUEST_ID,
    requestId: appInsightsPropertiesRequestId,
    sessionId: appInsightsContextSessionId,
  })
  return { cancel: abortController.abort, response }
}

export { fetchHelper }
