import twit from 'src/server/utils/twit'

export default {
  Mutation: {
    twitter: () => ({})
  },

  TwitterMutationAPI: {
    postTweet (obj, args, context, info) {
      return twit.tweet(args.status)
    }
  }
}