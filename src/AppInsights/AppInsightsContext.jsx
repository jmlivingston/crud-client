import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import PropTypes from 'prop-types'
import React, { createContext, useEffect, useMemo, useState } from 'react'

const AppInsightsContext = createContext()

const AppInsightsContextProvider = ({
  children,
  instrumentationKey,
  sessionId,
}) => {
  const [appInsights, setAppInsights] = useState()
  const [currentSessionId, setSessionId] = useState(sessionId)
  useEffect(() => {
    if (instrumentationKey && sessionId) {
      const appInsightsInstance = new ApplicationInsights({
        config: {
          instrumentationKey,
        },
      })
      appInsightsInstance.loadAppInsights()
      appInsightsInstance.trackPageView()
      appInsightsInstance.context.session.id = sessionId
      setAppInsights(appInsightsInstance)
      // TODO: How else to inject everywhere?
      window.appInsights = appInsightsInstance
    }
  }, [sessionId])

  useEffect(() => {
    if (appInsights) {
      appInsights.context.session.id = currentSessionId
    }
  }, [appInsights, currentSessionId])

  const value = useMemo(
    () => ({
      appInsights,
      sessionId: currentSessionId,
      setSessionId,
    }),
    [appInsights, currentSessionId]
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
