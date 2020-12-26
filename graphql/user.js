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
        id: ID!
        username: String!
        gender: String
        birthday: String
    }

    type token{
        access_token: String
        access_token_expirationDate: String
        refresh_token: String
        refresh_token_expirationDate: String
    }

    extend type Query {
        getUsers: [user]
        getMe: user,
        getRefresh: token
    }

    extend type Mutation {
        verify_login(input: loginInput!): String
        login(code: String!): token
        verify_signup(input: signupInput!): String
        signup(code: String!): token
        forget(email: String!): String
        invalidateToken: Boolean!
    }
`

const resolvers = {
    Query: {
        getUsers: userController.getAll,
        getMe: userController.getMe,
        getRefresh: userController.getRefresh
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