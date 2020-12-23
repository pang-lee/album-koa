const { gql } = require('apollo-server-koa')
const userController = require('../controller/user_controller')

const typeDefs = gql`
    input loginInput{
        email:String!
        password:String!
    }

    input signupInput{
        username: String!
        email: String!
        password: String!
    }

    type user{
        email: String
        password: String
        username: String
    }

    type signup{
        id: ID!
        username: String!
        email: String!
        password: String!
        access_token: String!
        refresh_token: String!
    }

    type login{
        access_token: String!
        refresh_token: String!
    }

    extend type Query {
        getUsers: [user]
        getMe: user
    }

    extend type Mutation {
        verify_login(input: loginInput!): String
        verify_signup(input: signupInput!): String
        login(code: String!): login
        signup(code: String!): signup
        forget(email: String!): String
        invalidateToken: Boolean!
    }
`

const resolvers = {
    Query: {
        getUsers: userController.getAll,
        getMe: userController.getMe
    },
    Mutation: {
        verify_login: userController.verify_login,
        verify_signup: userController.verify_signup,
        login: userController.logIn,
        signup: userController.signUp,
        forget: userController.forget,
        invalidateToken: userController.invalidateToken
    }
}

module.exports = { typeDefs, resolvers }