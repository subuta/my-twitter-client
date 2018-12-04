import React from 'react'
import sinon from 'sinon'

import moment, {
  fromTwitterDate,
  isToday,
  isYesterday,
  isThisYear
} from '../moment'

let clock

beforeEach(() => {
  clock = sinon.useFakeTimers()
})

afterEach(() => {
  clock.restore()
})

test('should parse twitter-style date correctly', () => {
  const day = fromTwitterDate('Wed May 28 05:51:51 +0000 2014')
  expect(day.toISOString()).toBe('2014-05-28T05:51:51.000Z')
})

test('should detect today', () => {
  const today = moment('2018-08-08 16:00:00')

  clock = sinon.useFakeTimers(today.toDate())

  expect(isToday(moment('2018-08-08 00:00:01'))).toBe(true)
  expect(isToday(moment('2018-08-08 00:00:00'))).toBe(true)
  expect(isToday(moment('2018-08-07 23:59:59'))).toBe(false)
})

test('should detect yesterday', () => {
  const today = moment('2018-08-08 16:00:00')

  clock = sinon.useFakeTimers(today.toDate())

  expect(isYesterday(moment('2018-08-08 00:00:00'))).toBe(false)
  expect(isYesterday(moment('2018-08-07 23:59:59'))).toBe(true)
  expect(isYesterday(moment('2018-08-07 00:00:00'))).toBe(true)
  expect(isYesterday(moment('2018-08-06 23:59:59'))).toBe(false)
})

test('should detect isThisYear', () => {
  const today = moment('2018-08-08 16:00:00')

  clock = sinon.useFakeTimers(today.toDate())

  expect(isThisYear(moment('2018-12-31 23:59:59'))).toBe(true)
  expect(isThisYear(moment('2018-01-01 00:00:00'))).toBe(true)
  expect(isThisYear(moment('2017-12-31 23:59:59'))).toBe(false)
})
