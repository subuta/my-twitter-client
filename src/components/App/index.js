import React from 'react'
import { Helmet } from 'react-helmet'

import withStyles from './style'
import { Routes } from 'react-ur'

import { css } from 'css-as-js'

export default withStyles(() => {
  return (
    <div>
      <Helmet>
        <style type="text/css">{css}</style>
      </Helmet>

      <Routes configure={(pages) =>
        pages
          .rename('/channel', '/')
          .inject404()
      } />
    </div>
  )
})
