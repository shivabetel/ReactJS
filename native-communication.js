/* global btoa */
import canUseDOM from 'can-use-dom'
import { trimUpperCase, trimLowerCase } from '../../src/utils/string'
import { setItem } from '../utils/cookie'
import { COOKIES } from '../app-constants'
import { isMockMode } from '../utils/app/is-dev-mode'
import pubSubInst from '../utils/pub-sub'
import { goHome } from '../native-messages'
const SESSION_COOKIE_ID = COOKIES['SESSION_COOKIE_ID']

let communicationApi = {
  data: {},
  module: '',
  event: '',
  version: '',
  options: {}
}

class NativeCommunication {
  constructor (store) {
    this.store = store
    if (canUseDOM) {
      window.callWebview = this.callWebview
      window.JPBHandleNativeResponse = this.JPBHandleNativeResponse
    }
  }

    isReady = () => {
      console.log('native comp is ready')
      communicationApi['module'] = 'JPB'
      communicationApi['event'] = 'IS_READY'
      this.callNative(communicationApi)
    }

    goHomeNative = () => {
      this.callNative(goHome)
    }

    callNative = (msgObj = {}, mockResp = null) => {
      mockResp = mockResp || msgObj
      if (this.isAndroid()) {
        return this.callAndroid(msgObj)
      } else if (this.isIOS()) {
        return this.callIOS(msgObj)
      } else {
        if (isMockMode()) {
          console.log('running native communication in mock mode')
          setTimeout(() => {
            this.callWebview(mockResp)
          }, 500)
        } else {
          console.log('non web view', JSON.stringify(msgObj), msgObj)
        }
      }
    }

    callAndroid = (msgObj = { type: 'dashboard' }) => {
      const msg = JSON.stringify(msgObj)
      console.log('call android', msg, msgObj)
      window.WebViewInterface && window.WebViewInterface.receiveString(msg)
      return true
    }

    callIOS = (msgObj = { type: 'dashboard' }) => {
      const msg = btoa(msgObj)
      console.log('call ios', msg, msgObj)
      window.webkit && window.webkit.messageHandlers.callback.postMessage(msg)
      return true
    }

    callWebview = (msgObj = '') => {
      // handle all response types here (msgObj.event)
      // dynamically import the action file and then use the action
      // this.store.dispatch(action)
      try {
        msgObj = JSON.parse(msgObj)
      } catch (e) {
        console.log(e)
      }
      if (!msgObj.event) {
        communicationApi['event'] = 'ERROR'
        communicationApi['data'] = '{ "message": "event name is blank"}'
        this.callNative(communicationApi)
        return
      }
      console.log('call webview')
      switch (trimUpperCase(msgObj.event)) {
        case 'SET_SESSIONID':
          setItem(SESSION_COOKIE_ID, msgObj['data']['session_id'])
          break
        case 'SELECTED_CONTACT':
          pubSubInst.publish('SEND_MONEY_CONTACT_SELECTED', msgObj)
          break
        case 'SESSION_REFRESHED':
          pubSubInst.publish('SESSION_REFRESHED', msgObj)
          break
        case 'MPIN_ENTERED':
          pubSubInst.publish('MPIN_ENTERED', msgObj)
          break
        case 'IS_READY':
          console.log('native comm is ready')
          break
        case 'RECIEVED_ACCOUNT_DETAILS':
          pubSubInst.publish('RECIEVED_ACCOUNT_DETAILS', msgObj)
          break
        default:
      }
    }

    // TODO remove this
    JPBHandleNativeResponse = () => {

    }

    // TODO improve this UA check
    isAndroid = () => {
      if (navigator.userAgent) {
        return /android/.test(trimLowerCase(navigator.userAgent))
      }
    }

    isIOS = () => {
      if (navigator.userAgent) {
        return /iphone|ipod|ipad/.test(trimLowerCase(navigator.userAgent))
      }
    }
}

export default NativeCommunication
