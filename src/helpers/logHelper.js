import appInsights from '../appInsights'
import { APP_INSIGHTS, APP_NAME, CUSTOM_HEADERS } from '../CONSTANTS'

const getAppInsightsLogUrl = ({ name, requestId, sessionId }) => {
  const getQueryByName = ({ name, requestId, sessionId }) => {
    let query
    switch (name) {
      case APP_INSIGHTS.QUERIES.REQUEST_BY_SESSION_ID_REQUEST_ID:
        query = `customEvents | where session_Id == "${sessionId}" and name == "${APP_INSIGHTS.LOG_NAME}" and customDimensions["requestId"] == "${requestId}"`
        break
    }
    return query
  }

  const query = getQueryByName({ name, requestId, sessionId })
  const url = `https://portal.azure.com/#@${
    APP_INSIGHTS.TENANT_ID
  }/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/resourceId/%2Fsubscriptions%2F${
    APP_INSIGHTS.SUBSCRIPTION_ID
  }%2FresourceGroups%2F${
    APP_INSIGHTS.RESOURCE_GROUP
  }%2Fproviders%2Fmicrosoft.insights%2Fcomponents%2F${
    APP_INSIGHTS.INSTANCE_NAME
  }/source/LogsBlade.AnalyticsShareLinkToQuery/query/${encodeURI(
    query
  )}/timespan/TIMESPAN`
  return url
}

const getIssueMarkdown = ({
  logUrl,
  name,
  request,
  resourcePath,
  response,
}) => {
  const summary = `${name} - (${request.options.method}) ${resourcePath} - Error: ${response.status} (${response.statusText})`

  const description = `
## Environment
${APP_INSIGHTS.CUSTOM_PROPERTIES.ENVIRONMENT}

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
[${logUrl}](${logUrl})
`
  return { description, summary }
}

const handleTracking = ({
  options,
  requestId,
  resource,
  resourcePath,
  response,
  sessionId,
}) => {
  const apiLogUrl = response.headers.get(CUSTOM_HEADERS.CRUD_API_LOG_URL)
  const clientLogUrl = getAppInsightsLogUrl({
    name: APP_INSIGHTS.QUERIES.REQUEST_BY_SESSION_ID_REQUEST_ID,
    requestId,
    sessionId,
  })
  const error = !response.ok
    ? `${APP_INSIGHTS.LOG_NAME} - (${options.method}) ${resourcePath} - Error: ${response.status} (${response.statusText})`
    : undefined
  trackEvent(
    {
      name: APP_INSIGHTS.LOG_NAME,
    },
    {
      error,
      request: { resource, options },
      requestId,
      response,
    },
    apiLogUrl,
    resourcePath
  )

  const { description, summary } = getIssueMarkdown({
    logUrl: clientLogUrl,
    name: APP_INSIGHTS.LOG_NAME,
    request: { resource, options },
    resourcePath,
    response,
  })

  console.groupCollapsed(`Azure Logs${error ? ' - Error' : ''}`)
  console.log('(Note: May take a few minutes before logs appear.)')
  console.log('API', apiLogUrl)
  console.log('CLIENT', clientLogUrl)
  console.log(
    'Create Core JIRA Ticket',
    `https://vikingtravel.atlassian.net/secure/CreateIssueDetails!Init.jspa?pid=10041&issuetype=10004&summary=${encodeURIComponent(
      summary
    )}&description=${encodeURIComponent(description)}`
  )
  console.log('Issue Markdown', `# Summary ${summary}\n\n${description}`)
  console.groupEnd()
}

const trackEvent = async (
  { name },
  { error, request, requestId, response },
  logUrl,
  resourcePath
) => {
  const responseFormatted = response
    ? {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data: await response.json(),
      }
    : {}
  const { description, summary } = getIssueMarkdown({
    logUrl,
    name,
    request,
    resourcePath,
    response: responseFormatted,
  })
  appInsights.trackEvent(
    {
      name,
    },
    {
      appName: APP_NAME,
      environment: APP_INSIGHTS.CUSTOM_PROPERTIES.ENVIRONMENT,
      error,
      issueMarkdown: `# Summary: ${summary}\n\n${description}`,
      request,
      requestId,
      resourcePath,
      response: responseFormatted,
      tier: 'API',
    }
  )
}

export { getAppInsightsLogUrl, handleTracking }
