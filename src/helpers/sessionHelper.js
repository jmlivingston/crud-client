import { v4 as uuidv4 } from 'uuid'
import { STORAGE_KEYS } from '../CONSTANTS'

const setSession = () => {
  const session = { id: uuidv4() }
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
  return session
}

const getSession = () => {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION)
  if (session) {
    return JSON.parse(session)
  } else {
    session = setSession()
  }
  return session
}

export { getSession, setSession }
