module.exports = {
    User: ({ Schema }) => {
        return new Schema(
            {
                id: { type: String },
                email:{ type: String },
                password:{ type: String },
                username:{ type: String },
                count:{ type: Number, default: 0 }
            },
            { collection: 'User' }
        )
    },
    SignUpCode: ({ Schema }) => {
        return new Schema(
            {
                verify_code: { type: String },
                id: { type: String },
                email:{ type: String },
                password:{ type: String },
                username:{ type: String }
            },
            { collection: 'SignUpCode' }
        )
    },
    LogInCode: ({ Schema }) => {
        return new Schema(
            {
                verify_code: { type: String },
                email:{ type: String },
            },
            { collection: 'LogInCode' }
        )
    }
    
}