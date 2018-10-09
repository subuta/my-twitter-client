import {
  makeExecutableSchema
} from 'graphql-tools'
import { importSchema } from 'graphql-import'
import path from 'path'

import resolvers from './resolvers'

const schema = makeExecutableSchema({
  typeDefs: importSchema(path.resolve(__dirname, './app.graphql')),
  resolvers,
})

export default schema
