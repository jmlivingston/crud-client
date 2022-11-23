import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { getAppInsightsInfo } from './helpers/storageHelper'

const AppInsightsContext = createContext()

const AppInsightsContextProvider = ({ children, instrumentationKey }) => {
  const HEADERS = Object.freeze({
    LOG_URL: 'LOG-URL',
  })

  const [appInsights, setAppInsights] = useState()
  useEffect(() => {
    const appInsightsInstance = new ApplicationInsights({
      config: {
        instrumentationKey,
      },
    })
    appInsightsInstance.loadAppInsights()
    appInsightsInstance.trackPageView()
    const info = getAppInsightsInfo()
    appInsightsInstance.context.session.id = info.session.id
    setAppInsights(appInsightsInstance)
  }, [])

  const getLogUrl = ({ appInsightsConfig, logName, requestId, sessionId }) => {
    const { INSTANCE_NAME, RESOURCE_GROUP, SUBSCRIPTION_ID, TENANT_ID } =
      appInsightsConfig
    const query = `customEvents | where session_Id == "${sessionId}" and name == "${logName}" and customDimensions["requestId"] == "${requestId}"`
    const url = `https://portal.azure.com/#@${TENANT_ID}/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/resourceId/%2Fsubscriptions%2F${SUBSCRIPTION_ID}%2FRESOURCE_GROUPs%2F${RESOURCE_GROUP}%2Fproviders%2Fmicrosoft.insights%2Fcomponents%2F${INSTANCE_NAME}/source/LogsBlade.AnalyticsShareLinkToQuery/query/${encodeURI(
      query
    )}/timespan/TIMESPAN`
    return url
  }

  const getIssueMarkdown = ({
    environment,
    logs,
    name,
    request,
    resourcePath,
    response,
  }) => {
    const summary = `${name} - (${request.options.method}) ${resourcePath} - Error: ${response.status} (${response.statusText})`

    const description = `
  ## Environment
  ${environment}
  
  ## Request
  (${request.options.method}) ${resourcePath} - ${request.resource}
  
  ## Body
  \`\`\`json
  ${JSON.stringify(request?.options?.body || 'N/A', null, 2)}
  \`\`\`
  
  ## Response
  \`\`\`json
  ${JSON.stringify(response.data, null, 2)}
  \`\`\`
  
  ## Log URL
  ${logs?.map(({ name, url }) => `- [${name}](${url})`).join('\n')}
  `
    return { description, summary }
  }

  const getCreateIssueUrl = ({ description, summary }) => {
    return `https://vikingtravel.atlassian.net/secure/CreateIssueDetails!Init.jspa?pid=10041&issuetype=10004&summary=${encodeURIComponent(
      summary
    )}&description=${encodeURIComponent(description)}`
  }

  const handleTelemetry = ({
    appInsightsConfig,
    environment,
    name,
    options,
    requestId,
    resource,
    resourcePath,
    response,
    sessionId,
  }) => {
    const logs = [
      { name: 'API', url: response.headers.get(HEADERS.LOG_URL) },
      {
        name: 'Client',
        url: getLogUrl({
          appInsightsConfig,
          requestId,
          sessionId,
        }),
      },
    ]

    const { description, summary } = getIssueMarkdown({
      environment,
      logs,
      name,
      request: { resource, options },
      resourcePath,
      response,
    })

    const createIssueUrl = getCreateIssueUrl({ description, summary })

    trackEvent({
      createIssueUrl,
      description,
      logs,
      name,
      request: { resource, options },
      requestId,
      resourcePath,
      response,
      summary,
    })

    console.groupCollapsed(`Azure Logs${response.ok ? '' : ' - Error'}`)
    console.log('(Note: May take a few minutes before logs appear.)')
    logs.map(({ name, url }) => console.log(name, url))
    console.log(
      'Create JIRA issue with link or copying and pasting markdown below.'
    )
    console.log(`Link: ${createIssueUrl}`)
    console.log(`Summary: ${summary}\n\nDescription:\n${description}`)
    console.groupEnd()
  }

  const trackEvent = async ({
    createIssueUrl,
    description,
    environment,
    logs,
    name,
    request,
    requestId,
    resourcePath,
    response,
    summary,
  }) => {
    const responseFormatted = response
      ? {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          data: await response.json(),
        }
      : {}
    appInsights.trackEvent(
      {
        name,
      },
      {
        createIssueUrl,
        environment,
        issueMarkdown: `# Summary: ${summary}\n\n${description}`,
        logs,
        request,
        requestId,
        resourcePath,
        response: responseFormatted,
        tier: 'API',
      }
    )
  }

  const value = useMemo(
    () => ({
      appInsights,
      getLogUrl,
      handleTelemetry,
      sessionId: appInsights?.context?.session.id,
    }),
    [appInsights]
  )

  return appInsights ? (
    <AppInsightsContext.Provider value={value}>
      {children}
    </AppInsightsContext.Provider>
  ) : null
}

export { AppInsightsContext, AppInsightsContextProvider }
