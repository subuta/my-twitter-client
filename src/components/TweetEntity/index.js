import React from 'react'
import _ from 'lodash'

import {
  compose,
  branch,
  renderComponent
} from 'recompose'

import withStyles from './style'

import Video from 'src/components/Video'
import OG from './OG'

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
    return photoMedia && extendedPhotoMedia
  },
  renderComponent(({ styles, createdAt, entities, extendedEntities }) => {
    const photoMedia = filterMediaByType(entities, MEDIA_TYPE_PHOTO)
    const extendedPhotoMedia = filterMediaByType(extendedEntities, MEDIA_TYPE_PHOTO)

    const mediaList = _.isEmpty(extendedPhotoMedia) ? photoMedia : extendedPhotoMedia

    return (
      <div className='mt-2'>
        {createdAt && (
          <small className='text-grey-darker'>Attached image at {createdAt.format('YYYY-MM-DD, h:mm A')}</small>
        )}

        <div>
          {_.map(mediaList, (media) => {
            const size = getSize(media.sizes)
            return (
              <img
                className={styles.TweetImage}
                key={media.media_url}
                src={media.media_url}
                style={{ maxHeight: size.h, height: 'auto', width: size.w }}
                alt={media.url}
              />
            )
          })}
        </div>
      </div>
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
    const sources = _.map(_.get(animatedGifMedia, 'video_info.variants', []), ({ content_type = '', url = '' }) => ({
      type: content_type,
      src: url
    }))

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
        style={{ maxHeight: size.h, height: 'auto', width: size.w }}
        sources={sources}
      />
    )
  }),
  _.identity
)

const withOG = branch(
  ({ entities: { media, urls } }) => {
    return _.isEmpty(media) && !_.isEmpty(urls)
  },
  renderComponent(OG),
  _.identity
)

const enhance = compose(
  withStyles,
  withEmpty,
  withAnimatedGif,
  withPhoto,
  withOG
)

// Defaults to null.
export default enhance((props) => {
  console.log('Not handled TweetEntity type', props)
  return null
})
