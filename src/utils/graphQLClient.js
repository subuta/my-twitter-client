import { GraphQLClient } from 'graphql-request'
import gql from 'graphql-tag'

const ENDPOINT = 'http://localhost:3000/graphql'

export const userFields = gql`
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
`

export const tweetFields = gql`
  fragment tweetFields on Tweet {
    id_str
    user {
      screen_name
    }
    full_text
    text
    created_at
    retweet_count
    favorite_count
    lang
    entities {
      urls {
        url
        display_url
        indices
        expanded_url

        og {
          meta {
            description
            title
            author_url
            date
            media
            canonical
            site
          }

          links {
            thumbnail {
              href
              type
              rel
            }

            icon {
              href
              type
              rel
            }
          }
        }
      }

      media {
        id_str
        type
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
`

export default new GraphQLClient(ENDPOINT, {
  headers: {
  },
})
