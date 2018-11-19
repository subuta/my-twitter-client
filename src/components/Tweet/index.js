import React from 'react'
import {
  compose,
} from 'recompose'

import twitter from 'twitter-text'

import _ from 'lodash'

import dayjs from 'src/utils/dayjs'
import emoji from 'src/utils/emoji'

import withStyles from './style'

const enhance = compose(
  withStyles
)

export default enhance((props) => {
  const {
    styles,
    style,
    className,
    user,
    tweet,
    setSizeRef
  } = props

  const {
    full_text,
    created_at
  } = tweet

  const {
    screen_name,
    profile_image_url
  } = user

  const createdAt = dayjs(created_at)
  const urlEntities = _.get(tweet, 'entities.urls', [])

  const tweetHtml = twitter.autoLink(emoji.replace_unified(full_text), {
    targetBlank: true,
    urlTarget: '_blank',
    urlEntities
  })

  return (
    <div
      className={className}
      style={style}
    >
      <div
        className={styles.Tweet + ' flex'}
        ref={setSizeRef}
      >
        <img
          src={profile_image_url}
          alt='avatar'
          className={styles.Avatar + ' flex-none mr-2'}
        />

        <div>
          <div className='mb-1 flex items-baseline'>
            <b className='text-sm'>{screen_name}</b>
            <small className='ml-1 text-grey-darker'>{createdAt.format('h:mm A')}</small>
          </div>

          <p
            className='leading-tight whitespace-pre-wrap'
            dangerouslySetInnerHTML={{ __html: tweetHtml }}
          />
        </div>
      </div>
    </div>
  )
})
