import React, { useContext } from 'react'
import Code from '../Code'
import { setAppInsightsInfo } from '../helpers/storageHelper'
import { AppInsightsContext } from './AppInsightsContext'

const AppInsightsInfo = () => {
  const { appInsights, sessionId, setSessionId } =
    useContext(AppInsightsContext)

  const onSetAppInsightsInfo = () => {
    const info = setAppInsightsInfo()
    setSessionId(info.session.id)
  }

  return (
    <>
      <h2>AppInsightsInfo</h2>
      Used to mimic a session that can be sent to Application Insights.
      <div className="row">
        <div className="col-9">ID: {sessionId}</div>
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
