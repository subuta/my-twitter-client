import React from 'react'
import _ from 'lodash'

import {
  compose,
  branch,
  renderComponent
} from 'recompose'

import withStyles from './style'

import Video from 'src/components/Video'

const MEDIA_TYPE_PHOTO = 'photo'
const MEDIA_TYPE_ANIMATED_GIF = 'animated_gif'

const findMediaByType = (entities = {}, type) => _.find(_.get(entities, 'media', []), (media) => media.type === type)
const filterMediaByType = (entities = {}, type) => _.filter(_.get(entities, 'media', []), (media) => media.type === type)
const getSize = (sizes = {}) => sizes.small || sizes.medium || sizes.thumb || sizes.large

const withEmpty = branch(
  ({ entities: { media, urls } }) => {
    return _.isEmpty(media) && _.isEmpty(urls)
  },
  renderComponent(() => null),
  _.identity
)

const withPhoto = branch(
  ({ entities, extendedEntities = {} }) => {
    const photoMedia = findMediaByType(entities, MEDIA_TYPE_PHOTO)
    const extendedPhotoMedia = findMediaByType(extendedEntities, MEDIA_TYPE_PHOTO)
    const { urls } = entities
    return _.isEmpty(urls) && photoMedia && extendedPhotoMedia
  },
  renderComponent(({ entities, extendedEntities }) => {
    const photoMedia = filterMediaByType(entities, MEDIA_TYPE_PHOTO)
    const extendedPhotoMedia = filterMediaByType(extendedEntities, MEDIA_TYPE_PHOTO)

    const mediaList = _.isEmpty(extendedPhotoMedia) ? photoMedia : extendedPhotoMedia

    return _.map(mediaList, (media) => {
      const size = getSize(media.sizes)
      return (
        <img
          className='mb-2'
          key={media.media_url}
          src={media.media_url}
          style={{height: size.h, width: size.w}}
          alt={media.url}
        />
      )
    })
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

    const size = getSize(animatedGifMedia.sizes)

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
  withPhoto,
)

export default enhance(({ entities: { media, urls } }) => {
  return (
    <div>
      hoge
    </div>
  )
})
