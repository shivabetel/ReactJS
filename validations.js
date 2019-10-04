
import differenceInYears from 'date-fns/differenceInYears'

export const customRegex = {
  specailCharacterRestrictRegex: /[`~!@#$%^&*()_|+\-=?;:'"/\s,.<>{}[\]\\/]/gi,
  onlyNumberAllowedRegex: /[a-zA-Z`~!@#$%^&*()_|+\-=?;:'"/\s,.<>{}[\]\\/]/gi,
  restrictSmileyRegex: /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/gi,
  removeNumber: /\d/g,
  numberOnly: /\D/g,
  emailRegex: /[A-Z a-z 0-9._-]*@[A-Z0-9.-]*.+[a-z 0-9 A-Z]$/,
  INPincodeRegex: /^[1-9][0-9]{5}$/,
  MPIN: /^[0-9]{4}$/,
  validAmountField: /^[1-9][\d]{0,4}(\.\d{0,2})?$/,
  validAmount: /^[1-9][\d]{0,6}(\.\d{0,2})?$/,
  ifsc: /^[A-Za-z]{4}\d{7}$/,
  accno: /^\d{9,18}$/,
  mmid: /^\d{7}$/,
  areaSpecialCharacterRestrictRegex: /[`~!@#$%^&*()_|+=?;:'"/\s.<>{}[\]\\/]/gi,
  validName: /^[a-zA-Z ]{1,48}$/,
  validCityName: /^[a-zA-Z-]{1,48}$/,
  beneficiaryName: /^[a-zA-Z., ]*$/,
  contact: /^\d{10}$/
}

const CREDIT_CARD_TYPES = [
  {
    card: 'visa',
    spaces: [4, 8, 12],
    regexExp: /^4/,
    maxlength: 16,
    minlength: 16,
    cvcLength: 3
  },
  {
    card: 'master',
    spaces: [4, 8, 12],
    regexExp: /^(5[1-5]|2[2-7])/,
    maxlength: 16,
    minlength: 16,
    cvcLength: 3
  },
  {
    card: 'amex',
    spaces: [4, 10],
    regexExp: /^3[47]/,
    maxlength: 15,
    minlength: 15,
    cvcLength: 4
  },
  {
    card: 'maestro',
    spaces: [4, 6, 14],
    regexExp: /^(50|63|66|5[6-8]|6[8-9]|600[0-9]|6010|601[2-9]|60[2-9]|61|620|621|6220|6221[0-1])/,
    maxlength: 19,
    minlength: 12,
    cvcLength: 3
  },
  {
    card: 'discover',
    spaces: [4, 8, 12],
    maxlength: 19,
    minlength: 16,
    regexExp: /^(6011|65|64[4-9]|622[126-925])/,
    cvcLength: 3
  },
  {
    card: 'diners',
    spaces: [4, 10],
    maxlength: 16,
    minlength: 14,
    regexExp: /^(36|54|30[0-5])/,
    cvcLength: 3
  },
  {
    card: 'jcb',
    spaces: [4, 8, 12],
    regexExp: /^35[28-89]/,
    maxlength: 19,
    minlength: 16,
    cvcLength: 3
  }
]

const validateEmail = (emailId) => customRegex.emailRegex.test(emailId)
const validateAmount = (amount) => customRegex.validAmount.test(amount)
const validatePincode = pincodeVal => customRegex.INPincodeRegex.test(pincodeVal)
const validateMpin = mPIN => customRegex.MPIN.test(mPIN)
const validateIFSC = (ifsc) => customRegex.ifsc.test(ifsc)
const validateAccNo = (accno) => customRegex.accno.test(accno)
const validateMMID = (mmid) => customRegex.mmid.test(mmid)
const validateBeneficiary = (bname) => customRegex.beneficiaryName.test(bname)
const validateArea = (area) => customRegex.areaSpecialCharacterRestrictRegex.test(area)
const validateCityName = (cname) => customRegex.validCityName.test(cname)
const validateName = (name) => customRegex.validName.test(name)
const validateContact = (contact) => customRegex.contact.test(contact)
const validateAmountField = (amount) => customRegex.validAmountField.test(amount) || amount === '100000' || amount === ''
const isNumber = val => !isNaN(val)
const maxLength = maxValue => str => str.length <= maxValue
const minLength = minValue => str => str.length >= minValue

const regexCheck = regex => (str) => {
  const regexTest = new RegExp(regex, 'gi')
  const result = str && str.match(regexTest)
  return !!(result && result.length)
}

const validMonthYear = (month, year) => {
  let isValid = true

  if (!month || !year) {
    return false
  }

  if (isNaN(month)) {
    return false
  }

  if (isNaN(year)) {
    return false
  }

  if (month > 12) {
    return false
  }

  const date = new Date(`${month}/1/${year}`)
  const tempDate = new Date()
  const currDate = new Date(`${tempDate.getMonth() + 1}/1/${tempDate.getFullYear()}`)
  isValid = date.getTime() >= currDate.getTime()
  return isValid
}

const cardExp = (date = '', separator = '/') => {
  const [month, year] = date.split('/').map(val => val.trim())
  return validMonthYear(month, year)
}

const notEmpty = str => !!str

const chkSpecialCharacter = (str) => {
  const regex = /^[a-zA-Z0-9.]*$/
  return regex.test(str)
}

const alphabetsOnly = (str) => {
  const regex = /^[a-zA-Z]*$/
  return regex.test(str)
}

const toTrim = (str) => {
  let trimValue = str.replace(customRegex.specailCharacterRestrictRegex, '')
  trimValue = trimValue.replace(customRegex.restrictSmileyRegex, '')
  return trimValue
}

const checkSmiley = (str) => {
  let trimValue = str.replace(customRegex.restrictSmileyRegex, '')
  return trimValue
}

// Key codes: >48 & < 90  = Numbers 0 -9 & a-z
// Key code: 32 = space
const toOnlyNumber = (str) => {
  let trimValue = str.replace(customRegex.onlyNumberAllowedRegex, '')
  trimValue = trimValue.replace(customRegex.restrictSmileyRegex, '')
  return trimValue
}

// --- to apply max character limit for text field & also checks for smiley inputs
const checkLimit = (num, str) => {
  var ret = str
  var len = str.length
  if (len > num) {
    ret = str.substr(0, num)
  }
  return ret
}

// Key code: 69 = E / e   ---// To prevent "E" in number field
const preventScientificNotation = (e) => {
  if (e.keyCode === 69) {
    e.preventDefault()
  }
}

const validatePassword = password => (password && password.length >= 4 && password.length <= 50)

const getCardTypeDetails = function (cardNumber) {
  const cardVal = cardNumber.replace(/ /g, '')
  let cardType = { card: undefined, spaces: [4, 8, 12], regexExp: undefined, maxlength: 16, cvcLength: 3 }
  for (let counter = 0; counter < CREDIT_CARD_TYPES.length; counter++) {
    if (CREDIT_CARD_TYPES[counter].regexExp.test(cardVal)) {
      cardType = CREDIT_CARD_TYPES[counter]
      break
    }
  }
  return cardType
}

const isValidCardType = function (cardNumber) {
  const cardDetails = getCardTypeDetails(cardNumber)
  return (cardNumber.length >= cardDetails.minlength && cardNumber.length <= cardDetails.maxlength && !!cardDetails.card)
}

const isAdult = function (inputDate = null) {
  const ageLimit = 21
  if (!inputDate) {
    return false
  }
  return differenceInYears(new Date(), new Date(inputDate)) >= ageLimit
}

const isValidCreditCardNumber = function (cardNumberStr) {
  let nCheck = 0
  let nDigit = 0
  let bEven = false
  let n
  let cDigit
  let validCreditCard = false
  const cardNumber = cardNumberStr.replace(/\D/g, '')
  if (cardNumber.length >= 13 && cardNumber.length <= 19) {
    for (n = cardNumber.length - 1; n >= 0; n--) {
      cDigit = cardNumber.charAt(n)
      nDigit = parseInt(cDigit, 10)
      if (bEven) {
        nDigit *= 2
        if (nDigit > 9) {
          nDigit -= 9
        }
      }
      nCheck += nDigit
      bEven = !bEven
    }
    validCreditCard = (nCheck % 10) === 0
  }
  return validCreditCard
}

const getCVCLength = (cardNumberStr) => {
  const cardDetails = getCardTypeDetails(cardNumberStr)
  return cardDetails.cvcLength
}

const isValidCVC = (cvcNumber, cardNumberStr) => {
  const len = getCVCLength(cardNumberStr)
  return (cvcNumber + '').length === len
}

const validateData = (data, validators) => {
  if (!validators || !validators.length) {
    return true
  }
  const validationResults = validators.map(validator => validator(data))
  const isValid = validationResults.every(valResult => valResult)
  return isValid
}

const validateDataMessage = (data, validators) => {
  if (!validators || !validators.length) {
    return true
  }

  let message = ''
  const validationResults = validators.map((validateObj) => {
    const result = validateObj.validate(data)
    message = result ? message : validateObj.message
    return result
  })
  const isValid = validationResults.every(valResult => valResult)

  return {
    isValid,
    message
  }
}

const removeNumber = (val) => {
  return (val + '').replace(customRegex.removeNumber, '')
}

const numberOnly = (val) => {
  return (val + '').replace(customRegex.numberOnly, '')
}

const validateMobileNumber = (val) => {
  const regex = /^\d{10}$/
  return regex.test(val)
}

const checkRegex = (regexArr = [], url = '') => {
  let flag = 0
  regexArr.forEach(reg => {
    if (reg.test(url)) {
      flag = 1
      return false
    }
  })
  return flag
}

const minValue = minVal => (value) => {
  const val = Number(value)
  if (isNaN(val)) {
    return false
  }
  return value >= minVal
}

const maxValue = maxVal => (value) => {
  const val = Number(value)
  if (isNaN(val)) {
    return false
  }
  return value <= maxVal
}

export {
  validateEmail,
  notEmpty,
  validatePassword,
  isValidCardType,
  isValidCreditCardNumber,
  validateData,
  isNumber,
  validMonthYear,
  cardExp,
  getCardTypeDetails,
  maxLength,
  minLength,
  validateDataMessage,
  chkSpecialCharacter,
  toTrim,
  toOnlyNumber,
  preventScientificNotation,
  checkSmiley,
  checkLimit,
  regexCheck,
  removeNumber,
  getCVCLength,
  isValidCVC,
  numberOnly,
  validateMobileNumber,
  minValue,
  maxValue,
  checkRegex,
  alphabetsOnly,
  isAdult,
  validatePincode,
  validateMpin,
  validateArea,
  validateAmount,
  validateIFSC,
  validateAccNo,
  validateMMID,
  validateBeneficiary,
  validateCityName,
  validateName,
  validateContact,
  validateAmountField
}
