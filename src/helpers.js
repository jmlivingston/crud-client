import { appInsights } from './appInsights'

const fetchHelper = async (resource, options) => {
  let response
  try {
    appInsights.trackEvent({ request: { resource, options } })
    response = await fetch(resource, options)
  } catch (error) {
    appInsights.trackException({ error })
    response = error
  }
  return response
}

export { fetchHelper }
