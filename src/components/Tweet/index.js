import React from 'react'
import {
  compose,
} from 'recompose'

import dayjs from 'src/utils/dayjs'
import { decorateText } from 'src/utils/tweet'

import TweetEntity from 'src/components/TweetEntity'

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
    setSizeRef,
    isMobile
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

  const extendedEntities = tweet.extended_entities
  const entities = tweet.entities

  const urlEntities = entities.urls || []

  const tweetHtml = decorateText(full_text, { urlEntities })

  return (
    <div
      className={className}
      style={style}
    >
      <div
        className={styles.Tweet}
        ref={setSizeRef}
      >
        <img
          src={profile_image_url}
          alt='avatar'
          className={styles.Avatar}
        />

        <div className='flex-1'>
          <div className='mb-1 flex items-baseline'>
            <b className='text-sm'>{screen_name}</b>
            <small className='ml-1 text-grey-darker'>{createdAt.format('h:mm A')}</small>
          </div>

          <p
            className={styles.Text}
            dangerouslySetInnerHTML={{ __html: tweetHtml }}
          />

          <TweetEntity
            isMobile={isMobile}
            createdAt={createdAt}
            tweet={tweet}

            extendedEntities={extendedEntities}
            entities={entities}
            quotedStatus={tweet.quoted_status}
          />
        </div>
      </div>
    </div>
  )
})
