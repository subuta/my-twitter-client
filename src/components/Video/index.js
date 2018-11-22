import React from 'react'
import _ from 'lodash'

// import ReactPlayer from 'react-player'

import {
  compose,
  withHandlers
} from 'recompose'

const enhance = compose(
  withHandlers(() => {
    let ref = null

    return {
      setRef: () => (_ref) => {
        ref = _ref
      },

      play: () => () => {
        if (!ref) return
        ref.play()
      }
    }
  })
)

export default enhance((props) => {
  const {
    className = '',
    style = {},
    sources = [],
    autoPlay = false,
    loop = false,
    muted = true,
    preload = 'auto',
    setRef,
    src,
    controls,
  } = props

  return (
    <video
      className={className}
      ref={setRef}
      src={src}
      style={style}
      preload={preload}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
    >
      {_.map(sources, ({ src, type }) => (
        <source key={src} src={src} type={type} />
      ))}
      Your browser does not support the video tag.
    </video>
  )
})
