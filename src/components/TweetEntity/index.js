import React from 'react'
import _ from 'lodash'

import ReactPlayer from 'react-player'

import {
  compose,
  withProps,
  branch,
  renderComponent
} from 'recompose'

import withStyles from './style'

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
    const video = _.find(_.get(animatedGifMedia, 'video_info.variants', []), (variant) => _.startsWith(variant.content_type, 'video/'))

    if (!video) {
      return null
    }

    return (
      <ReactPlayer
        url={video.url}
        muted
        controls
        playing
        loop
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
