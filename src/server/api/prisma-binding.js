const { Prisma } = require('prisma-binding')
const { typeDefs } = require('./schema/generated/prisma-client/prisma-schema')

export default new Prisma({
  typeDefs,
  endpoint: 'http://localhost:4466',
})