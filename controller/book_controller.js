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
            let user = await koa.model('Book').findOne({ id: userId })
            let book_exist = user.books.findIndex((element) => element.id === bookId)
            if(book_exist) {
                await koa.model('Book').updateMany({ id: userId }, {
                    $push: {
                        books: {
                            id: bookId,
                            total_page: total_page,
                            share: share,
                            booktitle: booktitle
                        }
                    }
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
            return true
        } catch (error) {
            console.log('This is set book error', error)
        }
    },
    getGuestBook: async(_, { userId, bookId }, { koa }) => {
        try {
            let user = await koa.model('Book').findOne({ id: userId })
            let theBook = user.books.findIndex((element) => element.id === bookId)
            return user.books[theBook]
        } catch (error) {
            console.log('This is guest book error', error)
        }
    }
}