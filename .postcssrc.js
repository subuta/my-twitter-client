const tailwindcss = require('tailwindcss')
const _ = require('lodash')

let tailwindConfig = require('./tailwind')

// Empty modules (Because module variants not working well with apply.).
tailwindConfig.modules = _.transform(tailwindConfig.modules, (result, __, key) => {
  result[key] = []
}, {})

module.exports = {
  plugins: [
    tailwindcss(tailwindConfig)
  ]
}
