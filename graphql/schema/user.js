// const { gql } = require('apollo-server-koa')
// const UserController = require('../../controller/user_controller')

// const typeDefs = gql`
//   input loginInput{
//     email:String!
//     password:String!
//   }
  
//   input signupInput{
//     username: String!
//     email: String!
//     password: String!
//   }
  
//   type user{
//     email: String
//     password: String
//     username: String
//   }
  
//   type signup{
//     id: ID!
//     username: String!
//     email: String!
//     password: String!
//     token: String!
//   }
  
//   type login{
//     id: ID!
//     token: String!
//   }
  
//   extend type Query {
//     getUser: user
//     getUsers: [user]
//   }
  
//   extend type Mutation {
//     verify_login(input: loginInput!): String
//     verify_signup(input: signupInput!): String
//     login(code: String!): login
//     signup(code: String!): signup
//     forget(email: String!): String
//   }
// `

// const resolvers = {
//   Query: {
//     getUsers: UserController.getAll,
//     getUser: UserController.getMe
//   },
//   Mutation: {
//     verify_login: UserController.verify_login,
//     verify_signup: UserController.verify_signup,
//     login: UserController.logIn,
//     signup: UserController.signUp,
//     forget: UserController.forget,
//   }
// }

// module.exports = { typeDefs, resolvers }