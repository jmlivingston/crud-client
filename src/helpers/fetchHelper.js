import { v4 as uuidv4 } from 'uuid'
import { sessionId } from '../appInsights'
import { handleTracking } from './logHelper'

const fetchHelper = async (resource, options) => {
  const abortController = new AbortController()
  const resourcePath = new URL(resource).pathname
  const appInsightsPropertiesRequestId = uuidv4()
  const appInsightsContextSessionId = sessionId

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

  handleTracking({
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
