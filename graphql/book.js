const { gql } = require('apollo-server-koa')
const bookController = require('../controller/book_controller')

// const book_data = [
//   {
//     id:'1',
//     total_pages: 4,
//     share: true,
//     pages1: { title: 'Test BOOK1 TITLE' },
//     bookpage: [{
//       header: 'Apple on the tree',
//       text: 'This is first book first page',
//       img: '',
//       photo:{
//           grayscale: 0.5,
//           sepia: 0,
//           saturate: 1,
//           hueRotate: 0,
//           invert: 0,
//           brightness: 1,
//           contrast: 1,
//           blur: 0,
//           suffix: {
//               hueRotate: 'deg',
//               blur: 'px'
//           }
//       },
//       options: [
//           { title: 'Update Image' },
//           { title: 'Add Post Link', href: 'https://www.jstips.co/zh_tw/javascript/insert-item-inside-an-array/' },
//           { title: 'Add Live Stream Link', href: 'https://www.jstips.co/zh_tw/javascript/insert-item-inside-an-array/' },
//           { title: 'Add Video Link', href: 'https://www.jstips.co/zh_tw/javascript/insert-item-inside-an-array/'}
//       ]
//   }, {
//     header: 'Apple under the tree',
//     text: 'This is second page in first book',
//     img: '',
//     photo:{
//         grayscale: 0.1,
//         sepia: 0,
//         saturate: 1,
//         hueRotate: 0,
//         invert: 0,
//         brightness: 1,
//         contrast: 1,
//         blur: 0,
//         suffix: {
//             hueRotate: 'deg',
//             blur: 'px'
//         }
//     },
//     options: [
//         { title: 'Update Image' },
//         { title: 'Add Post Link', href: 'https://www.jstips.co/zh_tw/javascript/insert-item-inside-an-array/' },
//         { title: 'Add Live Stream Link', href: 'https://www.jstips.co/zh_tw/javascript/insert-item-inside-an-array/' },
//         { title: 'Add Video Link', href: 'https://www.jstips.co/zh_tw/javascript/insert-item-inside-an-array/'}
//     ]
//   }]
// }
// ]

const typeDefs = gql`
  type bookContent{
    header: String
    text: String
    img: String
    photo: photoFilter
    options: [bookOption]
  }

  type photoFilter{
    grayscale: Float
    sepia: Float
    saturate: Float
    hueRotate: Float
    invert: Float
    brightness: Float
    contrast: Float
    blur: Float
    suffix: photoSuffix
  }

  type photoSuffix{
    hueRotate: String
    blur: String
  }

  type bookOption{
    title: String
    href: String
  }

  type Book{
    id: String
    total_page: Int
    share: Boolean
    booktitle: String
    bookpage: [bookContent]
  }

  extend type Query {
    books: [Book]
  }
`

const resolvers = {
  Query: {
    books: bookController.getAllBook
  }
}

module.exports = { typeDefs, resolvers }