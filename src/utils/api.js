import _ from 'lodash'
import gql from 'graphql-tag'
import graphQLClient from './graphQLClient'
// import minDelay from 'p-min-delay'

// Fetch list of tweets
export const getTweets = async (userId) => {
  // Get sorted todoes by dueDate ASC.
  const query = gql`
    query getTweets($user_id: ID!) {
      twitter {
        tweets(user_id: $user_id, limit: 2) {
          id
          text
        }
      }
    }
  `

  const data = await graphQLClient.request(query, { user_id: userId })
  return _.get(data, 'twitter.tweets', [])
}