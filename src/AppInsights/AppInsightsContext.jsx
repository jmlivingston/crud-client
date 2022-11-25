import PropTypes from 'prop-types'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import appInsights from './appInsights'

const AppInsightsContext = createContext()

const AppInsightsContextProvider = ({ children, sessionId }) => {
  const [currentSessionId, setSessionId] = useState(sessionId)
  useEffect(() => {
    if (appInsights && sessionId) {
      appInsights.context.session.id = sessionId
    }
  }, [appInsights, sessionId])

  useEffect(() => {
    if (appInsights) {
      appInsights.context.session.id = currentSessionId
    }
  }, [appInsights, currentSessionId])

  const value = useMemo(
    () => ({
      sessionId: currentSessionId,
      setSessionId,
    }),
    [currentSessionId]
  )

  return (
    <AppInsightsContext.Provider value={value}>
      {children}
    </AppInsightsContext.Provider>
  )
}

AppInsightsContextProvider.propTypes = {
  children: PropTypes.node,
  sessionId: PropTypes.string,
}

export { AppInsightsContext, AppInsightsContextProvider }
