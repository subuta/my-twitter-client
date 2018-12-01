import React from 'react'
import {
  compose,
} from 'recompose'
import _ from 'lodash'

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
    nextTweet,
    setSizeRef,
    isMobile
  } = props

  const {
    full_text,
    created_at
  } = tweet

  const {
    name,
    screen_name,
    profile_image_url
  } = user

  const createdAt = dayjs(created_at)

  let notHasRecentTweet = true

  if (nextTweet && nextTweet.created_at) {
    const nextCreatedAt = dayjs(nextTweet.created_at)
    // If tweeted within 10 minutes.
    const diffInMinute = createdAt.diff(nextCreatedAt, 'minute')
    notHasRecentTweet = diffInMinute >= 10
  }

  const extendedEntities = tweet.extended_entities
  const entities = tweet.entities

  const urlEntities = entities.urls || []

  const tweetHtml = decorateText(full_text, { urlEntities })

  // TODO: Add Like and RT count.
  // TODO: Post tweet feature.
  // TODO: Tweet notification.
  return (
    <div
      className={`${className} group hover:bg-grey-lightest`}
      style={style}
    >
      <div
        className={styles.Tweet}
        ref={setSizeRef}
      >
        {notHasRecentTweet ? (
          <img
            src={profile_image_url}
            alt='avatar'
            className={styles.Avatar}
          />
        ) : (
          <span className={`${styles.CreatedAt} opacity-0 group-hover:opacity-100`}>
            <small className='text-grey-darker text-xs'>{createdAt.format('h:mm A')}</small>
          </span>
        )}

        <div className='flex-1'>
          {notHasRecentTweet && (
            <div className='mb-1 flex items-baseline'>
              <a className='text-black text-sm font-semibold no-underline hover:underline'
                 href={`https://twitter.com/${screen_name}`}
                 target='_blank'
              >
                {name}
              </a>

              <small className='ml-1 text-grey-darker text-sm'>
                @{screen_name}
              </small>

              <small className='ml-1 text-grey-darker'>{createdAt.format('h:mm A')}</small>
            </div>
          )}

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
            retweetedStatus={tweet.retweeted_status}
            quotedStatus={tweet.quoted_status}
          />
        </div>
      </div>
    </div>
  )
})
