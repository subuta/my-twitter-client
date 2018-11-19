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

// import Tweet from './_Tweet'

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
  // withStateHandlers(
  //   ({ tweets }) => {
  //     const rows = tweets
  //     const virtualRowsCount = rows.length + 50
  //     return {
  //       overScanCount: 3,
  //       virtualRowsCount,
  //       rows,
  //       initialScrollToIndex: virtualRowsCount - 1
  //     }
  //   },
  //   {
  //     prependRows: (state) => (rows) => {
  //       const nextRows = [...state.rows, ...rows]
  //       const nextVirtualRowsCount = nextRows.length + 50
  //       return {
  //         virtualRowsCount: nextVirtualRowsCount,
  //         rows: nextRows
  //       }
  //     }
  //   }
  // ),
  // withHandlers(({ overScanCount }) => {
  //   let lastArg = {
  //     startIndex: -1,
  //     stopIndex: -1
  //   }
  //   let scrollDirection = SCROLL_DIRECTION_NONE
  //
  //   return {
  //     getVirtualIndex: ({ virtualRowsCount }) => (index) => {
  //       return virtualRowsCount - index - 1
  //     },
  //
  //     compareScroll: () => (arg) => {
  //       // Assign lastStartIndex at first render.
  //       if (lastArg.startIndex === -1) lastArg.startIndex = arg.startIndex
  //       // Ignore no-change.
  //       if (lastArg.startIndex === arg.startIndex) return { scrollDirection: SCROLL_DIRECTION_NONE }
  //
  //       scrollDirection = lastArg.startIndex > arg.startIndex ? SCROLL_DIRECTION_UP : SCROLL_DIRECTION_DOWN
  //
  //       // Get in-visible (includes overScan) row index.
  //       const currentIndex = scrollDirection === SCROLL_DIRECTION_UP ? arg.startIndex : arg.stopIndex
  //       // Get visible row index.
  //       const visibleCurrentIndex = scrollDirection === SCROLL_DIRECTION_UP ? (arg.startIndex + overScanCount) : (arg.stopIndex - overScanCount)
  //
  //       // Keep lastArg.
  //       lastArg = arg
  //
  //       return {
  //         scrollDirection,
  //         currentIndex,
  //         visibleCurrentIndex
  //       }
  //     },
  //
  //     getTweets: () => async (maxId) => {
  //       // Get sorted todoes by dueDate ASC.
  //       const query = gql`
  //         ${tweetFields}
  //
  //         query getTweetsWithProfile($user_id: ID!, $limit: Int, $max_id: ID!) {
  //           twitter {
  //             tweets(user_id: $user_id, limit: $limit, max_id: $max_id) {
  //               ...tweetFields
  //               quoted_status {
  //                 ...tweetFields
  //               }
  //             }
  //           }
  //         }
  //       `
  //
  //       const data = await graphQLClient.request(query, { user_id: USER_ID, limit: 101, max_id: maxId })
  //       const tweets = _.get(data, 'twitter.tweets', [])
  //
  //       return _.tail(tweets)
  //     }
  //   }
  // }),
  // withPropsOnChange(
  //   ['prependRows'],
  //   ({ prependRows }) => ({
  //     // Prevent duplicate call.
  //     prependRows: _.debounce(prependRows, 300, { leading: true, trailing: false })
  //   })
  // ),
  // withHandlers({
  //   onLoadMore: ({ prependRows, rows, getTweets }) => async ({ isAtFirst }) => {
  //     if (isAtFirst) return
  //     const lastId = _.get(_.last(rows), 'id_str')
  //     const tweets = await getTweets(lastId)
  //     // Simulate delay of loading.
  //     prependRows(tweets)
  //   }
  // }),
  // withHandlers((props) => {
  //   const onLoadMore = _.debounce(props.onLoadMore, 100, { leading: true })
  //
  //   return {
  //     onItemsRendered: ({ virtualRowsCount, rows, getVirtualIndex }) => (arg) => {
  //       // Swap args for reversed list.
  //       const startIndex = getVirtualIndex(arg.stopIndex)
  //       const stopIndex = getVirtualIndex(arg.startIndex)
  //
  //       const { scrollDirection, currentIndex } = props.compareScroll({ startIndex, stopIndex })
  //
  //       // Ignore no-change.
  //       if (scrollDirection === SCROLL_DIRECTION_NONE) return
  //
  //       const IsAtFirstOfRows = scrollDirection === SCROLL_DIRECTION_UP && startIndex === 0
  //       const IsAtLastOfRows = scrollDirection === SCROLL_DIRECTION_DOWN && stopIndex >= rows.length - 1
  //
  //       if (IsAtFirstOfRows || IsAtLastOfRows) {
  //         onLoadMore({
  //           scrollDirection,
  //           currentIndex,
  //           isAtFirst: IsAtFirstOfRows,
  //           isAtLast: IsAtLastOfRows
  //         })
  //       }
  //     }
  //   }
  // }),
  // // withRTVLUtil,
  // withHandlers(() => {
  //   let itemSizesCache = []
  //   let listRef = null
  //   let refresh = _.noop
  //   let forceUpdate = _.noop
  //
  //   return {
  //     setListRef: () => (ref) => {
  //       listRef = ref
  //
  //       if (listRef) {
  //         refresh = () => requestAnimationFrame(() => {
  //           console.log('refresh!')
  //           listRef && listRef.recomputeSizes()
  //           // listRef && listRef.forceUpdate()
  //         })
  //       }
  //     },
  //
  //     refresh: () => () => refresh(),
  //
  //     setItemSizesCache: () => (index, height) => {
  //       itemSizesCache[index] = height
  //       refresh()
  //     },
  //
  //     getItemSizesCache: () => () => itemSizesCache
  //   }
  // }),
  // withPropsOnChange(
  //   (props, nextProps) => {
  //     return props.rows.length !== nextProps.rows.length
  //   },
  //   (props) => {
  //     const {
  //       rows,
  //       user,
  //       getVirtualIndex,
  //       getItemSizesCache,
  //       setItemSizesCache,
  //       refresh
  //     } = props
  //
  //     return {
  //       renderItem (arg) {
  //         const { style } = arg
  //
  //         const index = getVirtualIndex(arg.index)
  //         const row = rows[index]
  //
  //         // While loading...
  //         if (!row || !user) {
  //           return (
  //             <div className={`row-${index}`} style={style} key={index}>
  //               Loading...
  //             </div>
  //           )
  //         }
  //
  //         // console.log(index, 'style = ', style)
  //
  //         return (
  //           <div
  //             className={`row-${index}`}
  //             style={style}
  //             key={index}
  //           >
  //             <Tweet
  //               user={user}
  //               tweet={row}
  //               onMeasure={({ height }) => setItemSizesCache(index, height)}
  //               refresh={refresh}
  //             />
  //           </div>
  //         )
  //       },
  //
  //       getItemSizes: () => {
  //         const filled = _.fill(new Array(rows.length), 0)
  //         const itemSizesCache = getItemSizesCache()
  //         return _.merge(filled, itemSizesCache)
  //       }
  //     }
  //   }
  // )
)

const renderRow = ({ row, setSizeRef, style }) => {
  return (
    <div
      className={`row-${row.id}`}
      style={style}
    >
      <div
        ref={setSizeRef}
        className='relative px-4 py-2 border-b'
      >
        <span className='text-red font-bold'>Row: {row.id}</span>

        <p>{row.text}</p>
      </div>
    </div>
  )
}

const renderGroupHeader = ({ row, setSizeRef, style }) => {
  const { groupHeader } = row
  return (
    <div
      className={`header-${groupHeader}`}
      style={style}
    >
      <div
        ref={setSizeRef}
        className='c-sticky pin-t z-50 w-screen'
      >
        <div className="py-2 px-4 bg-red text-white font-bold">{groupHeader}th</div>
      </div>
    </div>
  )
}


const Channel = enhance((props) => {
  const { rows, onScroll, onLoadMore } = props

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
                  // groupBy={({ row }) => {
                  //   return Math.floor(row.id / 25) * 25
                  // }}
                  // renderGroupHeader={renderGroupHeader}
                  reversed
                >
                  {renderRow}
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
