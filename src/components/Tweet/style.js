import createWithStyles from 'src/utils/style'

import {
  merge,
  apply,
  variants,
  screen
} from 'css-as-js'

const Tweet = apply('py-1')

const Avatar = {
  ...apply('rounded'),
  height: 40,
  width: 40
}

export default createWithStyles({
  Tweet,
  Avatar
})
