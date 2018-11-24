import React from 'react'
import _ from 'lodash'

import {
  compose,
  branch,
  renderComponent
} from 'recompose'

import { decorateText } from 'src/utils/tweet'
import Icon from 'src/components/Icon'

import withStyles from './style'

import Video from 'src/components/Video'
import OG from './OG'
import dayjs from '@app/src/utils/dayjs'

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

const withQuote = branch(
  ({ quotedStatus }) => quotedStatus,
  renderComponent((props) => {
    const {
      styles,
      quotedStatus
    } = props

    const {
      entities,
      full_text,
      user
    } = quotedStatus

    const {
      name,
      screen_name
    } = user

    const urlEntities = entities.urls || []
    const media = _.first(entities.media)

    const tweetHtml = decorateText(full_text, { urlEntities })

    return (
      <div className='mt-2 p-4 inline-flex items-start border rounded-lg'>
        {media && (
          <div
            className={`${styles.SmallOGImage} mr-2 rounded-lg`}
            style={{backgroundImage: `url(${media.media_url})`}}
          />
        )}

        <div className={`${styles.Status}`}>
          <a
            className='no-underline text-black hover:underline'
            href={`https://twitter.com/${screen_name}`}
            target='_blank'
          >
            <p className='mb-1 flex items-center'>
              <b>{name}</b>
              <Icon
                className={`ml-1 ${styles.VerifiedIcon}`}
                icon='security-protection-protect-shield-firewall-check'
                size='xs'
              />
              <span className='inline-block ml-1 text-grey-darker'>@{screen_name}</span>
            </p>
          </a>

          <p
            className={styles.Text}
            dangerouslySetInnerHTML={{ __html: tweetHtml }}
          />
        </div>
      </div>
    )
  }),
  _.identity
)

const withReTweet = branch(
  ({ retweetedStatus }) => retweetedStatus,
  renderComponent((props) => {
    const {
      styles,
      retweetedStatus,
      isMobile
    } = props

    const {
      full_text,
      created_at,
      user,
      retweeted_status,
      quoted_status,
      extended_entities,
      entities
    } = retweetedStatus

    const {
      name,
      screen_name,
      profile_image_url
    } = user

    const createdAt = dayjs(created_at)

    const urlEntities = entities.urls || []

    const tweetHtml = decorateText(full_text, { urlEntities })

    return (
      <div className={styles.Retweet}>
        <div className='flex items-center'>
          <img
            src={profile_image_url}
            alt='avatar'
            className={styles.Avatar}
          />

          <a className='text-black text-sm font-semibold no-underline hover:underline'
             href={`https://twitter.com/${screen_name}`}
             target='_blank'
          >
            {name}
          </a>

          <small className='ml-1 text-grey-darker text-sm'>
            @{screen_name}
          </small>
        </div>

        <p
          className={styles.Text}
          dangerouslySetInnerHTML={{ __html: tweetHtml }}
        />

        <TweetEntity
          isMobile={isMobile}
          createdAt={createdAt}
          tweet={retweetedStatus}

          extendedEntities={extended_entities}
          entities={entities}
          retweetedStatus={retweeted_status}
          quotedStatus={quoted_status}
        />

        <div className='mt-1 text-grey'>
          <small>at Twitter</small>
          <small className='ml-1 pl-1 border-l border-grey-lighter'>{createdAt.format('MMM Do')}</small>
        </div>
      </div>
    )
  }),
  _.identity
)

const withOG = branch(
  ({ entities: { media, urls } }) => {
    const url = _.first(urls)
    if (!url) return false

    const hasTitle = _.get(url, 'og.meta.title')
    return _.isEmpty(media) && hasTitle
  },
  renderComponent(OG),
  _.identity
)

const enhance = compose(
  withStyles,
  withEmpty,
  withQuote,
  withReTweet,
  withAnimatedGif,
  withPhoto,
  withOG
)

// Defaults to null.
const TweetEntity = enhance((props) => {
  console.log('Not handled TweetEntity type', props)
  return null
})

export default TweetEntity
