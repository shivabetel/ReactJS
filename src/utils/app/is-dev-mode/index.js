import config from 'config'
// import { trimLowerCase } from '../../string'
export function isDevMode () {
  return (config.env && config.env.indexOf('DEV') >= 0)
}

export function isMockMode () {
  return (config.mockMode && (config.mockMode === 'y'))
}

// export function isPPApp () {
//   const host = window.location.host
//   return (trimLowerCase(host).indexOf('sit') >= 0)
// }

// export function isSitApp () {
//   const host = window.location.host
//   return (trimLowerCase(host).indexOf('pp') >= 0)
// }

// export function isLocalApp () {
//   const host = window.location.host
//   return (trimLowerCase(host).indexOf('localhost') >= 0)
// }

// export function isProdApp () {
//   return (!isPPApp() && !isLocalApp() && !isSitApp())
// }
