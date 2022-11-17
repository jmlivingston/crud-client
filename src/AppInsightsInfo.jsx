import React, { useState } from 'react'
import { appInsights } from './appInsights'
import Code from './Code'
import { getAppInsightsInfo } from './helpers/storageHelper'

const AppInsightsInfo = () => {
  const [appInsightsInfo, setAppInsightsInfo] = useState(getAppInsightsInfo())
  const onsetAppInsightsInfo = () => {
    const info = setAppInsightsInfo()
    // appInsights.context.operation.id = info.operation.id // TODO
    setAppInsightsInfo(info)
  }
  return (
    <>
      <h2>AppInsightsInfo</h2>
      Used to mimic a session that can be sent to Application Insights.
      <div className="row">
        <div className="col-9">ID: {appInsightsInfo.id}</div>
        <div className="col-3">
          <button onClick={onsetAppInsightsInfo}>Reset</button>
        </div>
      </div>
      <Code code={appInsights.config} title="App Insights - config" />
      <Code code={appInsights.context} title="App Insights - context" />
    </>
  )
}

export default AppInsightsInfo
