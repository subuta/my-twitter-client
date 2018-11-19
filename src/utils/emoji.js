import EmojiConvertor from 'emoji-js'

import isRetina from './isRetina'

const emoji = new EmojiConvertor()

emoji.img_set = 'apple'
emoji.replace_mode = 'img'
emoji.supports_css = true
emoji.use_sheet = true

emoji.include_title = true

// Use High-res sprites for retina.
emoji.img_sets.apple.sheet = isRetina() ?
  '/images/emoji/sheet_apple_64.png' :
  '/images/emoji/sheet_apple_32.png'

emoji.init_env()

export default emoji
