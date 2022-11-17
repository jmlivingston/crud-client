import { v4 as uuidv4 } from 'uuid'
import { STORAGE_KEYS } from '../CONSTANTS'

const setAppInsightsInfo = () => {
  const info = { operation: { id: uuidv4() } }
  localStorage.setItem(STORAGE_KEYS.APP_INSIGHTS_INFO, JSON.stringify(info))
  return info
}

const getAppInsightsInfo = () => {
  const info = localStorage.getItem(STORAGE_KEYS.APP_INSIGHTS_INFO)
  if (info) {
    return JSON.parse(info)
  } else {
    info = setAppInsightsInfo()
  }
  return info
}

export { getAppInsightsInfo, setAppInsightsInfo }
