import React from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader'
import _ from 'lodash'

import {
  getTweets
} from '../../utils/api'

import withStyles from './_styles'

import {
  compose
} from 'recompose'

const enhance = compose(
  hot(module),
  withStyles
)

const Channel = enhance(({ tweets = [], styles }) => {
  // console.log(tweets)
  return (
    <div className="container">
      <Helmet>
        <title>Channel</title>
      </Helmet>

      <h1 className={styles.h1}>Channel</h1>

      <button className={styles.button}>fetch!</button>

      <ul>
        {_.map(tweets, ({ id_str: id, text }) => {
          return (
            <li key={id}>{text}</li>
          )
        })}
      </ul>
    </div>
  )
})

Channel.getInitialProps = async () => {
  const userId = '320096369' // @subuta_nico.
  const tweets = await getTweets(userId)
  return {
    tweets
  }
}

export default Channel
