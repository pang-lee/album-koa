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
    }
}