import t from 'src/server/utils/twitter'
import iframely from 'src/server/utils/iframely'

export default {
  Query: {
    // SEE: https://stackoverflow.com/questions/40901845/how-to-create-a-nested-resolver-in-apollo-graphql-server
    twitter: () => ({}),
    iframely: () => ({})
  },

  TwitterUser: {
    tweets ({ id: userId }, { limit = 30 }, context, info) {
      return t.getTweets(userId, limit)
    },
  },

  Tweet: {
    retweets ({ id_str: tweetId }, { limit = 5 }, context, info) {
      return t.getRetweets(tweetId, limit)
    }
  },

  Url: {
    og ({ expanded_url: url }, {}, context, info) {
      return iframely(url)
    }
  },

  IFramelyAPI: {
    og (obj, { url }, {}, context, info) {
      return iframely(url)
    }
  },

  TwitterAPI: {
    user (obj, { identifier, identity }, context, info) {
      // SEE: https://github.com/apollographql/apollo-server/issues/1721
      // SEE: https://www.apollographql.com/docs/apollo-server/features/scalars-enums.html#internal-values
      // Migrate to enum internal_values once it fixed(or after updating apollo-server lib).
      if (identifier === 'ID') {
        identifier = 'user_id'
      } else if (identifier === 'NAME') {
        identifier = 'screen_name'
      }

      return t.getUser(identifier, identity)
    },

    tweets (obj, { user_id, limit = 30, max_id = null }, context, info) {
      return t.getTweets(user_id, limit, max_id)
    },

    followers (obj, { user_id, count = 30, cursor = -1 }, context, info) {
      return t.getFollowers(user_id, count, cursor)
    },

    friends (obj, { user_id, count = 30, cursor = -1 }, context, info) {
      return t.getFriends(user_id, count, cursor)
    },

    tweet (obj, { id }, context, info) {
      return t.getTweet(id)
    },

    search (obj, args, context, info) {
      // SEE: https://github.com/apollographql/apollo-server/issues/1721
      // SEE: https://www.apollographql.com/docs/apollo-server/features/scalars-enums.html#internal-values
      // Migrate to enum internal_values once it fixed(or after updating apollo-server lib).
      if (args.result_type === 'MIXED') {
        args.result_type = 'mixed'
      } else if (args.result_type === 'RECENT') {
        args.result_type = 'recent'
      } else if (args.result_type === 'POPULAR') {
        args.result_type = 'popular'
      }
      return t.searchFor(args)
    }
  }
}
