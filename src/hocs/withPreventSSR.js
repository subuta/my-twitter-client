import {
  compose,
  lifecycle,
  branch,
  renderComponent, withState,
} from 'recompose'
import _ from 'lodash'

export default compose(
  withState('isMounted', 'setIsMounted', false),
  lifecycle({
    componentDidMount () {
      this.props.setIsMounted(true)
    }
  }),
  branch(
    ({ isMounted }) => !isMounted,
    renderComponent(() => null),
    _.identity
  )
)
