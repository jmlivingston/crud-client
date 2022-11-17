import { appInsights } from '../appInsights'

const fetchHelper = async (resource, options) => {
  let response
  const headers = new Headers({
    'Content-Type': 'application/json',
    AppInsightsSessionId: appInsights.context.session.id,
  })
  const updatedOptions = {
    ...options,
    headers,
  }
  try {
    appInsights.trackEvent({ request: { resource, options: updatedOptions } })
    response = await fetch(resource, updatedOptions)
  } catch (error) {
    appInsights.trackException({ error })
    response = error
  }
  return response
}

export { fetchHelper }
