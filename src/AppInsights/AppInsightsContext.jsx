import PropTypes from 'prop-types'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { appInsights, init } from './appInsights'

const AppInsightsContext = createContext()

const AppInsightsContextProvider = ({
  children,
  instrumentationKey,
  sessionId,
}) => {
  const [currentSessionId, setSessionId] = useState(sessionId)

  useEffect(() => {
    init({ instrumentationKey })
  }, [instrumentationKey])

  useEffect(() => {
    if (appInsights && (currentSessionId || sessionId)) {
      setSessionId({ appInsights, sessionId: currentSessionId || sessionId })
    }
  }, [appInsights, currentSessionId, sessionId])

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
  instrumentationKey: PropTypes.string,
  sessionId: PropTypes.string,
}

export { AppInsightsContext, AppInsightsContextProvider }
