import Router from 'koa-router'

// Migrate to v2 when they expose koa middleware as same as v1 ;)
// import { ApolloServer } from 'apollo-server-koa'
import { graphqlKoa } from 'apollo-server-koa'

import schema from './schema'

const router = new Router({
  prefix: '/api/graphql'
})

const graphQLServerOptions = {
  schema
}

router.post('/', graphqlKoa(graphQLServerOptions))
router.get('/', graphqlKoa(graphQLServerOptions))

export default router
