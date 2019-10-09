const APP_ROUTES = require('../../routes-list')

class PageCacheControl {
  setPageCache = (pageContext = {}) => {
    let { res = {}, req = {} } = pageContext
    let { statusCode = '' } = res
    let { url = '' } = req
    console.log(`${url} - ${statusCode}`)
    if ((statusCode > 199 && statusCode < 300)) {
      this.setPublicCache(pageContext)
    } else {
      this.setNoCache(pageContext)
      // TODO remove this conditon after adding favicon.ico
      if (url !== '/favicon.ico') {
        throw new Error('Could not process the request')
      }
    }
  }

  setNoCache (pageContext = {}) {
    let { res = {} } = pageContext
    res.setHeader('Cache-Control', 'no-cache; no-store; must-revalidate')
    return pageContext
  }

  setPublicCache = (pageContext = {}) => {
    let { res = {}, pathname = '' } = pageContext
    const cachingTime = this.getPageLevelCache(pathname)
    res.setHeader('Cache-Control', `max-age=${cachingTime['max-age']}; s-maxage=${cachingTime['s-maxage']}; X-Accel-Expires=${cachingTime['X-Accel-Expires']} public`)
    return pageContext
  }

  setPrivateCache (pageContext = {}) {
    let { res = {}, pathname = '' } = pageContext
    const cachingTime = this.getPageLevelCache(pathname)
    res.setHeader('Cache-Control', `max-age=${cachingTime['max-age']}; s-maxage=${cachingTime['s-maxage']}; X-Accel-Expires=${cachingTime['X-Accel-Expires']} private`)
    return pageContext
  }

  // value in seconds
  getPageLevelCache = (page = '') => {
    const defaultMaxAge = {
      'max-age': this.getCacheTime(24),
      's-maxage': this.getCacheTime(24),
      'X-Accel-Expires': this.getCacheTime(24)
    }

    // handling root route
    if (page === '/') { page = 'index' }
    page = page.replace('/', '')
    let currentRouteRules = APP_ROUTES.filter((routeItem) => {
      return routeItem['name'] === page
    })
    if (currentRouteRules && currentRouteRules[0]) {
      return {
        'max-age': this.getCacheTime(currentRouteRules[0]['max-age']),
        's-maxage': this.getCacheTime(currentRouteRules[0]['s-maxage']),
        'X-Accel-Expires': this.getCacheTime(currentRouteRules[0]['X-Accel-Expires'])
      }
    }

    return defaultMaxAge
  }

  /**
   *
   * @param {*} inputHrs - pass input an integer considering no.of hours for which we need the cache
   */
  getCacheTime (inputDays = 7) {
    return (inputDays * 24 * 60 * 60)
  }
}

export default PageCacheControl
