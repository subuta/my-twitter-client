import React from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
  getTweets
} from '../utils/api'

const Channel = ({ tweets = [] }) => {
  console.log(tweets)
  return (
    <>
      <Helmet>
        <title>Channel</title>
      </Helmet>

      <h1>Channel</h1>

      <ul>
        {_.map(tweets, ({ id, text }) => {
          return (
            <li key={id}>{text}</li>
          )
        })}
      </ul>
    </>
  )
}

Channel.getInitialProps = async () => {
  const userId = '320096369' // @subuta_nico.
  const tweets = await getTweets(userId)
  return {
    tweets
  }
}

export default hot(module)(Channel)