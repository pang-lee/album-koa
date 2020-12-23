const { ForbiddenError } = require('apollo-server-koa')
const helpers = require('../helpers/helper')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    getAll: async (_, args, { koa }) => await koa.model('User').find(),
    getMe: async (_, args, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired. Sign in again.')
            return koa.model('User').findById(koa.uid)
        } catch (error) {
            console.log("This is getMe error", error)
        }
    },
    invalidateToken: async (_, __, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired. Sign in again.')
            
            const user = await koa.model('User').findById(koa.uid)

            if(!user) return new ForbiddenError('User Not Found!')
            let plus = user.count + 1
            await koa.model('User').findByIdAndUpdate(koa.uid, { count: plus }, { useFindAndModify: false })
            return true
        } catch (error) {
            console.log("invalidateToken error", error)
        }
    },
    verify_signup: async(_, { input }, { koa, mailer }) => {
        try {
            let user = await koa.model('User').find({ email: input.email })
            if(user.length !== 0) return new ForbiddenError('Email Duplicate')
            let random_code = helpers.generate()
            await mailer.sendMail({
                from: 'leepang8834@gmail.com.tw',
                to: input.email,
                subject: 'Verify Your Identity',
                html: `
                    <p>Hello! ${ input.username }</p>
                    <p>Welcome You Join !!</p>
                    <p>Your Verification Code Is：<strong style="color: #ff4e2a;">${random_code}</strong></p>
                    <p>*** IT ONLY WORK WITHIN 2 MINUTES !! ***</p>
                    <p>Thans For Your Registration</p>
                `
            }, (error, info) => {
                if (error) {
                    console.log("This is verify_signup mailer error", error)
                    mailer.close()
                } else {
                    console.log('Email sent: ' + info.response)
                }
            })
            let encrypt = await bcrypt.hash(input.password, Number(process.env.SALT_ROUNDS))
            await koa.model('SignUpCode').create({ verify_code: random_code, id: uuidv4(), email: input.email, password: encrypt, username: input.username })
            setTimeout(() => {
                koa.model('SignUpCode').deleteOne({ verify_code: random_code })
            }, 1000*60*2 )
            return random_code
        } catch (error) {
            console.log("This is verify_signup mailer error", error)
        }
    },
    signUp: async (_, { code }, { koa }) => {
        try {
            let find_code = await koa.model('SignUpCode').find({ verify_code: code })
            if(find_code.length == 0) return new ForbiddenError('Code Not Found Or Typo')
            await koa.model('SignUpCode').deleteOne({ verify_code: find_code[0].verify_code, id: find_code[0].id, email: find_code[0].email, password: find_code[0].password, username: find_code[0].username })
            let create = await koa.model('User').create({ id: find_code[0].id, email: find_code[0].email, password: find_code[0].password, username: find_code[0].username})
            let access_token = { access_token: jwt.sign({ uid: find_code[0]._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' }) }
            let refresh_token = { refresh_token: jwt.sign({ uid: find_code[0]._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }) }
            return Object.assign(create, access_token, refresh_token)
        } catch(error) {
            console.log("This is signUp error", error)
        }
    },
    verify_login: async (_, { input }, { koa, mailer }) => {
        try {
            let user = await koa.model('User').find({ email: input.email })
            if(user.length == 0) return new ForbiddenError('Email Not Found')
            let passwordCompare = await bcrypt.compare(input.password, user[0].password)
            if(!passwordCompare) return new ForbiddenError('Password Not Same')
            let random_code = helpers.generate()
            await mailer.sendMail({
                from: 'leepang8834@gmail.com.tw',
                to: input.email,
                subject: 'Verify Your Identity',
                html: `
                    <p>Hello! ${ user[0].username }</p>
                    <p>Welcome Back !!</p>
                    <p>Your Verification Code Is：<strong style="color: #ff4e2a;">${ random_code }</strong></p>
                    <p>*** IT ONLY WORK WITHIN 2 MINUTES !! ***</p>
                `
            }, (error, info) => {
                if (error) {
                    console.log("This is verify_login mailer error", error)
                    mailer.close()
                } else {
                    console.log('Email sent: ' + info.response)
                }
            })
            await koa.model('LogInCode').create({ verify_code: random_code, email: input.email })
            setTimeout(async ()=>{
                await koa.model('LogInCode').deleteOne({ verify_code: random_code })
            }, 1000*60*2 )
            return random_code
        } catch(error) {
            console.log("This is verify_login error", error)
        }
    },
    logIn: async (_,  { code }, { koa }) => {
        try {
            let find_code = await koa.model('LogInCode').find({ verify_code: code })
            if(find_code.length == 0) return new ForbiddenError('Code Not Found Or Typo')
            await koa.model('LogInCode').deleteOne({ verify_code: find_code[0].verify_code, email: find_code[0].email })
            let user = await koa.model('User').find({ email: find_code[0].email })

            // let access_token = { access_token: jwt.sign({ uid: user[0]._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' }) }
            // let refresh_token = { refresh_token: jwt.sign({ uid: user[0]._id, count: user[0].count }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }) }

            const { accessToken, refreshToken } = helpers.generate_token(user[0])
            koa.cookies.set('a', accessToken)
            koa.cookies.set('b', refreshToken)
            
            return { access_token: accessToken, refresh_token: refreshToken }
            // return Object.assign(user[0], access_token, refresh_token)
        } catch(error) {
            console.log("This is login error", error)
        }
    },
    forget: async(_, { email }, { koa, mailer }) => {
        try {
            let user = await koa.model('User').find({ email: email })
            if(user.length == 0) return new ForbiddenError('Email Not Found')
            let password = helpers.forget()
            mailer.sendMail({
                from: 'leepang8834@gmail.com.tw',
                to: user[0].email,
                subject: 'Forget Your Password?',
                html: `
                    <p>Hello! ${ user[0].username }</p>
                    <p>Your Reset Password Code Is：<strong style="color: #ff4e2a;">${ password }</strong></p>
                    <p>*** PLEASE REMEMBER TO CHANGE YOUR PASSWORD AFTER YOU LOGIN !! ***</p>
                `
            }, (error, info) => {
                if (error) {
                    console.log("This is forget mailer error", error)
                    transporter.close()
                } else {     
                    console.log('Email sent: ' + info.response)
                }
            })
            let encrypt = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
            await koa.model('User').findByIdAndUpdate(user[0]._id, { password: encrypt }, { useFindAndModify: false })
            return encrypt
        } catch (error) {
            console.log("This is forget error", error)
        }
    }
}