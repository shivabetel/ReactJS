import pendingSessionRefresh from '../../../utils/stacks/pending-session-refresh'

export function handleResponseAction (resp = {}, successCallBack = () => {}, failureCallBack = () => {}) {
  if (resp.apiResponseCode === 'success') {
    successCallBack()
  } else if (resp.apiResponseCode === 'failure') {
    failureCallBack()
  } else {
    // default action
  }
}

export function isSessionExpired (status = 0) {
  const arrLen = pendingSessionRefresh.getStackSize()
  console.log(`pendingSessionRefresh arrLen`, arrLen)
  if (arrLen >= 2) {
    return 'failure'
  }
  if (`${status}` === '401') {
    return 'pending'
  }
}
