import _ from 'lodash'
import multimatch from 'multimatch'
import clearModule from 'clear-module'

import { ROOT_DIR } from '../../config'

export const replaceRoot = (pattern) => pattern.replace('@', ROOT_DIR)

export const match = (paths, patterns) => {
  if (_.isString(patterns)) {
    patterns = [patterns]
  }
  return multimatch(paths, _.map(patterns, replaceRoot))
}

export const clear = (patterns, modules) => {
  if (_.isString(patterns)) {
    patterns = [patterns]
  }

  if (!modules) {
    modules = Object.keys(require.cache)
  }

  const matched = match(modules, _.map(patterns, replaceRoot))
  _.each(matched, (moduleId) => clearModule(moduleId))
  return matched
}
