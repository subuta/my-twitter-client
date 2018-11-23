import _ from 'lodash'
import axios from 'axios'

// SEE: https://iframely.com/docs/oembed-api
const IFRAMELY_ENDPOINT = process.env.IFRAMELY_ENDPOINT || 'http://localhost:8061'

// Ensure obj key's are snake_case.
const snakeCaseKeys = (obj) => {
  if (_.isArray(obj)) {
    return _.map(obj, snakeCaseKeys)
  } else if (_.isPlainObject(obj)) {
    // Transform key
    return _.transform(obj, (result, value, key) => {
      // Escape values.
      result[_.snakeCase(key)] = snakeCaseKeys(value)
    }, {})
  }
  return obj
}

export const oembed = (url) => axios.get(`${IFRAMELY_ENDPOINT}/oembed`, {
  params: {
    url
  }
}).then(({ data }) => snakeCaseKeys(data))

// https://iframely.com/docs/parameters
export default (url) => axios.get(`${IFRAMELY_ENDPOINT}/iframely`, {
  params: {
    url
  }
}).then(({ data }) => snakeCaseKeys(data))
