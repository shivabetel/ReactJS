import { colors, fonts, blueContainer } from '../../commons/styles'
import { getIcon } from '../../../utils/app'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: colors.bgColor,
    minHeight: '60px',
    display: 'flex',
    color: colors.labelColor,
    width: '100%',
    alignItems: 'center',
    zIndex: theme.zIndex.drawer + 1,
    ...fonts
  },
  backButtonIcon: {
    'background-image': `url(${getIcon('ic_back.svg')})`,
    'cursor': 'pointer',
    'background-repeat': 'no-repeat',
    position: 'absolute',
    height: '30px',
    width: '30px',
    alignItems: 'center',
    marginLeft: '10px'
  },
  title: {
    fontSize: '16px',
    margin: '0 auto 0 auto'
  },
  outerRoot: {
    flexGrow: 1,
    backgroundColor: colors.primaryColor,
    minHeight: '60px',
    display: 'flex',
    color: colors.paperColor,
    width: '100%',
    alignItems: 'center',
    zIndex: theme.zIndex.drawer + 1,
    ...fonts
  },
  whiteRoot: {
    flexGrow: 1,
    backgroundColor: colors.paperColor,
    minHeight: '60px',
    display: 'flex',
    color: colors.labelColor,
    width: '100%',
    alignItems: 'center',
    zIndex: theme.zIndex.drawer + 1,
    ...fonts
  },
  outerBackButtonIcon: {
    'background-image': `url(${getIcon('ic_backarrow.svg')})`,
    'cursor': 'pointer',
    'background-repeat': 'no-repeat',
    position: 'absolute',
    height: '30px',
    width: '30px',
    alignItems: 'center',
    marginLeft: '10px'
  },
  options: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: 'grey',
    boxShadow: '0px 7px 0px grey, 0px 14px 0px grey'
  },
  optionSpacing: {
    alignItems: 'center',
    marginRight: '20px',
    marginTop: '-10px'
  },
  blueContainer

})
export { styles }
