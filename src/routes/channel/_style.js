import createWithStyles from 'src/utils/style'

import {
  merge,
  apply,
  variants,
  screen
} from 'css-as-js'

const GroupHeader = {
  ...apply('relative py-2 text-sm font-bold'),
  height: 20,

  '&:before': {
    ...apply('absolute pin-t pin-l pin-r block w-full bg-white border-b'),
    content: '""',
    height: 10
  },
}

const GroupHeaderLabel = {
  ...apply('mx-4 py-1 px-3 absolute pin-a bg-white rounded-full'),

  left: '50%',
  top: 'calc(50% - 1px)',
  transform: 'translate3d(-50%, -50%, 0)'
}

export default createWithStyles({
  h1: apply('m-4 p-4 hoge border hover:text-yellow'),
  button: apply('ml-4 mb-4 py-2 px-4 text-black border-2 rounded hover:bg-red active:bg-yellow'),

  Row: apply('px-4 w-full'),

  GroupHeaderContainer: apply('pin-t z-50 w-screen'),

  GroupHeader,
  GroupHeaderLabel
})
