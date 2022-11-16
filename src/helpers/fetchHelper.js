import { appInsights } from '../appInsights'

const fetchHelper = async (resource, options) => {
  let response
  const updatedOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
    },
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
