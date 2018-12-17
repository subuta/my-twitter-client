import sinon from 'sinon'

import { match, clear } from '../clearModule'
import clearModule from 'clear-module'

import { ROOT_DIR } from '../../../config'

jest.mock('clear-module')

const shouldMatch = (path, pattern, ignore = []) => {
  if (match(path, pattern).length === 0) fail(`should '${path}' match '${pattern}'`)
}

const shouldNotMatch = (path, pattern, ignore = []) => {
  if (match(path, pattern).length > 0) fail(`should not '${path}' match '${pattern}'`)
}

test('should allow glob style match', () => {
  shouldMatch('hoge.js', '*.js')
  shouldNotMatch('hoge.css', '*.js')

  shouldNotMatch('src/hoge.js', '*.js')
  shouldMatch('src/hoge.js', '**/*.js')

  shouldNotMatch('src/hoge.js', [
    'src/**/*',
    '!src/hoge.js'
  ])

  shouldNotMatch('/Users/hoge/src/hoge.js', [
    '**/src/**/*',
    '!**/src/hoge.js'
  ])

  shouldMatch('hoge.js', '{hoge, fuga}.js')
  shouldMatch('src/hoge.js', '**/{hoge, fuga}.js')

  // Should replace @ to ROOT_DIR.
  shouldMatch(`${ROOT_DIR}/src/hoge.js`, '@/src/hoge.js')
})

test('should clear matched modules', () => {
  const { clear } = require('../clearModule')

  const cleared = clear([
    '**/src/**/*',
    '!src/hoge.js'
  ], [
    'src/hoge.js',
    'src/fuga.js',
    '/Users/hoge/src/fuga.js'
  ])

  expect(clearModule).toHaveBeenCalledWith('src/fuga.js')
  expect(clearModule).toHaveBeenCalledWith('/Users/hoge/src/fuga.js')

  expect(cleared).toEqual([
    'src/fuga.js',
    '/Users/hoge/src/fuga.js'
  ])
})
