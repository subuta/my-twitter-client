import React from 'react'
import _ from 'lodash'

export default (props) => {
  const {
    icon,
    size = 'sm',
    onClick = _.noop
  } = props

  let className = `svg-${icon}-dims`

  if (props.className) {
    className += ' ' + props.className
  }
  if (size) {
    className += ` icon-${size}`
  }


  return (
    <svg
      className={className}
      onClick={onClick}
    >
      <use xlinkHref={`/images/sprite.svg#${icon}`} />
    </svg>
  )
}
