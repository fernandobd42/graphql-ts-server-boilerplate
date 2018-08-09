import 'reflect-metadata'
import { importSchema } from 'graphql-import'
import { GraphQLServer } from 'graphql-yoga'
import * as path from 'path'

import { CreateTypeOrmConnection } from './utils/CreateTypeOrmConnection'

import { resolvers } from './resolvers'

export const startServer = async () => {
  const typeDefs = importSchema(path.join(__dirname, './schema.graphql'))

  const server = new GraphQLServer({ typeDefs, resolvers })
  await CreateTypeOrmConnection()
  await server.start()
  console.log('Server is running on localhost:4000')
}

startServer()
