import axios from 'axios'
import httpModule from 'http'
import ApiRegistry from './core'
import { isSessionExpired } from '../utils/app/handle-response-action'
import { appVersion } from '../../app-version'

const netowkrAgent = new httpModule.Agent({
  keepAlive: true,
  maxSockets: 75,
  maxFreeSockets: 50
})

const initialState = {
  errorObj: null,
  errorType: '',
  isError: false,
  isLoading: true,
  lastFetched: 0
}

const apiRegistry = new ApiRegistry()

// TODO change this to 5 seconds
const defaultTimeOut = 10000
const defaultApiHeaders = { appVersion }

const defaultApiOptions = (options) => {
  return Object.assign({
    withCredentials: false,
    headers: Object.assign({}, defaultApiHeaders, (options.headers || {})),
    timeout: options.apiTimeOut || defaultTimeOut,
    validateStatus: (status) => {
      // refresh session - mock pending state during session refresh
      if (isSessionExpired(status) === 'pending') {
        return true
      }
      // fail after n attempts of session refresh
      if (isSessionExpired(status) === 'failure') {
        return false
      }
      return status < 400 // Reject only if the status code is less than 400
    },
    transformRequest: [ (data, headers) => {
      const commonBody = { 'context': {
        'sessionId': apiRegistry.getSessionId(),
        'encryption': false
      } }
      data = Object.assign({ 'payload': { ...data } }, commonBody)
      return JSON.stringify(data)
    }],
    transformResponse: [ (data) => {
      // Do whatever you want to transform the response
      return data
    }]
  }, (options || {}))
}

/**
   * [buildErrorObj this is a generic function to attach custom error params to the api response]
   * @param  {[type]} inputObj [inputApiresponse]
   * @param  {Object} errorObj [JS level errors]
   * @return {[type]}          [object]
**/
const buildErrorObj = (inputObj = { ...initialState }, errorObj = {}) => {
  const { response = {} } = errorObj
  const { status = 0 } = response
  const defaultErrorObjPayload = {
    'payload': {
      'responseCode': '1',
      'responseMessage': 'Something went wrong'
    }
  }

  if (isSessionExpired(status) === 'failure') {
    errorObj = {
      'response': {
        'data': '{"payload":{"responseCode":"4001","responseMessage":"Could not refresh session"}}'
      }
    }
  }

  let { data } = response
  data = JSON.parse(data || '{}')
  const responseObj = Object.assign(defaultErrorObjPayload, data)
  inputObj.isError = true
  inputObj.errorObj = responseObj
  inputObj.errorType = setErrorType(inputObj)
  return new Promise((resolve, reject) => {
    reject(inputObj)
  })
}

const dataToReturn = (resp) => {
  // check for response code 401 - mock pending state during session refresh
  if (isSessionExpired(resp.status) === 'pending') {
    return {
      'payload': {
        'responseCode': '401',
        'responseMessage': 'session-expired'
      }
    }
  }
  let respData = JSON.parse(resp.data)
  respData['status'] = resp.status
  return respData
}

const setErrorType = ({ status = 200 }) => {
  let errorType = ''
  if (status >= 500) {
    errorType = 'server'
  } else if (status >= 400 && status < 500) {
    errorType = 'functional'
  }
  return errorType
}

/*
* This is the Class is a wrapper on top of fetch (isomorphic) which will abstract out all network calls and handle all network level settings
* @class NetWorkLib
*/
class HttpLib {
  /**
    * [jsonGet function to get JSON data]
    * @param  {[type]} apiEndpoint [this is the api end point to which get request is made]
    * @param  {Object} options     [any options like headers, timeouts etc.]
    * @return {[type]}             [description]
    */

  constructor (options = {}) {
    this.axiosAgent = axios.create({ httpAgent: netowkrAgent })
  }

  jsonGet (apiEndpoint, options = {}) {
    return this.axiosAgent(
      {
        method: 'GET',
        url: apiEndpoint,
        ...defaultApiOptions(options)
      }
    )
      .catch(err => {
        return buildErrorObj({}, err)
      })
      .then(resp => {
        return new Promise((resolve, reject) => {
          resolve(dataToReturn(resp))
        })
      })
  }

  /**
     * [xmlGet function to get XML Data for midroll and overlay cue points]
     * @param {[type]} apiEndpoint  [this is the api end point to which the get request is made]
     * @param {Object} options      [any options like headers, timeouts etc.]
     * @return {[type]}             [description]
     */
  xmlGet (apiEndpoint, options = {}) {
    return this.axiosAgent(
      {
        method: 'GET',
        url: apiEndpoint,
        ...defaultApiOptions(options)
      }
    )
      .catch(err => {
        return buildErrorObj({}, err)
      })
      .then(resp => {
        return new Promise((resolve, reject) => {
          resolve(dataToReturn(resp))
        })
      })
  }

  /**
    * [jsonPost function to post json data]
    * @param  {[type]} apiEndpoint [apie end point type string]
    * @param  {Object} options     [data to post type object]
    * @return {[type]}             [promise with success or failure]
    */
  jsonPost (apiEndpoint, options = {}) {
    options.headers = Object.assign((options.headers || {}), {
      'Content-Type': 'application/json'
    })
    return this.axiosAgent({
      method: 'POST',
      url: apiEndpoint,
      ...defaultApiOptions(options)
    }
    )
      .catch(err => {
        return buildErrorObj({}, err)
      })
      .then(resp => {
        return new Promise((resolve, reject) => {
          resolve(dataToReturn(resp))
        })
      })
  }

  /**
    * [textPost function to post json data]
    * @param  {[type]} apiEndpoint [apie end point type string]
    * @param  {Object} options     [data to post type object]
    * @return {[type]}             [promise with success or failure]
    */
  textPost (apiEndpoint, options = {}) {
    options.headers = Object.assign((options.headers || {}), {
      'Content-Type': 'text/plain'
    })

    return this.axiosAgent(
      {
        method: 'POST',
        url: apiEndpoint,
        ...defaultApiOptions(options)
      }
    )
      .catch(err => {
        return buildErrorObj({}, err)
      })
      .then(resp => {
        return new Promise((resolve, reject) => {
          resolve(dataToReturn(resp))
        })
      })
  }

  /**
    * [serializeData description]
    * @param  {[type]} data [description]
    * @return {[type]}      [description]
    */
  serializeData (data) {
    const buffer = []
    Object.keys(data).forEach((name) => {
      const value = data[name]
      buffer.push(`${encodeURIComponent(name)}=${encodeURIComponent((value == null) ? '' : value)}`)
    })
    // Serialize the buffer and clean it up for transportation.
    const source = buffer
      .join('&')
      .replace(/%20/g, '+')
    return source
  }

  /**
    * [formPost function to post form data]
    * @param  {[type]} apiEndpoint [apie end point type string]
    * @param  {Object} options     [data to post type object]
    * @return {[type]}             [promise with success or failure]
    * fetch api adds the right content type automatically for type FormData
    */
  formPost (apiEndpoint, options = {}) {
    options.headers = Object.assign((options.headers || {}), {
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    // const formData = this.serializeData(options.data)

    return this.axiosAgent(
      {
        method: 'POST',
        url: apiEndpoint,
        ...defaultApiOptions(options)
      }
    )
      .catch(err => {
        return buildErrorObj({}, err)
      })
      .then(resp => {
        return new Promise((resolve, reject) => {
          resolve(dataToReturn(resp))
        })
      })
  }

  /**
    * [get generic get]
    * @param  {[type]} apiEndpoint [api end point type string]
    * @param  {Object} options     [data to post type object]
    * @return {[type]}             [promise with success or failure]
    */
  get (apiEndpoint, options = {}) {
    // we can override options headers here as well as per requirement for content and data types
    const getTypes = {
      json: this.jsonGet.bind(this),
      xml: this.xmlGet.bind(this)
    }
    const getType = getTypes[options.type || 'json'] || getTypes.json
    const get = getType
    return get(apiEndpoint, options)
  }

  /**
    * [post generic post]
    * @param  {[type]} apiEndpoint [apie end point type string]
    * @param  {Object} options     [data to post type object]
    * @return {[type]}             [promise with success or failure]
    */
  post (apiEndpoint, options = {}) {
    // we can override options headers here as well as per requirement for content and data types
    const postTypes = {
      json: this.jsonPost.bind(this),
      form: this.formPost.bind(this),
      text: this.textPost.bind(this)
    }
    const postType = postTypes[options.type || 'json']
    const post = postType
    return post(apiEndpoint, options)
  }

  /**
    * [put fetch wrapper to make get requests]
    * @param  {[type]} apiEndpoint [this is the api end point to which put request is made]
    * @param  {Object} options     [any options like headers, timeouts etc.]
    * @return {[type]}             [description]
    */
  put (apiEndpoint, options = {}) {
    options.headers = Object.assign((options.headers || {}), {
      'Content-Type': 'application/json'
    })

    return this.axiosAgent(
      {
        method: 'PUT',
        url: apiEndpoint,
        ...defaultApiOptions(options)
      }
    )
      .catch(err => {
        return buildErrorObj({}, err)
      })
      .then(resp => {
        return new Promise((resolve, reject) => {
          resolve(dataToReturn(resp))
        })
      })
  }

  /**
    * [delete fetch wrapper to make delete requests]
    * @param  {[type]} apiEndpoint [this is the api end point to which delete request is made]
    * @param  {Object} options     [any options like headers, timeouts etc.]
    * @return {[type]}             [description]
    */
  delete (apiEndpoint, options = {}) {
    return this.axiosAgent(
      {
        method: 'DELETE',
        url: apiEndpoint,
        ...defaultApiOptions(options)
      }
    )
      .catch(err => {
        return buildErrorObj({}, err)
      })
      .then(resp => {
        return new Promise((resolve, reject) => {
          resolve(dataToReturn(resp))
        })
      })
  }
}

export default HttpLib
