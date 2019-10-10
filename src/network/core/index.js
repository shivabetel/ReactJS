import apiBasePaths from './api-base-paths'
import config from 'config'
import { getItem } from '../../utils/cookie'
// import { isProdApp } from '../../utils/app/is-dev-mode'
import { COOKIES } from '../../app-constants'

const SESSION_COOKIE_ID = COOKIES['SESSION_COOKIE_ID']

class ApiRegistry {
  constructor () {
    this._apiConfigs = []
    this._defaultOptions = {}
    this._messageConfigs = {}
  }

  getUrl (apiName, env) {
    let url = ''
    let endPoint = ''
    this._apiConfigs.forEach((apiConfig) => {
      const api = apiConfig.apis[apiName]
      url = api || url
      endPoint = api ? apiConfig.endPoint : endPoint
    })
    const basePathConfig = apiBasePaths[endPoint] || ''
    const basePath = basePathConfig[env] || ''
    return basePath + url.route
  }

  getMessage (apiName, httpStatus = 400, err = {}) {
    const { errorObj = {} } = err
    const { payload = {} } = errorObj
    const { responseMessage = '', responseCode = '1' } = payload
    httpStatus = responseCode || httpStatus
    const apiConfig = this._messageConfigs[apiName] || {}
    const statusConfig = apiConfig[httpStatus] || ''
    let msg = responseMessage || statusConfig.webMsg || ''
    // if (!isProdApp()) {
    //   msg = `${msg} - ${responseCode} - ${httpStatus}`
    // }
    return msg
  }

  getSessionId () {
    return getItem(SESSION_COOKIE_ID)
  }

  getPath (apiName, opt) {
    const { env } = config
    const defaultOptions = {}
    Object.assign(defaultOptions, this._defaultOptions)
    const endPoint = this.getUrl(apiName, env)
    let basePath
    let hash = {}
    let queryString = ''
    basePath = endPoint || ''
    hash = Object.assign({}, defaultOptions, opt.pathVars || {})
    Object.keys(hash).forEach((keyName) => {
      basePath = basePath.replace(new RegExp(`{${keyName}}`, 'g'), (hash[keyName] || ''))
    })
    if (opt.querystring) {
      hash = Object.assign({}, opt.querystring || {})
      Object.keys(hash).forEach((keyName) => {
        queryString += `&${keyName}=${hash[keyName]}`
      })
      const containsQuery = basePath.indexOf('?') > 0
      if (!containsQuery) {
        queryString = (queryString || '').substring(1)
        basePath = `${basePath}?`
      }
      return basePath + queryString
    };

    return basePath
  }
}

export default ApiRegistry
