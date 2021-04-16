const { findWithAttr } = require('../helpers/helper')

module.exports = {
    getAllBook: async (_, __, { koa }) => {
        try {
            let user = await koa.model('User').findById(koa.uid)
            let user_book = await koa.model('Book').findOne({ id: user.id })
            if(user_book == null) return []
            return user_book.books
        } catch (error) {
            console.log('This is get all book error', error)
        }
    },
    setBook: async(_, { userId, bookId, total_page, share, booktitle, bookinfo }, { koa }) => {
        try {
            let book_exist = await koa.model('Book').findOne({$and: [{ id: userId }, { "books.id": bookId }]})
            if(!book_exist) {
                await koa.model('Book').updateMany({ id: userId }, {
                    $push: { books: {
                        id: bookId,
                        total_page: total_page,
                        share: share,
                        booktitle: booktitle
                    }}
                })
            } else {
                await koa.model('Book').updateMany({ id: userId, "books.id": bookId }, {
                    $set: {
                        'books.$.total_page': total_page,
                        'books.$.share': share,
                        'books.$.booktitle': booktitle,
                        'books.$.bookpage': JSON.parse(bookinfo)
                    }
                })
            }
            let which_user = await koa.model('Book').findOne({ id: userId })
            let which_book = findWithAttr(which_user.books, 'id', bookId)
            return which_user.books[which_book]
        } catch (error) {
            console.log('This is set book error', error)
        }
    }
}