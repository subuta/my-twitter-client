// Based on https://github.com/clayallsopp/graphqlhub/blob/master/graphqlhub-schemas/src/apis/twitter.js

import Twit from 'twit'
import _ from 'lodash'

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET
} = process.env

const twitterClient = new Twit({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
  app_only_auth: !TWITTER_ACCESS_TOKEN
})

const getPromise = (endpoint, parameters, resultPath = null, method = 'get') => new Promise((resolve, reject) => {
  twitterClient[method](
    endpoint,
    parameters,
    (error, result) => {
      if (error) return reject(error)
      resolve(resultPath !== null ? _.get(result, resultPath) : result)
    }
  )
})

const tweet = (status) => getPromise('statuses/update', { status }, null, 'post');

export {
  tweet
}

export default {
  tweet
}