import Query from './Query'
import Mutation from './Mutation'

export default {
  Query,
  Mutation,
  // SEE: https://github.com/apollographql/apollo-server/issues/1075
  Node: {
    __resolveType() {
      return null;
    }
  }
}