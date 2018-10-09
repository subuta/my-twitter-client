import GraphQLJSON from 'graphql-type-json';

import Query from './Query'
import Mutation from './Mutation'

export default {
  ...Query,
  ...Mutation,
  JSON: GraphQLJSON
}