import React from 'react'
import _ from 'lodash'

import {
  compose,
  branch,
  renderComponent
} from 'recompose'

import withStyles from './style'

import Video from 'src/components/Video'

const MEDIA_TYPE_ANIMATED_GIF = 'animated_gif'

const findMediaByType = (entities = {}, type) => _.find(_.get(entities, 'media', []), (media) => media.type === type)

const withEmpty = branch(
  ({ entities: { media, urls } }) => {
    return _.isEmpty(media) && _.isEmpty(urls)
  },
  renderComponent(() => null),
  _.identity
)

const withOnlyMedia = branch(
  ({ entities: { media, urls } }) => {
    return _.isEmpty(urls) && !_.isEmpty(media)
  },
  renderComponent(({ entities: { media }, extendedEntities }) => {
    return (
      <h1>media</h1>
    )
  }),
  _.identity
)

const withAnimatedGif = branch(
  ({ entities: { media, urls }, extendedEntities = {} }) => {
    const animatedGifMedia = findMediaByType(extendedEntities, MEDIA_TYPE_ANIMATED_GIF)
    return _.isEmpty(urls) && !_.isEmpty(media) && animatedGifMedia
  },
  renderComponent(({ entities: { media }, extendedEntities }) => {
    const animatedGifMedia = findMediaByType(extendedEntities, MEDIA_TYPE_ANIMATED_GIF)
    const sources = _.map(_.get(animatedGifMedia, 'video_info.variants', []), ({ content_type = '', url = '' }) => ({ type: content_type, src: url}))

    if (_.isEmpty(sources)) {
      return null
    }

    const sizes = animatedGifMedia.sizes
    const size = sizes.large || sizes.small

    return (
      <Video
        className='mt-2'
        autoPlay
        loop
        muted
        style={{ height: size.h, width: size.w }}
        sources={sources}
      />
    )
  }),
  _.identity
)

const enhance = compose(
  withStyles,
  withEmpty,
  withAnimatedGif,
  withOnlyMedia
)

export default enhance(({ entities: { media, urls } }) => {
  return (
    <div>
      hoge
    </div>
  )
})
