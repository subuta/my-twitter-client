import React from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader'
import _ from 'lodash'

import dayjs from 'src/utils/dayjs'

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
import withStyles from './_styles'

import gql from 'graphql-tag'
import graphQLClient, {
  tweetFields,
  userFields
} from 'src/utils/graphQLClient'

const SCROLL_DIRECTION_UP = 'SCROLL_DIRECTION_UP'
const SCROLL_DIRECTION_NONE = 'SCROLL_DIRECTION_NONE'
const SCROLL_DIRECTION_DOWN = 'SCROLL_DIRECTION_DOWN'

const USER_ID = '320096369' // @subuta_nico.

import Tweet from './_Tweet'

const enhance = compose(
  withStyles,
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
  })
)

const renderRow = ({ row, user, setSizeRef, style }) => {
  return (
    <Tweet
      className={`row-${row.id}`}
      style={style}
      user={user}
      tweet={row}
      setSizeRef={setSizeRef}
    />
  )
}

const renderGroupHeader = ({ row, setSizeRef, style }) => {
  const { groupHeader } = row
  return (
    <div style={style}>
      <div
        ref={setSizeRef}
        className='c-sticky pin-t z-50 w-screen'
      >
        <div className="py-2 px-4 bg-red text-white font-bold">{groupHeader}</div>
      </div>
    </div>
  )
}

const Channel = enhance((props) => {
  const {
    rows,
    onScroll,
    onLoadMore,
    user
  } = props

  return (
    <>
      <Helmet>
        <title>Channel</title>
      </Helmet>

      <div className='flex flex-col h-screen'>
        <header className='p-4 flex-0 border-b-2'>Fixed header area</header>

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
                  groupBy={({ row }) => dayjs(row.created_at).fromNow()}
                  renderGroupHeader={renderGroupHeader}
                  reversed
                >
                  {(props) => renderRow({ ...props, user })}
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
