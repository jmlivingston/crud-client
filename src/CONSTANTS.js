const BASE_URL_BROKEN = 'http://localhost:4000/todos-broken-path/'
const BASE_URL = 'http://localhost:4000/todos/'

const APP_INSIGHTS_CONFIG = Object.freeze({
  INSTANCE_NAME: import.meta.env.VITE_APP_INSIGHTS_INSTANCE_NAME,
  RESOURCE_GROUP: import.meta.env.VITE_APP_INSIGHTS_RESOURCE_GROUP,
  SUBSCRIPTION_ID: import.meta.env.VITE_APP_INSIGHTS_SUBSCRIPTION_ID,
  TENANT_ID: import.meta.env.VITE_APP_INSIGHTS_TENANT_ID,
})

const STORAGE_KEYS = Object.freeze({
  APP_INSIGHTS_INFO: 'APP_INSIGHTS_INFO',
})

export { APP_INSIGHTS_CONFIG, BASE_URL, BASE_URL_BROKEN, STORAGE_KEYS }
