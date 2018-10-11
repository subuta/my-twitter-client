import createWithStyles from 'src/utils/style'

const body = {
  fontFamily: 'system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  '-webkit-font-smoothing': 'antialiased',
  'text-rendering': 'optimizeLegibility'
}

export const commonCss = {
  css: {
    body
  },
  rules: []
}

export default createWithStyles({}, commonCss)
