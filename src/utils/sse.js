import _ from 'lodash'

import {
  EventHeartBeat
} from 'src/config'

const isBrowser = typeof window !== 'undefined'

const BASE_URL = 'http://localhost:3000'

// Create SSE Connection.
const eventSource = isBrowser && new EventSource(`${BASE_URL}/api/stream/all`)

const DEBUG_EVENTS = [EventHeartBeat]

let eventListeners = {}

if (eventSource) {
  eventSource.onerror = function (err) {
    console.error('EventSource failed.', err)
  }

  eventSource.onopen = function (event) {
    console.log('EventSource opened.', event)
  }

  eventSource.onmessage = function (_event) {
    const {event, data} = JSON.parse(_event.data)

    const listeners = eventListeners[event]

    if (_.includes(DEBUG_EVENTS, event)) {
      console.debug(`Got ${event}`)
    } else {
      console.log(`Got ${event}`)
    }

    if (!listeners) return
    listeners.forEach(cb => cb(data))
  }
}

export const subscribe = (event, cb) => {
  if (!isBrowser) return

  if (!eventListeners[event]) {
    eventListeners[event] = []
  }

  eventListeners[event].push(cb)

  console.debug(`Subscribed to '${event}', listeners = ${eventListeners[event].length}`)
}

export const unsubscribe = (event, cb) => {
  if (!isBrowser) return

  // Just ignore if no-listeners found.
  if (!eventListeners[event]) return
  eventListeners[event] = _.without(eventListeners[event], cb)
  console.debug(`UnSubscribed from '${event}', listeners = ${eventListeners[event].length}`)
}
