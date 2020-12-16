const { ApolloServer } = require('apollo-server-koa')
const { typeDefs, resolvers } = require('./schema/index')

module.exports = new ApolloServer({ typeDefs, resolvers })