import { v4 as uuidv4 } from 'uuid'
import {
  appInsights,
  APP_INSIGHTS_QUERIES,
  logAppInsightsQueryUrl,
} from '../appInsights'

const fetchHelper = async (resource, options) => {
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
  }
  console.log({ appInsightsPropertiesRequestId, appInsightsContextSessionId })
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
      { name: 'TODOS' },
      {
        request: { resource, options: updatedOptions },
        requestId: appInsightsPropertiesRequestId,
        response: json,
      }
    )
  } catch (error) {
    appInsights.trackException(
      { error },
      {
        request: { resource, options: updatedOptions },
        requestId: appInsightsPropertiesRequestId,
      }
    )
    response = error
  }
  logAppInsightsQueryUrl({
    name: APP_INSIGHTS_QUERIES.REQUEST_BY_SESSION_ID_REQUEST_ID,
    requestId: appInsightsPropertiesRequestId,
    sessionId: appInsightsContextSessionId,
  })
  return response
}

export { fetchHelper }
