import { v4 as uuidv4 } from 'uuid'
import { STORAGE_KEYS } from '../CONSTANTS'

const setAppInsightsInfo = () => {
  const info = { session: { id: uuidv4() } }
  localStorage.setItem(STORAGE_KEYS.APP_INSIGHTS_INFO, JSON.stringify(info))
  return info
}

const isInfoValid = (info) => info?.session?.id !== undefined

const getAppInsightsInfo = () => {
  let info = localStorage.getItem(STORAGE_KEYS.APP_INSIGHTS_INFO)
  if (isInfoValid(info)) {
    return JSON.parse(info)
  } else {
    info = setAppInsightsInfo()
  }
  return info
}

export { getAppInsightsInfo, setAppInsightsInfo }
