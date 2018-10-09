import GraphQLJSON from 'graphql-type-json';

import Query from './Query'
import Mutation from './Mutation'

export default {
  ...Query,
  ...Mutation,

  SearchResponseType: {
    MIXED: () => 'mixed',
    RECENT: () => 'recent',
    POPULAR: () => 'popular'
  },

  JSON: GraphQLJSON
}