import React from 'react'
import Code from '../Code'
import {
  getAppInsightsInfo,
  setAppInsightsInfo,
} from '../helpers/storageHelper'
import { appInsights } from './appInsights'
import { setSessionId } from './appInsightsHelper'

const AppInsightsInfo = () => {
  const {
    session: { id: sessionId },
  } = getAppInsightsInfo()

  const onSetAppInsightsInfo = () => {
    const info = setAppInsightsInfo()
    setSessionId(info.session.id)
  }

  return appInsights ? (
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
  ) : null
}

export default AppInsightsInfo
