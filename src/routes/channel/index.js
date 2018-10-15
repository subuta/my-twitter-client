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
  withStateHandlers,
  lifecycle,
  withState,
  branch,
  renderComponent
} from 'recompose'

import mapVh from 'src/hocs/mapVh'

const SCROLL_DIRECTION_UP = 'SCROLL_DIRECTION_UP'
const SCROLL_DIRECTION_DOWN = 'SCROLL_DIRECTION_DOWN'

const enhance = compose(
  hot(module),
  mapVh,
  withState('isMounted', 'setIsMounted', false),
  withStyles,
  withStateHandlers(
    () => {
      const rows = _.fill(Array(20), 1)
      const virtualRowsCount = rows.length + 50
      return {
        virtualRowsCount,
        rows,
        initialScrollToIndex: virtualRowsCount - 1
      }
    },
    {
      prependRows: (state) => (rows, doScrollToIndex = false) => {
        const nextRows = [...state.rows, ...rows]
        const nextVirtualRowsCount = nextRows.length + 50

        return {
          virtualRowsCount: nextVirtualRowsCount,
          rows: nextRows
        }
      }
    }
  ),
  withHandlers({
    getVirtualIndex: ({ virtualRowsCount }) => (index) => {
      return virtualRowsCount - index - 1
    }
  }),
  withHandlers({
    onLoadMore: ({ prependRows }) => ({ isAtFirst, isAtVirtualLast }) => {
      if (isAtFirst) return
      // Simulate delay of loading.
      _.delay(() => prependRows(_.fill(Array(20), 1), isAtVirtualLast), 1000)
    }
  }),
  withHandlers((props) => {
    let lastArg = {
      startIndex: -1,
      stopIndex: -1
    }
    let scrollDirection = SCROLL_DIRECTION_UP

    const debouncedOnLoadMore = _.debounce(props.onLoadMore, 100)

    return {
      onItemsRendered: ({ virtualRowsCount, rows, getVirtualIndex }) => (arg) => {
        // Swap args for reversed list.
        const startIndex = getVirtualIndex(arg.stopIndex)
        const stopIndex = getVirtualIndex(arg.startIndex)

        // Assign lastStartIndex at first render.
        if (lastArg.startIndex === -1) lastArg.startIndex = startIndex
        // Ignore no-change.
        if (lastArg.startIndex === startIndex) return

        scrollDirection = lastArg.startIndex > startIndex ? SCROLL_DIRECTION_UP : SCROLL_DIRECTION_DOWN
        
        const IsAtFirstOfRows = scrollDirection === SCROLL_DIRECTION_UP && startIndex === 0
        const IsAtLastOfRows = scrollDirection === SCROLL_DIRECTION_DOWN && stopIndex >= rows.length - 1
        const currentIndex = scrollDirection === SCROLL_DIRECTION_UP ? startIndex : stopIndex

        if (IsAtFirstOfRows || IsAtLastOfRows) {
          debouncedOnLoadMore({
            scrollDirection,
            currentIndex,
            isAtFirst: IsAtFirstOfRows,
            isAtLast: IsAtLastOfRows,
            isAtVirtualLast: currentIndex === virtualRowsCount - 1
          })
        }

        lastArg = arg
      }
    }
  }),
  withPropsOnChange(
    (props, nextProps) => {
      return props.rows.length !== nextProps.rows.length
    },
    ({ rows, getVirtualIndex }) => ({
      renderItem (arg) {
        const { style } = arg

        const index = getVirtualIndex(arg.index)
        const row = rows[index]

        const itemStyle = stickyIndices.includes(index)
          ? {
            ...style,
            backgroundColor: '#EEE',
          }
          : style

        if (!row) {
          return (
            <div className="Row" style={itemStyle} key={index}>
              Loading... ({index})
            </div>
          )
        }

        return (
          <div className="Row" style={itemStyle} key={index}>
            Row #{index} {row}
          </div>
        )
      }
    })
  ),
  lifecycle({
    componentDidMount () {
      console.log('mounted!')
      this.props.setIsMounted(true)
    }
  }),
  branch(
    ({ isMounted }) => !isMounted,
    renderComponent(() => null),
    _.identity
  )
)

const stickyIndices = []

const Channel = enhance((props) => {
  const {
    tweets = [],
    styles,
    rows,
    vh,
    virtualRowsCount,
    initialScrollToIndex,
    onItemsRendered,
    renderItem
  } = props

  // console.log(tweets)
  return (
    <>
      <Helmet>
        <title>Channel</title>
      </Helmet>

      {/*<ul className="p-0">*/}
      {/*{_.map(tweets, ({ id_str: id, text }) => {*/}
      {/*return (*/}
      {/*<li key={id} className="p-4">{text}</li>*/}
      {/*)*/}
      {/*})}*/}
      {/*</ul>*/}

      <div style={{height: '100vh', position: 'relative'}}>
        <VirtualList
          width="auto"
          height={vh || window.innerHeight}
          itemCount={virtualRowsCount}
          overscanCount={10}
          renderItem={renderItem}
          itemSize={50}
          className="VirtualList"
          scrollToIndex={initialScrollToIndex}
          stickyIndices={stickyIndices}
          onItemsRendered={onItemsRendered}
        />
      </div>
    </>
  )
})

Channel.getInitialProps = async () => {
  const userId = '320096369' // @subuta_nico.
  return await getTweetsWithProfile(userId)
}

export default Channel
