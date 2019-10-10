import { getCurrentAppStep } from '../../utils/location'
import { trimLowerCase } from '../../utils/string'
import { SessionStorage } from '../../utils/caching'
import pubSubInst from '../../utils/pub-sub'
import endpoints from '../../network/core/api-base-paths'
import config from 'config'

export function isMpinRequired (actionPerformed = '') {
  const { mpinRules = [] } = SessionStorage.get('MPIN_RULES') || { 'mpinRules': [] }
  if (!mpinRules) {
    return false
  }
  if (mpinRules.length === 0) {
    return false
  }
  const rulesByAction = getRulesByAction(mpinRules, actionPerformed)
  let matchedRule = doesRuleApply(rulesByAction)
  console.log('isMpinRequired - matchedRule', matchedRule)
  if (!matchedRule) {
    return false
  }
  if (!matchedRule.level) {
    return false
  }
  if (isAlwaysMpin(matchedRule)) {
    return checkMpin(matchedRule)
  }
  if (isSessionMpinValidated(matchedRule)) {
    return false
  }
  return checkMpin(matchedRule)
}

function checkMpin (matchedRule = {}) {
  console.log('enter mpin', matchedRule)
  const { level = '' } = matchedRule
  if (trimLowerCase(level) === 'mpin_session') {
    SessionStorage.set('MPIN_SESSION', true)
    pubSubInst.publish('ENTER_MPIN')
  }

  if (trimLowerCase(level) === 'mpin_always') {
    pubSubInst.publish('ENTER_MPIN')
  }
  return true
}

function doesRuleApply (rulesByAction = []) {
  const { parentModule: currentParentModule = '', module: currentModule = '' } = getCurrentAppStep()
  console.log('doesRuleApply path', currentParentModule, currentModule)
  let matchedRule = null
  rulesByAction.some((item, index) => {
    const { page: parentModule = '', module: _module = '' } = item
    console.log('doesRuleApply config', parentModule, _module)
    if (_module) {
      if (trimLowerCase(parentModule) === trimLowerCase(currentParentModule) && trimLowerCase(_module) === trimLowerCase(currentModule)) {
        matchedRule = item
        return true
      }
    } else if (trimLowerCase(parentModule) === trimLowerCase(currentParentModule)) {
      matchedRule = item
      return true
    }
  })
  return matchedRule
}

function getRulesByAction (mpinRules = [], actionPerformed = '') {
  let rulesByAction = mpinRules.filter((element) => {
    return (trimLowerCase(element.action || '') === trimLowerCase(actionPerformed || ''))
  })
  return rulesByAction
}

function isSessionMpinValidated (matchedRule = {}) {
  return SessionStorage.get('MPIN_SESSION')
}

function isAlwaysMpin (matchedRule = {}) {
  return (trimLowerCase(matchedRule.level) === 'mpin_always')
}

export const getFont = (fontName = '') => {
  const { env } = config
  const basePath = endpoints['JPB_FONTS'][env]
  return `${basePath}/${fontName}`
}

export const getIcon = (iconName = '') => {
  const { env } = config
  const basePath = endpoints['JPB_ICONS'][env]
  return `${basePath}/${iconName}`
}

export const getImage = (imageName = '') => {
  const { env } = config
  const basePath = endpoints['JPB_IMAGES'][env]
  return `${basePath}/${imageName}`
}
