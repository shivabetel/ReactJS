
import { React, BasePureComponent } from '../../core/base-component'
import InfiniteScroll from 'react-infinite-scroller'

class Paginator extends BasePureComponent {
    loadFunction = () => {
      this.props.loadFunction()
    }

    render () {
      return (
        <InfiniteScroll
          threshold={450}
          pageStart={0}
          loader={this.props.loader}
          loadMore={this.loadFunction}
          hasMore={this.props.hasMore}
        >
          {this.props.children}
        </InfiniteScroll>
      )
    }
}
export default Paginator
