import { isMockMode } from '../utils/app/is-dev-mode'
import { HeapStorageUtil } from 'utils/caching'
import { findByKey } from '../utils/object'
import { isSessionExpired } from '../utils/app/handle-response-action'
import { isMpinRequired } from '../utils/app'
import pendingSessionRefresh from '../utils/stacks/pending-session-refresh'
import pendingMpinValidation from '../utils/stacks/pending-mpin-validation'
import pubsubInst from '../utils/pub-sub'

export const apiCallHandler = f => ({ mockFunction = '', options = {}, isCacheable = null }) => {
  return function (...args) {
    let cacheKey = ''
    // check if mpin needed here
    let deriveFunctionName = mockFunction
    deriveFunctionName = deriveFunctionName.replace('mock', '')
    console.log('apiCallHandler called', deriveFunctionName)
    if (isMpinRequired(deriveFunctionName)) {
      const funcArgs = Array.prototype.slice.call(args)[0]
      enterMpin(f.bind(this, funcArgs), funcArgs, { cacheKey, mockFunction, options, isCacheable })
      return new Promise((resolve, reject) => {
        resolve({
          'payload': {
            'responseCode': '202',
            'responseMessage': 'Requires Mpin'
          }
        })
      })
    }

    if (isCacheable) {
      cacheKey = deriveKeysFromInputParams(Array.prototype.slice.call(args)[0])
    }
    const cachedResp = HeapStorageUtil.get(cacheKey, options)
    if (cachedResp) {
      return new Promise((resolve, reject) => {
        resolve(cachedResp)
      })
    }

    return new Promise((resolve, reject) => {
      f.call(this, Array.prototype.slice.call(args)[0])
        .then((resp) => {
          // refresh session can be done here
          if (isSessionExpired(findByKey(resp, 'responseCode')) === 'pending') {
            // push to promise queue here
            const funcArgs = Array.prototype.slice.call(args)[0]
            refreshSession(f.bind(this, funcArgs), funcArgs, { cacheKey, mockFunction, options, isCacheable })
            return
          }

          if (isSessionExpired(findByKey(resp, 'responseCode')) === 'failure') {
            console.log('session expired', resp)
            resolve(resp)
            return
          }

          if (cacheKey) {
            HeapStorageUtil.set(cacheKey, resp, {})
          }
          resolve(resp)
        })
        .catch((err) => {
          console.log(err)
          if (isMockMode()) {
            console.log(`mocking - ${f.name}`)
            const mockUtil = new Promise((resolve) => {
              require.ensure([], (require) => resolve(require(`./mock`)), 'mockUtil')
            })
            mockUtil
              .then((_mockFunction) => {
                _mockFunction[mockFunction]()
                  .then((resp) => {
                    console.log(resp)
                    resolve(resp)
                  })
              })
            return
          }
          reject(err)
        })
    })
  }
}

function refreshSession (origFunc = () => {}, funcArgs = {}, curryArgs = {}) {
  pendingSessionRefresh.push({
    'func': origFunc,
    'curryArgs': curryArgs,
    'funcArgs': funcArgs
  })
  pubsubInst.publish('REFRESH_SESSION')
}

function enterMpin (origFunc = () => {}, funcArgs = {}, curryArgs = {}) {
  pendingMpinValidation.push({
    'func': origFunc,
    'curryArgs': curryArgs,
    'funcArgs': funcArgs
  })
}

function deriveKeysFromInputParams (params = {}) {
  return Object.keys(params).reduce((acc, key) => {
    return (acc = `${acc}${params[key] || ''}`)
  }, '')
}
