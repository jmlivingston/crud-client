import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { getAppInsightsInfo } from '../helpers/storageHelper'

const AppInsightsContext = createContext()

const AppInsightsContextProvider = ({ children, instrumentationKey }) => {
  const [appInsights, setAppInsights] = useState()
  useEffect(() => {
    const appInsightsInstance = new ApplicationInsights({
      config: {
        instrumentationKey,
      },
    })
    appInsightsInstance.loadAppInsights()
    appInsightsInstance.trackPageView()
    const info = getAppInsightsInfo()
    appInsightsInstance.context.session.id = info.session.id
    setAppInsights(appInsightsInstance)
  }, [])

  const value = useMemo(
    () => ({
      appInsights,
      sessionId: appInsights?.context?.session.id,
    }),
    [appInsights]
  )

  return appInsights ? (
    <AppInsightsContext.Provider value={value}>
      {children}
    </AppInsightsContext.Provider>
  ) : null
}

export { AppInsightsContext, AppInsightsContextProvider }
