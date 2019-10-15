import canUseDOM from 'can-use-dom'
import { isDevMode } from '../utils/app/is-dev-mode'
// import pubsubInst from './pub-sub'

// let getEpochTime = null

// pubsubInst.subscribe('DEFERRED_LOADING', () => {
//   require.ensure(['./date'], function (require) {
//     const dateUtil = require('./date')
//     getEpochTime = dateUtil.getEpochTime
//   })
// })

export function deleteAllCookies () {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookieKey = cookies[i]
    const eqPos = cookieKey.indexOf('=')
    const name = eqPos > -1 ? cookieKey.substr(0, eqPos) : cookieKey
    if (!(name.replace(/\s/g, '') === 'device_id')) {
      document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=.jpb.jio.com`
    }
  }
}

/**
     * [setItem this is used to set data]
     * @param {[string]} key [key name ]
     * @param {[string]} val [value]
     * @param {Object} opt [this is optional param, this will contextual options like expiry etc]
     */
export function setItem (key, val, opt = {}) {
  if (canUseDOM) {
    const defaultDomainName = isDevMode() ? window.location.hostname : '.jpb.jio.com'
    const currentDate = new Date()
    const cookieExpiry = currentDate.setDate(currentDate.getDate() + 1)
    const now = new Date()
    const cookiePath = opt.path ? opt.path : '/'
    const cookieDomain = opt.domain ? opt.domain : defaultDomainName
    // expiresAt needs to be in epoch time
    if (typeof opt.expiresAt === 'number') {
      now.setTime(opt.expiresAt)
      opt.expiresAt = now.toUTCString()
    }
    const expires = '; expires=' + (opt.expiresAt ? (opt.expiresAt || '') : cookieExpiry)
    let cookieStr = key + '=' + val + expires + '; path=' + cookiePath
    cookieStr = cookieDomain ? (cookieStr + ';domain=' + cookieDomain) : cookieStr
    document.cookie = cookieStr
    return true
  }
  return false
}

/**
     * [getItem this is to get item]
     * @param  {[string]} key [key name]
     * @return {[string]}     [description]
     */
export function getItem (key = '') {
  if (canUseDOM) {
    let nameEQ = (key + '=').toLowerCase()
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = (ca[i] || '').toLowerCase()
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }
  return null
}

/**
     * [getAllItems description]
     * @return {[type]} [description]
     */
export function getAllItems () {
  if (canUseDOM) {
    let cookiesObj = {}
    let allcookies = document.cookie.split(';')
    for (let i = 0; i < allcookies.length; i++) {
      cookiesObj[allcookies[i].split('=')[0].trim()] = allcookies[i].split('=')[1]
    }
    return cookiesObj
  }
  return null
}

/**
     * [removeItem this is to remove item basis key name]
     * @param  {[string]} key [key name]
     * @return {[bool]}     [description]
     */
export function removeItem (key, opt = {}) {
  if (canUseDOM) {
    opt.expiresAt = 0
    this.setItem(key, '', opt)
    return true
  }
  return false
}

/**
     * [clearAll this is to clear all cookies]
     * @return {[bool]} [description]
     */
export function clearAll () {
  if (canUseDOM) {
    let opt = {}
    opt.expiresAt = (-1 * Date.now())
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      this.setItem(c.split('=')[0], '', opt)
    }
    return true
  }
  return false
}

/**
     * [checkIfExists this is to check if sepcific cookie exists or not]
     * @param  {[string]} key [key name]
     * @return {[bool]}  [description]
     */
export function checkIfExists (key) {
  if (canUseDOM) {
    return !!this.getItem(key)
  }
  return false
}
