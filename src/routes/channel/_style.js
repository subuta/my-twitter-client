import createWithStyles from 'src/utils/style'

import {
  merge,
  apply,
  variants,
  screen
} from 'css-as-js'

const SIDEBAR_WIDTH = 196

const Header = {
  ...apply('py-2 px-4 flex-0 flex flex-col items-start border-b'),

  ...screen('lg', apply('pt-2 pb-0 border-none'))
}

const Logo = {
  ...apply('block mx-auto text-white'),

  width: '156px !important'
}

const Sidebar = {
  ...apply('flex-col items-start justify-between h-screen flex-none bg-purple-darker text-white hidden'),

  width: SIDEBAR_WIDTH,

  ...screen('lg', {
    ...apply('flex')
  })
}

const Content = {
  ...apply('flex flex-col h-screen flex-1 shadow'),

  ...screen('lg', {
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`
  })
}

const GroupHeaderContainer = {
  ...apply('pl-4 w-screen z-50'),

  ...screen('lg', {
    ...apply('pl-0 pin-t'),
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`
  }),
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

  Row: apply('px-2 w-screen lg:px-4'),

  Header,
  Logo,

  Sidebar,
  Content,

  GroupHeaderContainer,
  GroupHeader,
  GroupHeaderLabel
})
