import React, { useState } from 'react'
import { appInsights } from './appInsights'
import Code from './Code'
import { getSession, setSession } from './helpers/sessionHelper'

const Session = () => {
  const [sessionDetails, setSessionDetails] = useState(getSession())
  const onSetSession = () => {
    const session = setSession()
    appInsights.context.session.id = session.id
    setSessionDetails(session)
  }
  return (
    <>
      <h2>Session</h2>
      Used to mimic a session that can be sent to Application Insights.
      <div className="row">
        <div className="col-9">ID: {sessionDetails.id}</div>
        <div className="col-3">
          <button onClick={onSetSession}>Reset</button>
        </div>
      </div>
      <Code code={appInsights.config} title="App Insights - config" />
      <Code code={appInsights.context} title="App Insights - context" />
    </>
  )
}

export default Session
