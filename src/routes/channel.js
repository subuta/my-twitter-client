import React from 'react'
import { Helmet } from 'react-helmet'
import { hot } from 'react-hot-loader'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
  fetchTodoes
} from '../utils/api'

import Todo from '../components/Todo'

const Channel = ({ todoes = [] }) => {
  return (
    <>
      <Helmet>
        <title>Channel</title>
      </Helmet>

      <h1>Channel</h1>
    </>
  )
}

Channel.getInitialProps = async () => {
  console.log('initial!')
  return {
  }
}

export default hot(module)(Channel)