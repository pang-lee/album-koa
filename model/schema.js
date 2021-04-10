module.exports = {
    User: ({ Schema }) => {
        return new Schema(
            {
                id: { type: String },
                email: { type: String },
                password: { type: String },
                username: { type: String },
                count: { type: Number, default: 0 },
                gender: { type: String, default: '' },
                birthday: { type: String, default: new Date().toISOString().substr(0, 10) },
                avatar: { type: String, default: '' }
                // background: { type: String, default: '' }
            },
            { collection: 'User' }
        )
    },
    Book: ({ Schema }) => {
        return new Schema(
            {
                books: { type: Array, default: [] },
                id: { type: String }
            },
            { collection: 'Book' }
        )
    },
    SignUpCode: ({ Schema }) => {
        return new Schema(
            {
                verify_code: { type: String },
                id: { type: String },
                email: { type: String },
                password: { type: String },
                username: { type: String }
            },
            { collection: 'SignUpCode' }
        )
    },
    LogInCode: ({ Schema }) => {
        return new Schema(
            {
                verify_code: { type: String },
                email: { type: String },
            },
            { collection: 'LogInCode' }
        )
    }
}