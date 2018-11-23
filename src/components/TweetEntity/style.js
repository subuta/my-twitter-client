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
  ...apply('w-full flex flex-col'),

  ...screen('lg', {
    height: 'auto',
    width: 500
  })
}

const Status = {
  ...apply('w-full'),

  ...screen('lg', {
    height: 'auto',
    width: 500
  })
}

const LargeOGImage = {
  ...apply('w-full flex-none flex items-center justify-center bg-cover bg-center'),

  height: 130,

  ...screen('lg', {
    height: 260
  })
}

const SmallOGImage = {
  ...apply('h-24 w-24 flex-none flex items-center justify-center bg-cover bg-grey-lighter bg-center'),

  ...screen('lg', apply('h-32 w-32'))
}

const PlayIcon = {
  ...apply('hidden rounded-full bg-white border-4 border-white opacity-75 cursor-pointer text-blue-light'),

  '&:hover': apply('opacity-100'),
  '.has-player &': apply('block')
}

const VerifiedIcon = apply('text-blue-light')

const Text = {
  ...apply('leading-tight whitespace-pre-wrap'),

  '& a': apply('break-all break-words text-blue-light no-underline hover:underline')
}

export default createWithStyles({
  TweetImage,
  TweetMedia,
  Text,
  OG,
  SiteIcon,
  Meta,
  Status,
  LargeOGImage,
  SmallOGImage,
  VerifiedIcon,
  PlayIcon
})
