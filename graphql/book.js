const { gql } = require('apollo-server-koa')
const scalar_type = require('../helpers/scalar_type')
const bookController = require('../controller/book_controller')

const typeDefs = gql`
  scalar bookOption
  scalar photoFilter

  # input bookInfoInput{
  #   header: String
  #   text: String
  #   img: String
  #   photo: photoFilter
  #   options: [bookOption]
  # }

  type bookContent{
    header: String
    text: String
    img: String
    photo: photoFilter
    options: [bookOption]
  }

  type Book{
    id: ID
    total_page: Int
    share: Boolean
    booktitle: String
    bookpage: [bookContent]
  }

  extend type Query {
    books: [Book],
    guestBook(userId: String!, bookId: String!): Book
  }

  extend type Mutation{
    set_book(userId: ID!, bookId: ID!, total_page: Int!, share: Boolean!, booktitle: String!, bookinfo: String): Boolean
  }
`

const resolvers = {
  photoFilter: scalar_type.photoFilter,
  bookOption: scalar_type.bookOption,
  Query: {
    books: bookController.getAllBook,
    guestBook: bookController.getGuestBook,
  },
  Mutation: {
    set_book: bookController.setBook
  }
}

module.exports = { typeDefs, resolvers }