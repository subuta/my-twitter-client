import { GraphQLClient } from 'graphql-request'

const ENDPOINT = 'http://localhost:3000/graphql'

export default new GraphQLClient(ENDPOINT, {
  headers: {
  },
})