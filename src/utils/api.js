import _ from 'lodash'
import gql from 'graphql-tag'
import graphQLClient from './graphQLClient'
// import minDelay from 'p-min-delay'

// Fetch list of tweets
export const getTweetsWithProfile = async (userId, limit = null) => {
  // Get sorted todoes by dueDate ASC.
  const query = gql`
    fragment userFields on TwitterUser {
      created_at
      description
      id
      screen_name
      name
      profile_image_url
      profile_banner_url
      profile_background_color
      url
      friends_count
      followers_count
    }
    
    fragment tweetFields on Tweet {
      id_str
      user {
        screen_name
      }
      text
      retweet_count
      favorite_count
      lang
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

            large {
              w
              h
              resize
            }
          }
        }
      }
    }
    
    query getTweetsWithProfile($user_id: ID!, $limit: Int) {
      twitter {
        user (identifier: ID, identity: $user_id) {
          ...userFields
        }
        
        tweets(user_id: $user_id, limit: $limit) {
          ...tweetFields
          quoted_status {
            ...tweetFields
          }
        }
      }
    }
  `

  const data = await graphQLClient.request(query, { user_id: userId, limit })
  return _.get(data, 'twitter', [])
}
