import createWithStyles from 'src/utils/style'

import {
  merge,
  apply,
  variants,
  screen
} from 'css-as-js'

const Tweet = apply('flex py-2 w-full')

const Avatar = {
  ...apply('flex-none mr-2 rounded'),
  height: 40,
  width: 40
}

const Text = {
  ...apply('leading-tight whitespace-pre-wrap'),

  '& a': apply('break-all break-words')
}

export default createWithStyles({
  Tweet,
  Text,
  Avatar
})
