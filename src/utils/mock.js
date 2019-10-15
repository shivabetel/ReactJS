import { userProfile, updateUserProfile } from '../store/mocks/user-profile'
import { sodexoDetails, sodexoTransactionHistory,
  sodexoDetailsUnLinked, getSodexoTransactionStatus, linkSodexo, makePayment, sodexoBalance } from '../store/mocks/sodexo-details'
import { setTimeout } from 'timers'
import { linkedAccounts } from '../store/mocks/linked-accounts'
import { generateRandomData } from '../store/mocks/passbook'
import { barcode, barcodeStatus } from '../store/mocks/barcode'
import { masterData, accountBalance, accountDetails, configData } from '../store/mocks/commons'
import { updateGetAccountStatement } from '../store/mocks/get-statement'
import { commonBeneificiaryMock } from '../store/mocks/beneficiaries'
import { createdToken, generateRandomStatusData } from '../store/mocks/add-money'
import { validatedBankAccountInfo, validatedTransactionInfo, sentMoney } from '../store/mocks/send-money'
import { bankList, branchByIfsc, bankBranchList, bankBranchWithIfsc, bankCityList, bankIfscCode } from '../store/mocks/bank-details'

const delay = (timeout = 500) => new Promise(resolve => setTimeout(resolve, timeout))
const respondWith = (response, timeout) => () => delay(timeout).then(() => response)

module.exports = {
  mockGetLinkedAccounts: respondWith(linkedAccounts),
  mockAddMoneyStatus: respondWith(generateRandomStatusData()),
  mockCreateToken: respondWith(createdToken),
  mockGetIfscCode: respondWith(bankIfscCode),
  mockGetBankCityList: respondWith(bankCityList),
  mockGetBankBranchWithIfsc: respondWith(bankBranchWithIfsc),
  mockGetBankBranchList: respondWith(bankBranchList),
  mockGetBranchByIfsc: respondWith(branchByIfsc),
  mockGetBankList: respondWith(bankList),
  mockMakeSodexoPayment: respondWith(makePayment),
  mockDelinkSodexo: respondWith(updateUserProfile),
  mockGetSodexoTransactionStatus: respondWith(getSodexoTransactionStatus),
  mockLinkSodexo: respondWith(linkSodexo),
  mockGetUserProfile: respondWith(userProfile),
  mockUpdate: respondWith(updateUserProfile),
  mockGetMasterData: respondWith(masterData),
  mockGetPassbookDetails: () => delay().then(() => generateRandomData()),
  mockGetAccountBalance: respondWith(accountBalance),
  mockSodexoDetails: () => delay().then(() => Math.random() > 0.5 ? sodexoDetails : sodexoDetailsUnLinked),
  mockSodexoTransactionHistory: respondWith(sodexoTransactionHistory),
  mockGenerateBarcode: respondWith(barcode, 2500),
  mockGetBarcodeStatus: respondWith(barcodeStatus),
  mockGetAccountDetails: respondWith(accountDetails),
  mockGetAccountStatement: respondWith(updateGetAccountStatement),
  mockGetSecuritySettings: respondWith(masterData),
  mockChangeMpin: respondWith(updateUserProfile),
  mockSodexoBalance: respondWith(sodexoBalance),
  mockValidateTransactionInfo: respondWith(validatedTransactionInfo),
  mockValidateBankAccountInfo: respondWith(validatedBankAccountInfo),
  mockSendMoney: respondWith(sentMoney),
  mockGetConfigData: respondWith(configData),
  mockBeneficiary: respondWith(commonBeneificiaryMock)
}
