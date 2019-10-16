import withRedux from 'next-redux-wrapper'
import { withRouter } from 'next/router'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'

import Layout from 'components/core/layout/index'
import baseStyles from '../src/styles/base'

import createStore from 'store/create-store'

import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import getPageContext from 'utils/page-style-context'

import pendingSessionRefresh from '../src/utils/stacks/pending-session-refresh'
import pendingMpinValidation from '../src/utils/stacks/pending-mpin-validation'

import pubsubInst from '../src/utils/pub-sub'
import updatePageTransition from '../src/actions/global/update-page-transition'
import { getAccountDetailsUsingNative } from '../src/actions/global/get-account-balance'
import { getConfigData } from '../src/actions/global/get-master-data'
import Head from 'next/head'
import { trimFirstChar } from '../src/utils/string'
import dynamic from 'next/dynamic'

import { startLoaderTimer } from '../src/analytics'
import { firePageView } from '../src/utils/analytics-utils'
import { getCurrentPathDetails } from '../src/utils/location'

import { apiCallHandler } from '../src/utils/curries'
import { isMpinRequired } from '../src/utils/app'

import updateState from '../src/actions/global/update-state'

const APP_ROUTES = require('../routes-list')

let parseQueryString = null
let setItem = null
let getItem = null
let nativeComm = null
let landingPage = ''
let ackWaitTime = 0
let appConstants = null
let nativeMessages = null
let refreshSessionNativeMsg = null
let refreshSessionMockNativeMsg = null
let getUserAccountDetailsNativeMsg = null
let getUserAccountDetailsMockNativeMsg = null
let enterMpinNativeMsg = null
let enterMpinMockNativeMsg = null
let _configData = null

const Dialog = dynamic(
  () => import('../src/components/commons/dialog-box'),
  {
    loading: () => <div />,
    ssr: false
  }
)

const Toast = dynamic(
  () => import('../src/components/commons/toast'),
  {
    loading: () => <div />,
    ssr: false
  }
)

const ProgressBar = dynamic(
  () => import('components/core/progress-bar'),
  {
    loading: () => <div />,
    ssr: false
  }
)

let handleDialogCancel = null
let handleDialogOk = null

class JioPaymentsBank extends App {
  constructor () {
    super()
    this.pageContext = getPageContext()
    this.state = {
      dialogState: {
        title: '',
        open: false,
        type: '',
        errorMessage: ''
      }
    }
  }

  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {
      pageProps: Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}
    }

    return pageProps
  }

  fetchTitle = (currentRouter) => {
    let routeTitle = 'Jio Payments Bank'
    let currentRoutePathName = trimFirstChar(currentRouter['pathname'])
    APP_ROUTES.some((routeItem) => {
      if (currentRoutePathName === routeItem['name']) {
        routeTitle = routeItem['title'] || 'Jio Payments Bank'
        return true
      }
    })
    return routeTitle
  }

  getPageLevel = (currentRouter) => {
    let pagelevel = 2
    let currentRoutePathName = trimFirstChar(currentRouter['pathname'])
    APP_ROUTES.some((routeItem) => {
      if (currentRoutePathName === routeItem['name']) {
        pagelevel = routeItem.pageLevel
        return true
      }
    })
    return pagelevel
  }

  isTopLevelPage = () => {
    const { router } = this.props
    let isTopLevel = false
    if (this.getPageLevel(router) === 1) {
      return true
    }
    return isTopLevel
  }

  isWhiteHeader = () => {
    const { router } = this.props
    let iswhite = false
    if (this.getPageLevel(router) === 3) {
      return true
    }
    return iswhite
  }

  shallowRouteChangeHandler = (currentRoute = '') => {
    firePageView()
    if (parseQueryString && parseQueryString()['shallow']) {
      const { store } = this.props
      const pageState = {
        'pageState': {
          currentRoute
        }
      }
      store.dispatch(updatePageTransition(pageState))
    }
    isMpinRequired('routeChange')
  }

  openErrorDialog = ({ type = 'error', title = '', message = 'Something went wrong', _handleDialogCancel = () => {}, _handleDialogOk = () => {} }) => {
    handleDialogOk = _handleDialogOk
    handleDialogCancel = _handleDialogCancel
    this.setState({
      dialogState: {
        type: type,
        title,
        open: true,
        errorMessage: message
      }
    })
  }

  closeDialog = () => {
    this.setState({
      dialogState: {
        open: false
      }
    })
  }

  executeAccountDetailsFunction = (eventName = '', data = {}) => {
    const { store } = this.props
    store.dispatch(getAccountDetailsUsingNative(data))
  }

  componentDidMount () {
    this.removeServerSideInjectedCss()
    this.loadClientSideLibs()

    const { store } = this.props

    store.dispatch(getConfigData({}))

    this.pageContext['store'] = store
    this.loadNativeBridge(store)

    this.registerRouteActions()
    this.loadAnalyticsScripts()

    this.subscribeNativeBlockingCalls()

    landingPage = getCurrentPathDetails()['relativeFullPath']
    firePageView()
  }

  subscribeNativeBlockingCalls = () => {
    pubsubInst.subscribe('SESSION_REFRESHED', this.executeSessionBlockedFunction)
    pubsubInst.subscribe('REFRESH_SESSION', this.refreshSession)
    pubsubInst.subscribe('RECIEVED_ACCOUNT_DETAILS', this.executeAccountDetailsFunction)
    pubsubInst.subscribe('ENTER_MPIN', this.promptMpin)
    pubsubInst.subscribe('MPIN_ENTERED', this.executeMpinBlockedFunction)
  }

  runBlockedFunction = (functionStack = null, commitEevent = '') => {
    if (!functionStack) {
      return false
    }
    if (!commitEevent) {
      return false
    }
    const pendingAction = functionStack.peek()[0]
    if (!pendingAction) {
      return false
    }
    const func = pendingAction.func
    const funcArgs = pendingAction.funcArgs
    const curryArgs = pendingAction.curryArgs
    const funcToCall = apiCallHandler(func)(curryArgs)
    funcToCall()
      .then((resp) => {
        functionStack.clear()
        const { stateNameSpace = '' } = funcArgs
        if (!stateNameSpace) {
          pubsubInst.publish(`${commitEevent}_SUCCESS`, resp)
          return
        }
        const { store } = this.props
        store.dispatch(updateState('', stateNameSpace, resp))
      })
      .catch((err) => {
        functionStack.clear()
        const { stateNameSpace = '' } = funcArgs
        if (!stateNameSpace) {
          pubsubInst.publish(`${commitEevent}_FAILED`, err)
          return
        }
        const { store } = this.props
        store.dispatch(updateState('', stateNameSpace, err))
      })
  }

  executeSessionBlockedFunction = () => {
    this.runBlockedFunction(pendingSessionRefresh, 'REFRESHED_DATA')
  }

  executeMpinBlockedFunction = () => {
    this.runBlockedFunction(pendingMpinValidation, 'MPIN_VALIDATED')
  }

  refreshSession = () => {
    this.loadNativeBridge()
      .then((nativeCommObj) => {
        nativeCommObj.callNative(refreshSessionNativeMsg, refreshSessionMockNativeMsg)
      })
  }

  getUserAccountDetails = () => {
    const nativeCommObj = this.getNativeCommObject()
    nativeCommObj.callNative(getUserAccountDetailsNativeMsg, getUserAccountDetailsMockNativeMsg)
  }

  promptMpin = () => {
    this.loadNativeBridge()
      .then((nativeCommObj) => {
        nativeCommObj.callNative(enterMpinNativeMsg, enterMpinMockNativeMsg)
      })
  }

  loadAnalyticsScripts = () => {
    startLoaderTimer()
  }

  removeServerSideInjectedCss = () => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  registerRouteActions = () => {
    this.props.router.events.on('routeChangeComplete', this.shallowRouteChangeHandler)
  }

  loadNativeBridge = (store = {}) => {
    // load webview - native bridge here
    const nativeCommLib = new Promise((resolve) => {
      require.ensure([], (require) => resolve(require('utils/native-communication').default), 'nativeCommLib')
    })
    return new Promise((resolve, reject) => {
      nativeCommLib
        .then((NativeCommunication) => {
          nativeComm = new NativeCommunication(store)
          nativeComm.isReady()
          this.getUserAccountDetails()
          resolve(nativeComm)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  getNativeCommObject = () => {
    return nativeComm
  }

  _getConfigData = () => {
    return _configData
  }

  getLandingPage = () => {
    return landingPage
  }

  setSessionId = () => {
    const cookieName = (appConstants && appConstants['COOKIES']['SESSION_COOKIE_ID']) || ''
    const sessionCookie = getItem && getItem(cookieName)
    setItem && sessionCookie && setItem(cookieName, sessionCookie)
  }

  loadClientSideLibs = () => {
    let _this = this
    require.ensure(['../src/app-constants'], function (require) {
      const locationUtil = require('../src/utils/location')
      const cookieutil = require('../src/utils/cookie')
      appConstants = require('../src/app-constants')
      nativeMessages = require('../src/native-messages')
      parseQueryString = locationUtil.parseQueryString
      setItem = cookieutil.setItem
      getItem = cookieutil.getItem
      _this.setSessionId()
      refreshSessionNativeMsg = nativeMessages.refreshSession
      refreshSessionMockNativeMsg = nativeMessages.refreshSessionMockResp
      getUserAccountDetailsNativeMsg = nativeMessages.getUserAccountDetails
      getUserAccountDetailsMockNativeMsg = nativeMessages.getUserAccountDetailsMockResp

      enterMpinNativeMsg = nativeMessages.enterMpin
      enterMpinMockNativeMsg = nativeMessages.enterMpinMockResp
      pubsubInst.publish('DEFERRED_LOADING')
    })
  }

  render () {
    const { Component, pageProps, store, router } = this.props
    const { global = {} } = store.getState()
    const { configData = {} } = global

    return (
      <Container >
        <Provider store={store}>
          {/* Wrap every page in Jss and Theme providers */}
          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >

            {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}

            <MuiThemeProvider
              theme={this.pageContext.theme}
              sheetsManager={this.pageContext.sheetsManager}
            >
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}

              <CssBaseline />

              <Head>
                <title>{this.fetchTitle(router)}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' />
              </Head>

              <Layout
                isTopLevelPage={this.isTopLevelPage(router)}
                isWhiteHeader={this.isWhiteHeader(router)}
                router={router}
                getLandingPage={this.getLandingPage}
                getNativeCommObject={this.getNativeCommObject}
              >
                <ProgressBar options={{ easing: 'ease', speed: 500, showSpinner: false }} />
                <Dialog
                  handleDialogCancel={handleDialogCancel}
                  handleDialogOk={handleDialogOk}
                  closeDialog={this.closeDialog}
                  dialogType={this.state.dialogState.type}
                  title={this.state.dialogState.title}
                  open={this.state.dialogState.open}
                  errorMessage={this.state.dialogState.errorMessage}
                />
                <Toast
                  ackWaitTime={ackWaitTime}
                />
                {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
                <Component
                  configData={configData}
                  pageContext={this.pageContext}
                  openErrorDialog={this.openErrorDialog}
                  getNativeCommObject={this.getNativeCommObject}
                  router={router} {...pageProps} />
              </Layout>
              <style jsx global>{baseStyles}</style>

            </MuiThemeProvider>
          </JssProvider>

        </Provider>
      </Container>
    )
  }
}

export { nativeComm }

export default withRedux(createStore)(
  withRouter(JioPaymentsBank)
)
