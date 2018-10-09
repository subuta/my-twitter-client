import _ from 'lodash'
import gql from 'graphql-tag'
import graphQLClient from './graphQLClient'
// import minDelay from 'p-min-delay'

// Fetch list of tweets
export const getTweets = async (userId, limit = 30) => {
  // Get sorted todoes by dueDate ASC.
  const query = gql`
    query getTweets($user_id: ID!, $limit: Int) {
      twitter {
        tweets(user_id: $user_id, limit: $limit) {
          id
          user {
            screen_name
          }
          text
          retweet_count
          favorite_count
          lang
          quoted_status {
            id
            text
          }
          entities {
            urls {
              url
              display_url
            }

            media {
              url
              display_url
              media_url
              sizes {
                small {
                  w
                  h
                  resize
                }
              }
            }
          }
        }
      }
    }
  `

  const data = await graphQLClient.request(query, { user_id: userId, limit })
  return _.get(data, 'twitter.tweets', [])
}