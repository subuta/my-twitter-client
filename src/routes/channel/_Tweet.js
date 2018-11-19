import React from 'react'
import {
  compose,
  lifecycle
} from 'recompose'

import _ from 'lodash'

import dayjs from 'src/utils/dayjs'

// import withMeasure from 'src/hocs/withMeasure'

const enhance = compose(
  // withMeasure,
  lifecycle({
    componentDidMount () {
      // _.delay(() => this.props.refresh(), 100)
    }
  })
)

export default enhance((props) => {
  const {
    style,
    className,
    user,
    tweet,
    setMeasureRef
  } = props

  const {
    text,
    created_at
  } = tweet

  const {
    screen_name,
    name,
    profile_image_url
  } = user

  const createdAt = dayjs(created_at)

  return (
    <div
      className={className}
      style={style}
      ref={setMeasureRef}
    >
      <img
        src={profile_image_url}
        alt='avatar'
        style={{height: 48, width: 48}}
      />
      <span>{screen_name}{name}</span>
      <small>{createdAt.format('h:ss A')}</small>
      <p>
        {text}
      </p>
    </div>
  )
})
