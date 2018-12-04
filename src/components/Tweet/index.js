import React from 'react'
import {
  compose,
} from 'recompose'
import _ from 'lodash'

import { fromTwitterDate } from 'src/utils/moment'
import { decorateText } from 'src/utils/tweet'

import TweetEntity from 'src/components/TweetEntity'
import Icon from 'src/components/Icon'

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
    favorite_count,
    full_text,
    created_at
  } = tweet

  const {
    name,
    screen_name,
    profile_image_url
  } = user

  const createdAt = fromTwitterDate(created_at)

  let notHasRecentTweet = true

  if (nextTweet && nextTweet.created_at) {
    const nextCreatedAt = fromTwitterDate(nextTweet.created_at)
    // If tweeted within 10 minutes.
    const diffInMinute = createdAt.diff(nextCreatedAt, 'minute')
    notHasRecentTweet = diffInMinute >= 10
  }

  const extendedEntities = tweet.extended_entities
  const entities = tweet.entities

  const urlEntities = entities.urls || []

  const tweetHtml = decorateText(full_text, { urlEntities })

  // TODO: Post tweet feature.
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
          <span className={`${styles.CreatedAt} flex-none opacity-0 md:group-hover:opacity-100`}>
            <a className='no-underline text-grey-darker hover:underline'
               href={`https://twitter.com/${screen_name}/status/${tweet.id_str}`}
               target='_blank'
            >
              <small className='text-xs'>{createdAt.format('h:mm A')}</small>
            </a>
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

              <a className='no-underline text-grey-darker hover:underline'
                 href={`https://twitter.com/${screen_name}/status/${tweet.id_str}`}
                 target='_blank'
              >
                <small className='ml-1'>{createdAt.format('h:mm A')}</small>
              </a>
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

          <div>
            {favorite_count > 0 && (
              <span className='mt-2 inline-flex p-1 border rounded-lg items-center justify-center'>
                <Icon className='text-grey-darker'
                      icon='heart-romantic-love-valentines-day-celebration'
                      size='xs'
                />
                <span className='ml-1 text-xs text-grey-darker font-semibold'>{favorite_count}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
