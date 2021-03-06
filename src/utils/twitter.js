// Based on https://github.com/clayallsopp/graphqlhub/blob/master/graphqlhub-schemas/src/apis/twitter.js

import Twitter from 'twitter-lite'
import _ from 'lodash'
import crypto from 'crypto'

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET
} = process.env

import cache from './cache'

// Hash function.
const sha1 = (data) => {
  if (!_.isString(data)) {
    data = JSON.stringify(data)
  }
  return crypto.createHash('sha1').update(data, 'binary').digest('hex')
}

// Omit falsy value.
const credentials = _.pickBy({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
}, _.identity)

const twitterClient = new Twitter(credentials)

const getPromise = async (endpoint, parameters, resultPath = null, method = 'get') => {
  const args = method === 'get' ? [endpoint, parameters] : [endpoint, null, parameters]
  const result = await twitterClient[method].apply(twitterClient, args)
    .catch(err => {
      console.error(err)
    })

  let data = resultPath !== null ? _.get(result, resultPath) : result

  // Add isLast for cursor based API.
  // SEE: https://developer.twitter.com/en/docs/basics/cursoring
  if (_.has(result, 'next_cursor')) {
    data.isLast = !!result.next_cursor
  }

  return data
}

// Cache getPromise call by parameters.
const getPromiseWithCache = async (...args) => {
  const [endpoint, parameters, resultPath = null, method = 'get'] = args

  // Clear whole cache at mutation. (non-get = POST/PUT/DELETE/PATCH...)
  if (method !== 'get') {
    cache.reset()
  }

  const cacheKey = `${endpoint}-${sha1(parameters)}`

  if (!cache.has(cacheKey)) {
    const data = await getPromise.apply(null, args)
    cache.set(cacheKey, data)
  }

  return cache.get(cacheKey)
}

// Queries
const getUser = (identifier, identity) => getPromiseWithCache('users/show', { [identifier]: identity })

const getTweet = (id) => getPromiseWithCache('statuses/show', {
  id,
  tweet_mode: 'extended',
})

const getTweets = (userId, count, max_id) => getPromiseWithCache(`statuses/user_timeline`, _.pickBy({
  count,
  tweet_mode: 'extended',
  user_id: userId,
  max_id: max_id
}, _.identity))

const getRetweets = (id, count) => getPromiseWithCache('statuses/retweets', { id, count })
const getFriends = (id, count, cursor) => getPromiseWithCache('friends/list', { id, count, cursor }, 'users')
const getFollowers = (id, count, cursor) => getPromiseWithCache('followers/list', { id, count, cursor }, 'users')
const searchFor = (queryParams) => getPromiseWithCache('search/tweets', queryParams, 'statuses')

// Mutations
const postTweet = (status) => getPromiseWithCache('statuses/update', { status }, null, 'post')

// Subscribe for twitter status changes of specific user.
const subscribeTwitterStream = (onData) => {
  console.log('[subscribeTwitterStream] subscribe')

  const params = {
    follow: '320096369', // @subuta
    // track: "#bitcoin,#litecoin,#monero", // #bitcoin, #litecoin, #monero
    // follow: "422297024,873788249839370240", // @OrchardAI, @tylerbuchea
    // locations: "-122.75,36.8,-121.75,37.8", // Bounding box -	San Francisco
  }

  twitterClient.stream('statuses/filter', params)
    .on('start', response => console.log('[subscribeTwitterStream] start'))
    .on('data', (data) => {
      // Force reloading of tweet.
      cache.reset()
      onData(data)
    })
    .on('ping', () => console.log('[subscribeTwitterStream] ping'))
    .on('error', error => console.error('[subscribeTwitterStream] error', error))
    .on('end', response => console.log('[subscribeTwitterStream] end'))

  return () => {
    console.log('[subscribeTwitterStream] unSubscribe')

    twitterClient.stream.destroy() // emits "end" and "error" event
  }
}

const resetCache = () => cache.reset()

export {
  getUser,
  getTweet,
  getRetweets,
  getFriends,
  getFollowers,
  searchFor,
  getTweets,

  postTweet,

  subscribeTwitterStream,
  resetCache
}

export default {
  getUser,
  getTweet,
  getRetweets,
  getFriends,
  getFollowers,
  searchFor,
  getTweets,

  postTweet,

  subscribeTwitterStream,
  resetCache
}
