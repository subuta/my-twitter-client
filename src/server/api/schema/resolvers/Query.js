import twit from 'src/server/utils/twit'

export default {
  Query: {
    // SEE: https://stackoverflow.com/questions/40901845/how-to-create-a-nested-resolver-in-apollo-graphql-server
    twitter: () => ({})
  },

  TwitterUser: {
    tweets ({ id: userId }, { limit = 30 }, context, info) {
      return twit.getTweets(userId, limit)
    },
  },

  Tweet: {
    retweets ({ id_str: tweetId }, { limit = 5 }, context, info) {
      return twit.getRetweets(tweetId, limit)
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

      return twit.getUser(identifier, identity)
    },

    tweets (obj, { user_id, max_id, limit = 30 }, context, info) {
      return twit.getTweets(user_id, limit, max_id)
    },

    tweet (obj, { id }, context, info) {
      return twit.getTweet(id)
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
      return twit.searchFor(args)
    }
  }
}