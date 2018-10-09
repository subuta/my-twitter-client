import { makeExecutableSchema } from 'graphql-tools'
import { importSchema } from 'graphql-import'
import path from 'path'

import resolvers from './resolvers'

export default makeExecutableSchema({
  typeDefs: importSchema(path.resolve(__dirname, './app.graphql')),
  resolvers,
})
