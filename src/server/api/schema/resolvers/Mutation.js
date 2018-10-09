import t from 'src/server/utils/twitter'

export default {
  Mutation: {
    twitter: () => ({})
  },

  TwitterMutationAPI: {
    postTweet (obj, { status }, context, info) {
      return t.postTweet(status)
    }
  }
}