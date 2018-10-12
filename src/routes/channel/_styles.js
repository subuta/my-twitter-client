import createWithStyles from 'src/utils/style'

import {
  merge,
  apply,
  variants,
  screen
} from 'css-as-js'

export default createWithStyles({
  h1: apply('m-4 p-4 hoge border hover:text-yellow'),
  button: apply('ml-4 mb-4 py-2 px-4 text-black bg-white border-2 rounded hover:bg-red active:bg-yellow')
})
