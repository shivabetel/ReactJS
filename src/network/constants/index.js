const WEB_PLATFORM = 'web'
const WEBVIEW_PLATFORM = 'web-view'
const DUMMY_SESSION_ID_SIT = '02449ed5-d878-40f5-aa05-33aa5ce8e61d'
const DUMMY_SESSION_ID_PP = '830987eb-1c44-4be2-9704-131ec1a0c3a3' // 830987eb-1c44-4be2-9704-131ec1a0c3a3, 5cc2a739-9ca0-4d24-b48c-9ef6d5396942
const LOG_LEVELS = {
  debug: 1,
  verbose: 2,
  info: 3,
  warn: 4,
  error: 5,
  critical: 6
}

const constants = Object.freeze({
  WEBVIEW_PLATFORM,
  DUMMY_SESSION_ID_SIT,
  DUMMY_SESSION_ID_PP,
  WEB_PLATFORM,
  LOG_LEVELS,
  JPB_COMMON: 'JPB_COMMON',
  JPB_APP: 'JPB_APP',
  JPB_PG: 'JPB_PG',
  PROD_ENV: 'PROD_ENV',
  DEV_ENV: 'DEV_ENV',
  SIT_ENV: 'SIT_ENV',
  PP_ENV: 'PP_ENV',
  QA_ENV: 'QA_ENV',
  LOAD_ENV: 'LOAD_ENV'
})

module.exports = constants
