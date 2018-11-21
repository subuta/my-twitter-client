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

export const entitiesFields = gql`
  fragment entitiesFields on Entities {
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
          player {
            href
            type
            rel
          }

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

      video_info {
        aspect_ratio
        duration_millis
        variants {
          bitrate
          content_type
          url
        }
      }

      additional_media_info {
        title
        description
        embeddable
        monetizable
      }
    }
  }
`

export const tweetFields = gql`
  ${entitiesFields}
  
  fragment tweetFields on Tweet {
    id_str
    
    user {
      screen_name
    }
    
    full_text
    text
    
    created_at

    retweeted
    retweet_count

    favorited
    favorite_count

    reply_count

    lang
    
    entities {
      ...entitiesFields
    }

    extended_entities {
      ...entitiesFields
    }
  }
`

export default new GraphQLClient(ENDPOINT, {
  headers: {
  },
})
