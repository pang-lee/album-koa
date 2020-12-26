module.exports = {
    User: ({ Schema }) => {
        return new Schema(
            {
                id: { type: String },
                email: { type: String },
                password: { type: String },
                username: { type: String },
                count: { type: Number, default: 0 },
                avatar: { type: Buffer, default: null },
                background: { type: String, default: '' },
                gender: { type: String, default: '' },
                birthday: { type: String, default: new Date().toISOString().substr(0, 10) }
            },
            { collection: 'User' }
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