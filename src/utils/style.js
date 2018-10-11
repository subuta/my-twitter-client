import _ from 'lodash'
import { styled } from 'react-free-style'

export default function createWithStyles (styles = {}, options = {}) {
  styles = _.transform(
    styles,
    (result, style, key) => (result[key] = style),
    {}
  )

  if (!_.isEmpty(options.rules)) {
    options.rules = _.transform(
      options.rules,
      (result, rule) => {
        result.push([rule[0], rule[1]])
      },
      []
    )
  }

  if (!_.isEmpty(options.css)) {
    options.css = _.transform(
      options.css,
      (result, style, key) => (result[key] = style),
      {}
    )
  }

  return styled(styles, options)
}