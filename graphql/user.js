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

    input userNameInput {
        name: String
        nickname: String
    }

    type user{
        id: ID!
        username: String!
        nickname: String
        gender: String
        birthday: String
        privacy: String
    }

    type token{
        access_token: String
        access_token_expirationDate: String
        refresh_token: String
        refresh_token_expirationDate: String
    }

    type social_login{
        access_token: String
        id: ID!
        avatar: String
        username: String!
        gender: String
        birthday: String
        privacy: String
    }

    extend type Query {
        getUsers: [user]
        getMe: user,
        getRefresh: token,
        getprivate: String
    }

    extend type Mutation {
        verify_login(input: loginInput!): String
        login(code: String!): token
        verify_signup(input: signupInput!): String
        signup(code: String!): token
        forget(email: String!): String
        invalidateToken: Boolean!
        set_username(input: userNameInput!): String
        set_gender(gender: String!): String
        set_date(date: String!): String
        set_password(password: String!): String
        set_privacy(privacy_value: String!): Boolean
        google_login(googleUser: String!): social_login
        facebook_login(facebookUser: String!): social_login
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
        invalidateToken: userController.invalidateToken,
        set_username: userController.set_username,
        set_gender: userController.set_gender,
        set_date: userController.set_date,
        set_password: userController.set_password,
        set_privacy: userController.set_privacy,
        google_login: userController.google_login,
        facebook_login: userController.facebook_login
    }
}

module.exports = { typeDefs, resolvers }