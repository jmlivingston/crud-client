import { nanoid } from 'nanoid'
import React, { Component } from 'react'
import { appInsights } from './AppInsights/appInsights'
import { getLogUrl, getSessionInfo } from './AppInsights/appInsightsHelper'
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
    const {
      info: { sessionId },
    } = getSessionInfo({ key: STORAGE_KEYS.APP_INSIGHTS_INFO })
    const errorInfoFormatted = errorInfo
    if (errorInfo.componentStack) {
      errorInfoFormatted.componentStack = errorInfoFormatted.componentStack
        .trim()
        .split('\n')
        .map((e) => e.trim().split('at ')[1])
    }
    const combinedError = { error, errorInfo: errorInfoFormatted }
    this.setState({ error: combinedError })
    const appInsightsPropertiesRequestId = nanoid()
    try {
      appInsights.trackException(
        { error: combinedError },
        { appInsightsPropertiesRequestId }
      )
    } catch (err) {
      console.log(err)
    }

    const formattedUrl = getLogUrl({
      appInsightsConfig: APP_INSIGHTS,
      requestId: appInsightsPropertiesRequestId,
      sessionId,
    })
    console.error(`Azure Log`, formattedUrl)
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Code code={this.state.error} title="Error" />
          Try Clearning Storage Keys?
          <button
            onClick={() => {
              sessionStorage.removeItem(STORAGE_KEYS.APP_INSIGHTS_INFO)
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
