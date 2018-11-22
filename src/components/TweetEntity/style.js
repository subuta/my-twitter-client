import createWithStyles from 'src/utils/style'

import {
  merge,
  apply,
  variants,
  screen
} from 'css-as-js'

const TweetMedia = apply('py-2')

const TweetImage = apply('mt-2 border rounded')

export default createWithStyles({
  TweetImage,
  TweetMedia
})
