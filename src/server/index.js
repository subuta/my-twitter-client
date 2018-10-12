import Koa from 'koa'
import logger from 'koa-logger'
import koaBody from 'koa-body'
import serve from 'koa-static'
import cors from '@koa/cors'
import clearModule from 'clear-module'

import {
  ROOT_DIR,
  PUBLIC_DIR
} from '../../config'

const {
  PORT
} = process.env

const dev = process.env.NODE_ENV !== 'production'

const port = parseInt(PORT, 10) || 3000
const app = new Koa()

// log requests
app.use(logger())

// parse body
app.use(koaBody())

// Add cors
app.use(cors())

if (dev) {
  // Server side hot-module-replacement :)
  const watcher = require('sane')(ROOT_DIR, {
    glob: ['src/**/*.js', 'tmp/**/*.json'],
    ignored: [
      /node_modules/
    ]
  })
  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Clearing src module cache from server')
      clearModule.match(/src/)
      clearModule.match(/(css-as-js|react-ur)/)
    })
  })
}

// try PUBLIC_DIR first
app.use(serve(PUBLIC_DIR))

// Register views routes/allowedMethods
if (dev) {
  // Dynamic import modules for development(With no-module-cache).
  // SEE: https://github.com/glenjamin/ultimate-hot-reloading-example/blob/master/server.js
  // Import API
  app.use((...args) => require('./api').default.routes().apply(null, args))
  app.use((...args) => require('./api').default.allowedMethods().apply(null, args))
  // Import views
  app.use((...args) => require('./views').default.routes().apply(null, args))
  app.use((...args) => require('./views').default.allowedMethods().apply(null, args))
} else {
  // Use modules statically otherwise (prod/test).
  // Import API
  const api = require('./api').default
  app.use(api.routes())
  app.use(api.allowedMethods())
  // Import views
  const views = require('./views').default
  app.use(views.routes())
  app.use(views.allowedMethods())
}

const onError = (err) => {
  // Ignore error for page deletion.
  if (err.message.match(/Cannot find module '.*\/pages(\/.*)\.js'/)) {
    const matched = err.message.match(/Cannot find module '.*\/pages(\/.*)\.js'/)
    console.log(`Page '${matched[1]}' deleted.`)
    return
  }
  console.error('err = ', err)
}

app.on('error', onError)
process.on('uncaughtException', onError)

// Serve the files on port.
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
