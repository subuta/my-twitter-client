import React from 'react' // eslint-disable-line

import { renderClient } from 'react-ur'

import App from '../components/App'

renderClient('#app', { App })

if (module.hot) {
  // console.clear()
  module.hot.accept()
}
