import React from 'react'
import sinon from 'sinon'

import twitter from '../twitter'
import Twitter from 'twitter-lite'

jest.mock('twitter-lite', () => {
  return jest.fn().mockImplementation(() => {
    return {
      stream: jest.fn((...args) => {
        return {
          on: mockOn
        }
      })
    }
  })
})

let mockOn
let clock

beforeEach(() => {
  clock = sinon.useFakeTimers()
})

afterEach(() => {
  clock.restore()
  mockOn.mockClear()
})

test('subscribeTwitterStream should call onData handler on receive data.', () => {
  let handlers = {}

  twitter.cache.set('hoge', 'hoge')

  expect(twitter.cache.length).toEqual(1)
  twitter.cache.reset = jest.fn(twitter.cache.reset)

  mockOn = jest.fn((...args) => {
    const [event, fn] = args
    handlers[event] = fn
    return {
      on: mockOn
    }
  })

  const onData = jest.fn()

  twitter.subscribeTwitterStream(onData)

  expect(onData).not.toHaveBeenCalled()
  expect(twitter.cache.reset).not.toHaveBeenCalled()
  expect(twitter.cache.reset).not.toHaveBeenCalled()

  // Simulate data.
  handlers['data']({})

  expect(onData).toHaveBeenCalled()
  expect(twitter.cache.reset).toHaveBeenCalled()
  expect(twitter.cache.length).toEqual(0)
})
