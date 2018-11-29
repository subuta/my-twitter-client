import Router from 'koa-router'
import { PassThrough } from 'stream'
import _ from 'lodash'

import {
  subscribe,
  unsubscribe,
  publish
} from 'src/utils/redis'

import {
  ChannelAll,
  EventHeartBeat
} from 'src/config'

const stream = new Router({
  prefix: '/api/stream'
})

// 'EventSource.onmessage' expects event as 'message'
// Use EventSource.addEventListener for other event type.
const sse = (data, event = 'message') => {
  return `event:${ event }\ndata: ${ data }\n\n`
}

stream.get('/all', async ctx => {
  const stream = ctx.body = new PassThrough()

  // Send data to stream
  const send = (data) => stream.write(sse(data))

  // Send heartbeat message to client, at each 15sec
  const heartbeat = setInterval(() => send(JSON.stringify({event: EventHeartBeat, text: '💓'})), 1000 * 15);

  // Close subscription and stream.
  const close = () => {
    unsubscribe(ChannelAll, send)
    clearInterval(heartbeat);
    ctx.res.end()
  }

  subscribe(ChannelAll, send)

  ctx.req.on('close', close)
  ctx.req.on('finish', close)
  ctx.req.on('error', close)

  ctx.type = 'text/event-stream'
  ctx.set('Transfer-Encoding', 'chunked');
  ctx.set('Cache-Control', 'no-cache');
  // SEE: https://serverfault.com/questions/801628/for-server-sent-events-sse-what-nginx-proxy-configuration-is-appropriate
  ctx.set('X-Accel-Buffering', 'no');

  ctx.flushHeaders()
})

export default stream
