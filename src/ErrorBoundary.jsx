import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppInsightsContext } from './AppInsightsContext'
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
    const { appInsights, getLogUrl, sessionId } = this.context
    const errorInfoFormatted = errorInfo
    if (errorInfo.componentStack) {
      errorInfoFormatted.componentStack = errorInfoFormatted.componentStack
        .trim()
        .split('\n')
        .map((e) => e.trim().split('at ')[1])
    }
    const combinedError = { error, errorInfo: errorInfoFormatted }
    this.setState({ error: combinedError })
    const appInsightsPropertiesRequestId = uuidv4()
    try {
      appInsights.trackException(
        { error: combinedError },
        { appInsightsPropertiesRequestId }
      )
    } catch (err) {
      console.log(err)
    }

    const formattedUrl =
      url ||
      getLogUrl({
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

ErrorBoundary.contextType = AppInsightsContext

export default ErrorBoundary
