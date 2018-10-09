import GraphQLJSON from 'graphql-type-json';

import Query from './Query'
import Mutation from './Mutation'

export default {
  Query,
  Mutation,
  JSON: GraphQLJSON
  // SEE: https://github.com/apollographql/apollo-server/issues/1075
  // Node: {
  //   __resolveType() {
  //     return null;
  //   }
  // }
}