import React from 'react'
import {
  compose,
} from 'recompose'

import _ from 'lodash'

import dayjs from 'src/utils/dayjs'

const enhance = compose(
)

export default enhance((props) => {
  const {
    style,
    className,
    user,
    tweet,
    setSizeRef
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
    <div className={className}
         style={style}
    >
      <div ref={setSizeRef}>
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
    </div>
  )
})
