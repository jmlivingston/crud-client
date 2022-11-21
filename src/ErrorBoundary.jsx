import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { appInsights, logAppInsightsQueryUrl } from './appInsights'
import Code from './Code'
import { APP_INSIGHTS, STORAGE_KEYS } from './CONSTANTS'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const errorInfoFormatted = errorInfo
    if (errorInfo.componentStack) {
      errorInfoFormatted.componentStack = errorInfoFormatted.componentStack
        .trim()
        .split('\n')
        .map((e) => e.trim().split('at ')[1])
    }
    const combinedError = { error, errorInfo: errorInfoFormatted }
    this.setState({ error: combinedError })
    const appInsightsContextSessionId = appInsights.context.session.id
    const appInsightsPropertiesRequestId = uuidv4()
    try {
      appInsights.trackException(
        { error: combinedError },
        { appInsightsPropertiesRequestId }
      )
    } catch (err) {
      console.log(err)
    }
    logAppInsightsQueryUrl({
      isClient: true,
      method: 'info',
      name: APP_INSIGHTS.QUERIES.REQUEST_BY_SESSION_ID_REQUEST_ID,
      requestId: appInsightsPropertiesRequestId,
      sessionId: appInsightsContextSessionId,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Code code={this.state.error} title="Error" />
          Try Clearning Storage Keys?
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEYS.APP_INSIGHTS_INFO)
              location.reload()
            }}>
            Clear
          </button>
        </>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
