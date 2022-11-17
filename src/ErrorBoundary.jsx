import React, { Component } from 'react'
import { appInsights } from './appInsights'
import Code from './Code'
import { STORAGE_KEYS } from './CONSTANTS'

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
    try {
      appInsights.trackException({ error: combinedError })
    } catch (err) {
      console.log(err)
    }
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
