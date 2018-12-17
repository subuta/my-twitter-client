import _ from 'lodash'
import LRU from 'lru-cache'

// Simple LRU Cache.
const cache = new LRU({
  max: 1000,
  maxAge: 1000 * 60 * 60 // 1h
})

cache.id = _.uniqueId('cache')

// Export singleton cache.
export default cache
