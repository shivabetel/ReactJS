import canUseDOM from 'can-use-dom'
let heapStore = {}
let defaultExpiryTime = 5 // in minutes
let maxExpiryTime = 10

export const HeapStorageUtil = {
  // opt.expireAt value is considered to be in minutes
  set (key, val, { opt = {} }) {
    if (!canUseDOM) {
      return
    }
    try {
      let valToStore = val
      let expireAt = -1
      let currentDate = new Date()
      opt.expireAt = (opt.expireAt && opt.expireAt > maxExpiryTime) ? maxExpiryTime : 0
      expireAt = opt.expireAt ? (currentDate.setMinutes(currentDate.getMinutes() + opt.expireAt)) : (currentDate.setMinutes(currentDate.getMinutes() + defaultExpiryTime))
      heapStore[key] = {
        val: valToStore,
        expireAt
      }
    } catch (e) {
      console.warn('couldnot store value in HEAP')
    }
  },

  get (key, opt = {}) {
    if (!canUseDOM) {
      return
    }
    const data = heapStore[key]
    const currentDate = new Date().getTime()
    if (typeof data !== 'object') {
      return null
    }
    if (data.expireAt === -1 || data.expireAt >= currentDate) {
      return data.val
    }
    this.clear(key)
  },

  exists (key, opt = {}) {
    if (!canUseDOM) {
      return
    }
    return this.get(key) !== undefined
  },

  clear (key, opt = {}) {
    if (!canUseDOM) {
      return
    }
    delete heapStore[key]
  },

  clearAll (opt = {}) {
    if (!canUseDOM) {
      return
    }
    heapStore = {}
  }
}

export const SessionStorage = {
  set (key, val) {
    if (!canUseDOM) return false
    if (!key) return false
    if (!val) return false
    val = JSON.stringify(val)
    return window.sessionStorage.setItem(key, val)
  },

  get (key) {
    if (!canUseDOM) return false
    if (!key) return false
    let sessionData = window.sessionStorage.getItem(key)
    if (!sessionData) {
      return null
    }
    try {
      sessionData = JSON.parse(sessionData)
    } catch (e) {
      sessionData = null
    }
    return sessionData
  }

}
