
const path = require('path')
const express = require('express')
var basePath = __dirname
var fs = require('fs')
var jsup = require('jsup')

const compression = require('compression')
const next = require('next')
const helmet = require('helmet')
const routes = require('../routes')

const networkConstants = require('../src/network/constants')

const port = parseInt(process.env.PORT, 10) || 3100
const dev = process.env.NODE_ENV !== 'production'
const prod = process.env.NODE_ENV === 'production'
const app = next({ dev })
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  const server = express()

  server.use(helmet())
  server.use(compression())

  const staticPath = path.join(basePath, '../static')
  const packageJsonPath = path.join(basePath, '../package.json')
  const robotsTxtPath = path.join(basePath, '../web-resources/robots.txt')
  const commitsTxtPath = path.join(basePath, '../commits.txt')
  const manifestJsonPath = path.join(basePath, '../web-resources/manifest.json')
  const testResultsPath = path.join(basePath, '../test-report.html')
  const testCoveragePath = path.join(basePath, '../coverage/index.html')
  const tncPath = path.join(basePath, '../external-resources/html/tnc.html')
  const serviceWorkerPath = path.join(basePath, '../.next/service-worker.js')

  server.use('/static', express.static(staticPath, {
    maxAge: '30d',
    immutable: true
  }))

  server.get('/robots.txt', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    fs.createReadStream(robotsTxtPath).pipe(res)
  })

  server.get('/manifest.json', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    fs.createReadStream(manifestJsonPath).pipe(res)
  })

  server.get('/test-report', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    fs.createReadStream(testResultsPath).pipe(res)
  })

  server.get('/test-coverage', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    fs.createReadStream(testCoveragePath).pipe(res)
  })

  server.get('/service-worker.js', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'application/javascript; charset=UTF-8'
    })
    fs.createReadStream(serviceWorkerPath).pipe(res)
  })

  server.get('/app-version', (req, res) => {
    var pckgFilePath = packageJsonPath
    var src = fs.readFileSync(pckgFilePath, 'utf8')
    var gitInfo = fs.readFileSync(commitsTxtPath, 'utf8')
    var commitID = gitInfo.split('\n')[0].split(' ')[1]
    var packageJsonData = jsup(src)
    res.setHeader('Cache-Control', 'no-cache; no-store; must-revalidate')
    res.send(`${packageJsonData.get(['version'])} --- ${commitID}`)
  })

  server.get('/terms-and-conditions', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    fs.createReadStream(tncPath).pipe(res)
  })

  server.get('*', (req, res) => {
    const { query } = req
    if (query && query['auditPage']) {
      const host = req.get('host') || ''
      if (host.toLowerCase().indexOf('pp') >= 0) {
        res.cookie('sessionId', networkConstants.DUMMY_SESSION_ID_PP)
      } else {
        res.cookie('sessionId', networkConstants.DUMMY_SESSION_ID_SIT)
      }
    }
    return handler(req, res)
  })

  /**
   * // 120 second timeout for each request
   */
  const PER_REQ_TIMEOUT = 122 * 1000
  server.on('connection', function (socket) {
    socket.setTimeout(PER_REQ_TIMEOUT)
  })

  startServer()

  function startServer () {
    server.listen(port, () => {
      console.log(`server started on ${port} in ${process.env.NODE_ENV} mode`)
    })
  }

  /**
     * runs only in production
     */
  if (prod) {
    /**
     * so the program will not close instantly
     */
    process.stdin.resume()

    /**
     * this function is called when you want the server to die gracefully, i.e. wait for existing connections
     * @param {*} signal
     */
    var gracefulShutdown = function (signal) {
      /**
       * max time out for the server
       */
      setTimeout(function () {
        process.exit(0)
      }, 5 * 1000)
    }

    /**
     * listen for TERM signal .e.g. kill
     */
    process.on('SIGTERM', gracefulShutdown)

    /**
     * listen for INT signal e.g. Ctrl-C
     */
    process.on('SIGINT', gracefulShutdown)

    process.on('uncaughtException', function (e) {
      console.log(e)
    })
  }
})
