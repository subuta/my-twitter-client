import Koa from 'koa'
import logger from 'koa-logger'
import koaBody from 'koa-body'
import serve from 'koa-static'
import cors from '@koa/cors'
import exitHook from 'async-exit-hook'

import {
  ChannelAll,
  EventTweetPosted
} from 'src/config'

import stream from './api/stream'

import { publish } from 'src/utils/redis'
import { clear } from 'src/utils/clearModule'
import {
  subscribeTwitterStream
} from 'src/utils/twitter'

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
      const cleared = clear([
        '@/src/**',
        '@/node_modules/{css-as-js, react-ur}/**',
        // Modules to be ignored.
        '!@/src/utils/cache.js'
      ])
      console.log(`Cleared ${cleared.length} modules from module cache inside @/src`)
    })
  })
}

// try PUBLIC_DIR first
app.use(serve(PUBLIC_DIR))

// Mount stream routes.
app.use(stream.routes())
app.use(stream.allowedMethods())

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

// Subscribe for twitter events.
const unSubscribeTwitterStream = subscribeTwitterStream((data) => {
  // Publish tweet event to clients.
  publish(ChannelAll, {
    event: EventTweetPosted,
    data
  })
})

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

exitHook((cb) => {
  console.log('\r\nTry to exit server ...')
  unSubscribeTwitterStream()
  cb()
})

// Serve the files on port.
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
