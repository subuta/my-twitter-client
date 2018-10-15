import React from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader'
import _ from 'lodash'

import VirtualList from 'react-tiny-virtual-list'

import {
  getTweetsWithProfile
} from '../../utils/api'

import withStyles from './_styles'

import {
  compose,
  withHandlers,
  withPropsOnChange,
  withStateHandlers
} from 'recompose'

const SCROLL_DIRECTION_UP = 'SCROLL_DIRECTION_UP'
const SCROLL_DIRECTION_DOWN = 'SCROLL_DIRECTION_DOWN'

const enhance = compose(
  hot(module),
  withStyles,
  withStateHandlers(
    () => {
      const rows = _.fill(Array(20), _.uniqueId())
      return {
        rows,
        scrollToIndex: rows.length - 1
      }
    },
    {
      prependRows: (state) => (rows) => {
        const nextRows = [...rows, ...state.rows]
        return {
          rows: nextRows,
          scrollToIndex: rows.length - 1
        }
      }
    }
  ),
  withHandlers({
    onLoadMore: ({ prependRows }) => ({ isAtLast }) => {
      if (isAtLast) return
      // Simulate delay of loading.
      _.delay(() => prependRows(_.fill(Array(20), _.uniqueId())), 300)
    }
  }),
  withHandlers((props) => {
    let lastStartIndex = -1

    const debouncedOnLoadMore = _.debounce(props.onLoadMore, 1000 / 60)

    return {
      onItemsRendered: ({ rows }) => ({ startIndex, stopIndex }) => {
        // Assign lastStartIndex at first render.
        if (lastStartIndex === -1) lastStartIndex = startIndex
        // Ignore no-change.
        if (lastStartIndex === startIndex) return

        const scrollDirection = lastStartIndex > startIndex ? SCROLL_DIRECTION_UP : SCROLL_DIRECTION_DOWN
        const IsAtFirstOfRows = scrollDirection === SCROLL_DIRECTION_UP && startIndex === 0
        const IsAtLastOfRows = scrollDirection === SCROLL_DIRECTION_DOWN && stopIndex === rows.length - 1
        const currentIndex = scrollDirection === SCROLL_DIRECTION_UP ? startIndex : stopIndex

        if (IsAtFirstOfRows || IsAtLastOfRows) {
          debouncedOnLoadMore({
            scrollDirection,
            isAtFirst: IsAtFirstOfRows,
            isAtLast: IsAtLastOfRows
          })
        }

        lastStartIndex = startIndex
      }
    }
  }),
  withPropsOnChange(
    (props, nextProps) => {
      return props.rows.length !== nextProps.rows.length
    },
    ({ rows }) => ({
      renderItem ({ style, index }) {
        const row = rows[index]
        const itemStyle = stickyIndices.includes(index)
          ? {
            ...style,
            backgroundColor: '#EEE',
          }
          : style

        return (
          <div className="Row" style={itemStyle} key={index}>
            Row #{index} {row}
          </div>
        )
      }
    })
  )
)

const stickyIndices = []

const Channel = enhance((props) => {
  const {
    tweets = [],
    styles,
    rows,
    scrollToIndex,
    onItemsRendered,
    renderItem
  } = props

  // console.log(tweets)
  return (
    <div className="container">
      <Helmet>
        <title>Channel</title>
      </Helmet>

      <h1 className={styles.h1}>Channel</h1>

      <button className={styles.button}>fetch!</button>

      {/*<ul className="p-0">*/}
      {/*{_.map(tweets, ({ id_str: id, text }) => {*/}
      {/*return (*/}
      {/*<li key={id} className="p-4">{text}</li>*/}
      {/*)*/}
      {/*})}*/}
      {/*</ul>*/}

      <VirtualList
        width="auto"
        height={200}
        itemCount={rows.length}
        renderItem={renderItem}
        itemSize={50}
        className="VirtualList"
        scrollToIndex={scrollToIndex}
        stickyIndices={stickyIndices}
        onItemsRendered={onItemsRendered}
      />
    </div>
  )
})

Channel.getInitialProps = async () => {
  const userId = '320096369' // @subuta_nico.
  return await getTweetsWithProfile(userId)
}

export default Channel
