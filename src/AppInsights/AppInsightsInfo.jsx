import { nanoid } from 'nanoid'
import React from 'react'
import Code from '../Code'
import { STORAGE_KEYS } from '../CONSTANTS'
import { appInsights } from './appInsights'
import {
  getSessionInfo,
  setSessionId,
  setSessionInfo,
} from './appInsightsHelper'

const AppInsightsInfo = () => {
  const {
    session: { id: sessionId },
  } = getSessionInfo({ key: STORAGE_KEYS.APP_INSIGHTS_INFO })

  const onReset = () => {
    const info = setSessionInfo({
      key: STORAGE_KEYS.APP_INSIGHTS_INFO,
      sessionId: nanoid(),
    })
    setSessionId(info.session.id)
  }

  return appInsights ? (
    <>
      <h2>AppInsightsInfo</h2>
      Used to mimic a session that can be sent to Application Insights.
      <div className="row">
        <div className="col-9">ID: {sessionId}</div>
        <div className="col-3">
          <button onClick={onReset}>Reset</button>
        </div>
      </div>
      <Code code={appInsights.config} title="App Insights - config" />
      <Code code={appInsights.context} title="App Insights - context" />
    </>
  ) : null
}

export default AppInsightsInfo
