// Migrate to v2 when they expose koa middleware as same as v1 ;)
// import { ApolloServer } from 'apollo-server-koa'
import { GraphQLHub } from 'graphqlhub-schemas';
import { GraphQLSchema } from 'graphql';
import { graphqlKoa } from 'apollo-server-koa'
import Koa from 'koa'
import cors from '@koa/cors'
import koaBody from 'koa-body'

import Router from 'koa-router'

const app = new Koa()
const port = 3000

// parse body
app.use(koaBody())

// Add cors
app.use(cors())

const router = new Router({
  prefix: '/graphql'
})

let schema = new GraphQLSchema({
  query    : GraphQLHub.QueryObjectType,
  mutation : GraphQLHub.MutationsType
});

const graphQLServerOptions = {
  schema
}

router.post('/', graphqlKoa(graphQLServerOptions))
router.get('/', graphqlKoa(graphQLServerOptions))

app.use(router.routes())
app.use(router.allowedMethods())

// Serve the files on port.
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
