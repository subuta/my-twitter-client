import createWithStyles from 'src/utils/style'

import {
  merge,
  apply,
  variants,
  screen
} from 'css-as-js'

const Header = {
  ...apply('py-2 px-4 flex-0 flex flex-col items-start border-b'),

  ...screen('lg', apply('pt-2 pb-0 border-none'))
}

const GroupHeaderContainer = {
  ...apply('pl-4 w-screen z-50'),

  ...screen('lg', apply('pl-0 pin-t'))
}

const GroupHeader = {
  ...apply('relative py-2 text-sm font-bold border-b'),

  ...screen('lg', {
    ...apply('border-none'),

    height: 20,

    '&:before': {
      ...apply('absolute pin-t pin-l pin-r block w-full bg-white border-b border-grey-lighter'),
      content: '""',
      height: 10
    }
  }),
}

const GroupHeaderLabel = {
  ...screen('lg', {
    ...apply('mx-4 pb-1 px-3 absolute pin-a bg-white rounded-full'),

    left: '50%',
    top: '50%',
    transform: 'translate3d(-50%, -50%, 0)'
  })
}

export default createWithStyles({
  h1: apply('m-4 p-4 hoge border hover:text-yellow'),
  button: apply('ml-4 mb-4 py-2 px-4 text-black border-2 rounded hover:bg-red active:bg-yellow'),

  Row: apply('px-2 lg:px-4 w-screen'),

  Header,

  GroupHeaderContainer,
  GroupHeader,
  GroupHeaderLabel
})
