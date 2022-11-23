import React, { useContext, useState } from 'react'
import { AppInsightsContext } from './AppInsightsContext'
import Code from './Code'
import { getAppInsightsInfo, setAppInsightsInfo } from './helpers/storageHelper'

const AppInsightsInfo = () => {
  const { appInsights } = useContext(AppInsightsContext)
  const [appInsightsDetails, setAppInsightsDetails] = useState(
    getAppInsightsInfo()
  )

  const onSetAppInsightsInfo = () => {
    const info = setAppInsightsInfo()
    appInsights.context.session.id = info.session.id
    setAppInsightsDetails(info)
  }
  return (
    <>
      <h2>AppInsightsInfo</h2>
      Used to mimic a session that can be sent to Application Insights.
      <div className="row">
        <div className="col-9">ID: {appInsightsDetails.session.id}</div>
        <div className="col-3">
          <button onClick={onSetAppInsightsInfo}>Reset</button>
        </div>
      </div>
      <Code code={appInsights.config} title="App Insights - config" />
      <Code code={appInsights.context} title="App Insights - context" />
    </>
  )
}

export default AppInsightsInfo
