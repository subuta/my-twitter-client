import twitter from 'twitter-text'
import emoji from './emoji'

export const decorateText = (text, { urlEntities }) => {
  return twitter.autoLink(emoji.replace_unified(text), {
    targetBlank: true,
    urlTarget: '_blank',
    urlEntities
  })
}
