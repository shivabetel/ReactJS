import constants from '../constants'

const endPoints = {
  [constants.JPB_COMMON]: {
    [constants.PROD_ENV]: 'https://jiopay.jpb.jio.com',
    [constants.SIT_ENV]: 'https://sit-jiopay.jpb.jio.com',
    [constants.PP_ENV]: 'https://pp-jiopay.jpb.jio.com',
    [constants.QA_ENV]: 'https://sit-jiopay.jpb.jio.com',
    [constants.DEV_ENV]: 'https://sit-jiopay.jpb.jio.com'
  },
  [constants.JPB_APP]: {
    [constants.PROD_ENV]: 'https://jiopay.jpb.jio.com',
    [constants.SIT_ENV]: 'https://sit-jiopay.jpb.jio.com',
    [constants.PP_ENV]: 'https://pp-jiopay.jpb.jio.com',
    [constants.QA_ENV]: 'https://sit-jiopay.jpb.jio.com',
    [constants.DEV_ENV]: 'http://localhost:3100'
  },
  [constants.JPB_PG]: {
    [constants.PROD_ENV]: 'https://pg.jpb.jio.com',
    [constants.SIT_ENV]: 'https://sit-pg.jpb.jio.com',
    [constants.PP_ENV]: 'https://pp-pg.jpb.jio.com',
    [constants.QA_ENV]: 'https://sit-pg.jpb.jio.com',
    [constants.DEV_ENV]: 'http://localhost:3200'
  },
  'JPB_FONTS': {
    [constants.PROD_ENV]: 'https://pg.jpb.jio.com/static/fonts',
    [constants.SIT_ENV]: 'https://sit-pg.jpb.jio.com/static/fonts',
    [constants.PP_ENV]: 'https://pp-pg.jpb.jio.com/static/fonts',
    [constants.QA_ENV]: 'https://sit-pg.jpb.jio.com/static/fonts',
    [constants.DEV_ENV]: 'http://localhost:3100/static/fonts'
  },
  'JPB_IMAGES': {
    [constants.PROD_ENV]: 'https://pg.jpb.jio.com/static/images',
    [constants.SIT_ENV]: 'https://sit-pg.jpb.jio.com/static/images',
    [constants.PP_ENV]: 'https://pp-pg.jpb.jio.com/static/images',
    [constants.QA_ENV]: 'https://sit-pg.jpb.jio.com/static/images',
    [constants.DEV_ENV]: 'http://localhost:3100/static/images'
  },
  'JPB_ICONS': {
    [constants.PROD_ENV]: 'https://pg.jpb.jio.com/static/icons',
    [constants.SIT_ENV]: 'https://sit-pg.jpb.jio.com/static/icons',
    [constants.PP_ENV]: 'https://pp-pg.jpb.jio.com/static/icons',
    [constants.QA_ENV]: 'https://sit-pg.jpb.jio.com/static/icons',
    [constants.DEV_ENV]: 'http://localhost:3100/static/icons'
  }
}

export default endPoints
