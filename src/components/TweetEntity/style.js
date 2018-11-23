import createWithStyles from 'src/utils/style'

import {
  merge,
  apply,
  variants,
  screen
} from 'css-as-js'

const TweetMedia = apply('py-2')

const TweetImage = apply('mt-1 border rounded')

const OG = {
  ...apply('mt-2 inline-flex items-start border rounded-lg')
}

const SiteIcon = {
  ...apply('mr-1'),

  lineHeight: 0
}

const Meta = {
  ...apply('w-full flex flex-col h-32'),

  ...screen('lg', {
    width: 500
  })
}

const SmallOGImage = {
  ...apply('h-32 w-32 flex-none flex items-center justify-center bg-cover bg-center rounded-l-lg')
}

const PlayIcon = {
  ...apply('hidden rounded-full bg-white border-4 border-white opacity-75 cursor-pointer'),

  '&:hover': apply('opacity-100'),
  '.has-player &': apply('block'),

  color: '#62A9E1'
}

export default createWithStyles({
  TweetImage,
  TweetMedia,
  OG,
  SiteIcon,
  Meta,
  SmallOGImage,
  PlayIcon
})
