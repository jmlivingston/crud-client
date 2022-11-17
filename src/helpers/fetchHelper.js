import { appInsights } from '../appInsights'

const fetchHelper = async (resource, options) => {
  let response
  const headers = new Headers({
    'Content-Type': 'application/json',
    // Operation: appInsights.context.operation.id, // TODO
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
