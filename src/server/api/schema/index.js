import {
  makeExecutableSchema,
  mergeSchemas
} from 'graphql-tools'
import { importSchema } from 'graphql-import'
import { GraphQLHub } from 'graphqlhub-schemas'
import { GraphQLSchema } from 'graphql'
import path from 'path'

import resolvers from './resolvers'

const schema = makeExecutableSchema({
  typeDefs: importSchema(path.resolve(__dirname, './app.graphql')),
  resolvers,
})

// Schemas from GraphQLHub
// SEE: https://github.com/clayallsopp/graphqlhub/tree/master/graphqlhub-schemas
const graphQLHubSchema = new GraphQLSchema({
  query: GraphQLHub.QueryObjectType,
  mutation: GraphQLHub.MutationsType
})

export default mergeSchemas({
  schemas: [
    schema,
    graphQLHubSchema
  ]
})
