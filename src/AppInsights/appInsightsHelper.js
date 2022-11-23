const HEADERS = Object.freeze({
  LOG_URL: 'LOG-URL',
})

const getLogUrl = ({
  appInsightsConfig, // Constant with INSTANCE_NAME, INSTRUMENTATION_KEY, NAME, RESOURCE_GROUP, SUBSCRIPTION_ID, and TENANT_ID
  requestId, // unique id for this request
  sessionId, // unique id for this session
}) => {
  const { INSTANCE_NAME, NAME, RESOURCE_GROUP, SUBSCRIPTION_ID, TENANT_ID } =
    appInsightsConfig
  const query = `customEvents | where session_Id == "${sessionId}" and name == "${NAME}" and customDimensions["requestId"] == "${requestId}"`
  const url = `https://portal.azure.com/#@${TENANT_ID}/blade/Microsoft_Azure_Monitoring_Logs/LogsBlade/resourceId/%2Fsubscriptions%2F${SUBSCRIPTION_ID}%2FresourceGroups%2F${RESOURCE_GROUP}%2Fproviders%2Fmicrosoft.insights%2Fcomponents%2F${INSTANCE_NAME}/source/LogsBlade.AnalyticsShareLinkToQuery/query/${encodeURI(
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

  const description = `## Environment
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
  appInsights, // AppInsights Client Instance
  appInsightsConfig, // Constant with INSTANCE_NAME, INSTRUMENTATION_KEY, NAME, RESOURCE_GROUP, SUBSCRIPTION_ID, and TENANT_ID
  environment, // DEV, QA, PROD, etc
  logToConsole, // true || false
  options, // fetch options
  requestId, // unique id for this request
  resource, // fetch resource
  response, // fetch response
  sessionId, // unique id for this session
  tier, // CLIENT || API
}) => {
  const resourcePath = new URL(resource).pathname

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
    name: appInsightsConfig.NAME,
    request: { resource, options },
    resourcePath,
    response,
  })

  const createIssueUrl = getCreateIssueUrl({ description, summary })

  trackEvent({
    appInsights,
    createIssueUrl,
    description,
    environment,
    logs,
    name: appInsightsConfig.NAME,
    request: { resource, options },
    requestId,
    resourcePath,
    response,
    summary,
    tier,
  })

  if (logToConsole) {
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
}

const trackEvent = async ({
  appInsights,
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
  tier,
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
  const issueMarkdown = `# Summary: ${summary}\n\n${description}`
  const customDimensions = {
    createIssueUrl,
    environment,
    issueMarkdown,
    logs,
    request,
    requestId,
    resourcePath,
    response: responseFormatted,
    tier,
  }
  if (tier === 'CLIENT') {
    // web version
    appInsights.trackEvent(
      {
        name,
      },
      {
        ...customDimensions,
      }
    )
  } else {
    // node version
    appInsights.context.tags['ai.session.id'] =
      request.headers.appinsightscontextsessionid
    appInsights.trackEvent({
      name,
      properties: {
        ...customDimensions,
      },
    })
  }
}

export { getLogUrl, handleTelemetry }
