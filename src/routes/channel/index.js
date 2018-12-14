import React from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader'
import _ from 'lodash'

import {
  fromTwitterDate,
  isToday,
  isThisYear,
  isYesterday
} from 'src/utils/moment'

import {
  VirtualList,
  Sized
} from 'react-renderless-virtual-list'

import {
  compose,
  withHandlers,
  withStateHandlers,
  lifecycle
} from 'recompose'

import withStyles from './_style'

import gql from 'graphql-tag'

import graphQLClient, {
  tweetFields,
  userFields
} from 'src/utils/graphQLClient'

import {
  EventTweetPosted
} from 'src/config'

import {
  subscribe,
  unsubscribe
} from 'src/utils/sse'

import Icon from 'src/components/Icon'
import Placeholder from 'src/components/Placeholder'

const SCROLL_DIRECTION_UP = 'SCROLL_DIRECTION_UP'
const SCROLL_DIRECTION_NONE = 'SCROLL_DIRECTION_NONE'
const SCROLL_DIRECTION_DOWN = 'SCROLL_DIRECTION_DOWN'

const USER_ID = '320096369' // @subuta_nico.
const WIDTH_SMALL = 576

import Tweet from 'src/components/Tweet'

const isBrowser = typeof window !== 'undefined'

const enhance = compose(
  hot(module),
  withHandlers({
    getTweets: () => async (maxId) => {
      // Get sorted todoes by dueDate ASC.
      const query = gql`
        ${tweetFields}

        query getTweetsWithProfile($user_id: ID!, $limit: Int, $max_id: ID) {
          twitter {
            tweets(user_id: $user_id, limit: $limit, max_id: $max_id) {
              ...tweetFields

              in_reply_to_status {
                ...tweetFields
              }

              retweeted_status {
                ...tweetFields
              }

              quoted_status {
                ...tweetFields
              }
            }
          }
        }
      `

      const params = _.pickBy({ user_id: USER_ID, limit: 101, max_id: maxId }, _.identity)

      const data = await graphQLClient.request(query, params)
      const tweets = _.get(data, 'twitter.tweets', [])

      return maxId ? _.tail(tweets) : tweets
    },

    subscribeStream: () => (fn) => {
      // Subscribe events
      subscribe(EventTweetPosted, fn)

      return () => {
        // Unsubscribe events
        unsubscribe(EventTweetPosted, fn)
      }
    }
  }),
  withStateHandlers(
    ({ tweets }) => {
      return {
        rows: tweets || [],
        scrollToIndex: null
      }
    },
    {
      setRows: (state) => (rows, scrollToIndex = null) => {
        return { rows, scrollToIndex }
      },

      setScrollToIndex: () => (scrollToIndex = null) => ({ scrollToIndex }),

      appendRows: (state) => (rows) => {
        return {
          rows: [...state.rows, ...rows]
        }
      }
    }
  ),
  withHandlers({
    onReload: ({ setRows, setScrollToIndex, getTweets }) => async (data) => {
      const tweets = await getTweets()

      // More better way to handle scrollToBottom.
      setRows(tweets, 0)
      requestAnimationFrame(() => setScrollToIndex(null))
    },

    onLoadMore: ({ appendRows, rows, getTweets }) => async ({ isAtFirst }) => {
      if (isAtFirst) return
      const lastId = _.get(_.last(rows), 'id_str')
      const tweets = await getTweets(lastId)
      appendRows(tweets)
    }
  }),
  lifecycle({
    componentDidMount () {
      const {
        subscribeStream,
        onReload
      } = this.props

      this.unSubscribeStream = subscribeStream(onReload)
    },

    componentWillUnmount () {
      if (this.unSubscribeStream) this.unSubscribeStream()
    }
  }),
  withStyles
)

const renderRow = (props) => {
  const {
    rows = [],
    row,
    nextRow,
    index,
    isMobile,
    setSizeRef,
    style,
    styles,
    user
  } = props

  const retweet = row.retweeted_status
  const hasRetweet = !!retweet

  return (
    <Tweet
      className={`row-${row.id_str} ${styles.Row}`}
      isMobile={isMobile}
      style={style}
      user={user}
      isRetweet={hasRetweet}
      tweet={row}
      nextTweet={nextRow}
      setSizeRef={setSizeRef}
    />
  )
}

const renderGroupHeader = ({ row, isMobile, setSizeRef, style, styles }) => {
  const { groupHeader } = row

  let groupHeaderContainerClass = styles.GroupHeaderContainer
  if (!isMobile) {
    // Only-enable sticky header for non-mobile browser.
    groupHeaderContainerClass += ' c-sticky'
  }

  return (
    <div style={style} className='pointer-events-none'>
      <div
        ref={setSizeRef}
        className={groupHeaderContainerClass}
      >
        <div className={styles.GroupHeader}>
          <span className={styles.GroupHeaderLabel}>{groupHeader}</span>
        </div>
      </div>
    </div>
  )
}

const renderPlaceholder = (props) => {
  const {
    className = 'placeholder',
    style
  } = props

  return (
    <Placeholder
      key='placeholder'
      className={className}
      style={style}
    />
  )
}

const getGroupHeaderForRow = (row) => {
  const createdAt = fromTwitterDate(row.created_at)

  if (isToday(createdAt)) {
    return 'Today'
  } else if (isYesterday(createdAt)) {
    return 'Yesterday'
  } else if (isThisYear(createdAt)) {
    return createdAt.format('dddd, MMMM Do')
  }

  return createdAt.format('MMMM Do, YYYY')
}

const groupRowBy = ({ rows, row, index, lastGroupHeader }) => {
  const groupHeader = getGroupHeaderForRow(row)

  if (!rows[index + 1]) return groupHeader

  const nextGroupHeader = getGroupHeaderForRow(rows[index + 1])

  // Push nextGroupHeader position to last occurrence.
  if (groupHeader !== nextGroupHeader) return groupHeader

  return lastGroupHeader
}

const Channel = enhance((props) => {
  const {
    rows,
    scrollToIndex,
    onScroll,
    onLoadMore,
    user,
    styles
  } = props

  const firstRow = _.first(rows)
  if (!firstRow) return null

  return (
    <>
      <Helmet>
        <title>Channel</title>
      </Helmet>

      <div className='flex items-start justify-start'>
        <div className={styles.Sidebar}>
          <div className='w-full'>
            <div className='pt-2'>
              <Icon className={styles.Logo}
                    icon='logo'
                    size='custom'
              ></Icon>
            </div>

            <div className='py-4'>
              <h3 className='px-4'>Channels</h3>

              <ul className='mt-2 list-reset'>
                <li className='px-4 py-1 font-semibold bg-blue-light'>#i_subuta</li>
              </ul>
            </div>
          </div>

          <div className='px-4 pb-2 text-grey'>
            <span>by</span>
            <a className='inline-block ml-1 text-grey no-underline hover:underline'
               href="https://github.com/subuta"
               target='_blank'
            >
              @subuta
            </a>

            <a className='ml-2 text-grey no-underline'
               href="https://github.com/subuta/my-twitter-client"
               target='_blank'
            >
              <Icon icon='social-media-social-media-logo-github-1'
                    size='xs'
              ></Icon>
            </a>
          </div>
        </div>

        <div className={styles.Content}>
          <header className={styles.Header}>
            <p className='flex-1 w-full flex items-center justify-between'>
              <b className='text-black'>#i_subuta</b>

              <span className='text-grey'>
                {/* Placeholder :) */}
              </span>
            </p>

            <span className='mt-1 flex-none text-sm text-grey-dark'>
              My daily tweets
            </span>
          </header>

          <Sized>
            {({ size, setSizeRef }) => {
              // FIXME: Better way for detecting mobile.
              let isMobile = false
              if (size.width) {
                isMobile = WIDTH_SMALL > size.width
              } else {
                isMobile = isBrowser ? WIDTH_SMALL > window.innerWidth : false
              }

              return (
                <div
                  className='flex-1 overflow-hidden'
                  ref={setSizeRef}
                >
                  <VirtualList
                    // More better way to handle here(refresh on prepend.)
                    key={firstRow.id_str}
                    isMobile={isMobile}
                    onLoadMore={onLoadMore}
                    onScroll={onScroll}
                    height={size.height}
                    width={size.width}
                    rows={rows}
                    groupBy={groupRowBy}
                    renderGroupHeader={(props) => renderGroupHeader({ ...props, isMobile, styles })}
                    renderPlaceholder={renderPlaceholder}
                    overScanCount={6}
                    scrollToIndex={scrollToIndex}
                    reversed
                  >
                    {(props) => renderRow({ ...props, isMobile, user, styles })}
                  </VirtualList>
                </div>
              )
            }}
          </Sized>
        </div>
      </div>
    </>
  )
})

Channel.getInitialProps = async () => {
  // Get sorted todoes by dueDate ASC.
  const query = gql`
    ${userFields}
    ${tweetFields}

    query getTweetsWithProfile($user_id: ID!, $limit: Int) {
      twitter {
        user (identifier: ID, identity: $user_id) {
          ...userFields
        }

        tweets(user_id: $user_id, limit: $limit) {
          ...tweetFields

          in_reply_to_status {
            ...tweetFields
          }

          retweeted_status {
            ...tweetFields
          }

          quoted_status {
            ...tweetFields
          }
        }
      }
    }
  `

  const data = await graphQLClient.request(query, { user_id: USER_ID, limit: 100 })

  return _.get(data, 'twitter', [])
}

export default Channel
