import Router from 'koa-router'

// Migrate to v2 when they expose koa middleware as same as v1 ;)
// import { ApolloServer } from 'apollo-server-koa'
import { graphqlKoa } from 'apollo-server-koa'

import prismaBinding from './prisma-binding'
import { prisma } from './schema/generated/prisma-client'
import schema from './schema'

const router = new Router({
  prefix: '/graphql'
})

const graphQLServerOptions = {
  schema,
  context: {
    binding: prismaBinding,
    db: prisma
  }
}

router.post('/', graphqlKoa(graphQLServerOptions))
router.get('/', graphqlKoa(graphQLServerOptions))

export default router