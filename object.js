const cachedFunctions = {
  isEqual: null,
  unset: null
}

function getNewObjectCopy (ogObj) {
  let clone = {}
  return objClone(clone, ogObj)
}

function objClone (clone, obj) {
  try {
    for (var i in obj) { clone[i] = (typeof obj[i] === 'object' && obj[i] != null) ? this.objClone(obj[i].constructor(), obj[i]) : obj[i] }
  } catch (e) {

  }
  return clone
}

function cleanObject (obj = {}) {
  Object.keys(obj).forEach(k => {
    if (obj[k] && typeof obj[k] === 'object') {
      cleanObject(obj[k])
    } else if (!obj[k] && obj[k] !== undefined) {
      delete obj[k]
    }
  })
  return obj
}

function deepCompare (obj1 = {}, obj2 = {}) {
  if (!cachedFunctions.isEqual) {
    return new Promise((resolve, reject) => {
      require.ensure(['lodash/isEqual'], function (require) {
        const isEqual = require('lodash/isEqual')
        cachedFunctions.isEqual = isEqual
        resolve(isEqual(obj1, obj2))
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve(cachedFunctions.isEqual(obj1, obj2))
    })
  }
}

function unset (obj = {}, keyPath = '') {
  if (!cachedFunctions.isEqual) {
    return new Promise((resolve, reject) => {
      require.ensure(['lodash/unset'], function (require) {
        const unset = require('lodash/unset')
        cachedFunctions.unset = unset
        resolve(unset(obj, keyPath))
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve(cachedFunctions.unset(obj, keyPath))
    })
  }
}

function findByKey (obj = {}, keyToBeFound = '') {
  obj = flatten(obj)
  return obj[keyToBeFound]
}

function flatten (obj = {}) {
  return Object.assign(
    {},
    ...(function _flatten (o = {}) {
      return [].concat(...Object.keys(o || {})
        .map(k =>
          typeof o[k] === 'object'
            ? _flatten(o[k] || {})
            : ({ [k]: o[k] })
        )
      )
    }(obj))
  )
}

export { getNewObjectCopy, cleanObject, deepCompare, unset, findByKey }
