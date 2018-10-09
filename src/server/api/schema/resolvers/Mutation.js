import twit from 'src/server/utils/twit'

export default {
  tweet (obj, args, context, info) {
    return twit.tweet(args.status)
  }
}