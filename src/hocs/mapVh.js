import {
  compose,
  lifecycle,
  withState,
  withProps,
} from 'recompose'
import _ from 'lodash'

const isBrowser = typeof window !== 'undefined'

export default compose(
  withState('vh', 'setVh', 0),
  withProps(({ setVh }) => ({
    listen: () => {
      const listener = _.debounce((e) => setVh(window.innerHeight), 300)

      window.addEventListener('resize', listener)

      // Load once.
      listener()

      return () => window.removeEventListener('resize', listener)
    }
  })),
  lifecycle({
    async componentDidMount () {
      this.unlisten = this.props.listen()
    },

    componentWillUnmount () {
      this.unlisten && this.unlisten()
    }
  }),
)
