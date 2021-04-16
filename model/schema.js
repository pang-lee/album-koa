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
                books: [
                    {
                        id: { type: String, require: true },
                        total_page: { type: Number, require: true },
                        share: { type: Boolean, require: true },
                        booktitle: { type: String, require: true },
                        bookpage: [
                            {
                                header: { type: String, require: true },
                                text: { type: String, require: true },
                                img: { type: String, require: true },
                                photo: { type: Object, require: true },
                                options: { type: Array, require: true }
                            }
                        ]
                    }
                ],
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