import React from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader'
import _ from 'lodash'

import dayjs, {
  isToday,
  isThisYear,
  isYesterday
} from 'src/utils/dayjs'

import {
  VirtualList,
  Sized
} from 'react-renderless-virtual-list'

import {
  compose,
  withHandlers,
  withPropsOnChange,
  withStateHandlers,
} from 'recompose'

import withPreventSSR from 'src/hocs/withPreventSSR'
import withStyles from './_style'

import gql from 'graphql-tag'
import graphQLClient, {
  tweetFields,
  userFields
} from 'src/utils/graphQLClient'

const SCROLL_DIRECTION_UP = 'SCROLL_DIRECTION_UP'
const SCROLL_DIRECTION_NONE = 'SCROLL_DIRECTION_NONE'
const SCROLL_DIRECTION_DOWN = 'SCROLL_DIRECTION_DOWN'

const USER_ID = '320096369' // @subuta_nico.

import Tweet from 'src/components/Tweet'

const enhance = compose(
  hot(module),
  withPreventSSR,
  withHandlers({
    getTweets: () => async (maxId) => {
      // Get sorted todoes by dueDate ASC.
      const query = gql`
        ${tweetFields}

        query getTweetsWithProfile($user_id: ID!, $limit: Int, $max_id: ID!) {
          twitter {
            tweets(user_id: $user_id, limit: $limit, max_id: $max_id) {
              ...tweetFields
              quoted_status {
                ...tweetFields
              }
            }
          }
        }
      `

      const data = await graphQLClient.request(query, { user_id: USER_ID, limit: 101, max_id: maxId })
      const tweets = _.get(data, 'twitter.tweets', [])

      return _.tail(tweets)
    }
  }),
  withStateHandlers(
    ({ tweets }) => {
      return {
        rows: tweets
      }
    },
    {
      prependRows: (state) => (rows) => {
        return {
          rows: [...state.rows, ...rows]
        }
      }
    }
  ),
  withPropsOnChange(
    ['prependRows'],
    ({ prependRows }) => ({
      // Prevent duplicate call.
      prependRows: _.debounce(prependRows, 300, { leading: true, trailing: false })
    })
  ),
  withHandlers({
    onLoadMore: ({ prependRows, rows, getTweets }) => async ({ isAtFirst }) => {
      if (isAtFirst) return
      const lastId = _.get(_.last(rows), 'id_str')
      const tweets = await getTweets(lastId)
      // Simulate delay of loading.
      prependRows(tweets)
    }
  }),
  withStyles
)

const renderRow = ({ row, user, setSizeRef, style, styles }) => {
  // console.log('row = ', row)
  return (
    <Tweet
      className={`row-${row.id_str} ${styles.Row}`}
      style={style}
      user={user}
      tweet={row}
      setSizeRef={setSizeRef}
    />
  )
}

const renderGroupHeader = ({ row, setSizeRef, style, styles }) => {
  const { groupHeader } = row
  return (
    <div style={style} className='pointer-events-none'>
      <div
        ref={setSizeRef}
        className={`c-sticky ${styles.GroupHeaderContainer}`}
      >
        <div className={styles.GroupHeader}>
          <span className={styles.GroupHeaderLabel}>{groupHeader}</span>
        </div>
      </div>
    </div>
  )
}

const getGroupHeaderForRow = (row) => {
  const createdAt = dayjs(row.created_at)

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
    onScroll,
    onLoadMore,
    user,
    styles
  } = props

  return (
    <>
      <Helmet>
        <title>Channel</title>
      </Helmet>

      <div className='flex flex-col h-screen'>
        <header className='pt-4 pb-2 px-4 flex-0'>Fixed header area</header>

        <Sized>
          {({ size, setSizeRef }) => {
            return (
              <div
                className='flex-1 overflow-hidden'
                ref={setSizeRef}
              >
                <VirtualList
                  onLoadMore={onLoadMore}
                  onScroll={onScroll}
                  height={size.height}
                  rows={rows}
                  groupBy={groupRowBy}
                  renderGroupHeader={(props) => renderGroupHeader({ ...props, styles })}
                  overScanCount={6}
                  reversed
                >
                  {(props) => renderRow({ ...props, user, styles })}
                </VirtualList>
              </div>
            )
          }}
        </Sized>
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
