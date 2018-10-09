import React from 'react'
import { Helmet } from 'react-helmet'

import { Routes } from 'react-ur'

export default () => {
  return (
    <>
      <Helmet>
        {/* language=CSS */}
        <style type="text/css">{`
          body {
            font-family: system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          }
        `}</style>

        <link rel="stylesheet" type="text/css" href="/app.css" />
      </Helmet>

      <Routes configure={(pages) =>
        pages
          .rename('/channel', '/')
          .rename('/todo', '/todo/:id')
          .inject404()
      } />
    </>
  )
}
