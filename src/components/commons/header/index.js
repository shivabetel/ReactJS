import InnerHeader from './inner-header'
import OuterHeader from './outer-header'
import WhiteHeader from './white-header'
import { React, BaseComponent } from '../../../components/core/base-component'

class Header extends BaseComponent {
  render () {
    if (this.props.isTopLevelPage) {
      return (<OuterHeader {...this.props} />)
    } else if (this.props.isWhiteHeader) {
      return (<WhiteHeader {...this.props} />)
    } else {
      return (<InnerHeader {...this.props} />)
    }
  }
}
export default Header
