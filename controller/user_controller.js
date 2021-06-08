const { ForbiddenError } = require('apollo-server-koa')
const helpers = require('../helpers/helper')
const { v4: uuidv4 } = require('uuid')
const { decode } = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    getAll: async (_, __, { koa }) => await koa.model('User').find(),
    getRefresh: async(_, __, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired in getRefresh. Sign in again.')
            const { accessToken } = helpers.generate_token(koa.uid)
            console.log('generate token success')
            return { access_token: accessToken, access_token_expirationDate: new Date().getTime() + 1000 * 60 * 60 }
        } catch (error) {
            console.log('This is get refresh error', error)
        }
    },
    getMe: async (_, __, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired in GetMe. Sign in again.')
            return await koa.model('User').findById(koa.uid)
        } catch (error) {
            console.log('This is getMe error', error)
        }
    },
    invalidateToken: async (_, __, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired in invalid. Sign in again.')
            
            const user = await koa.model('User').findById(koa.uid)

            if(!user) return new ForbiddenError('User Not Found!')
            await koa.model('User').findByIdAndUpdate(koa.uid, { count: user.count + 1 }, { useFindAndModify: false })
            return true
        } catch (error) {
            console.log('invalidateToken error', error)
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
                subject: '作品集要驗證您身分',
                html: `
                    <p>您好! ${ input.username }</p>
                    <p>歡迎您加入作品集 !!</p>
                    <p>您的驗證碼是 ：<strong style="color: #ff4e2a;">${random_code}</strong></p>
                    <p>*** 有效期間24小時 !! ***</p>
                    <p>謝謝您註冊作品集，祝您有愉快的使用體驗</p>
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
            }, 1000 * 60 * 60 * 24 )
            return random_code
        } catch (error) {
            console.log('This is verify_signup mailer error', error)
        }
    },
    signUp: async (_, { code }, { koa }) => {
        try {
            let find_code = await koa.model('SignUpCode').find({ verify_code: code })
            if(find_code.length == 0) return new ForbiddenError('Code Not Found Or Typo')
            await koa.model('SignUpCode').deleteOne({ verify_code: find_code[0].verify_code, id: find_code[0].id, email: find_code[0].email, password: find_code[0].password, username: find_code[0].username })
            let create = await koa.model('User').create({ id: find_code[0].id, email: find_code[0].email, password: find_code[0].password, username: find_code[0].username, count:0, regsiterwith: 'email' })
            await koa.model('Book').create({ id: find_code[0].id, books: [] })
            const { accessToken, refreshToken } = helpers.generate_token(create)
            return { access_token: accessToken, access_token_expirationDate: new Date().getTime() + 1000 * 60 * 60, refresh_token: refreshToken, refresh_token_expirationDate: new Date().getTime() + 1000 * 60 * 60 * 24 * 14}
        } catch(error) {
            console.log('This is signUp error', error)
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
                subject: '作品集要驗證您身分',
                html: `
                    <p>您好! ${ user[0].username }</p>
                    <p>歡迎您回來 !!</p>
                    <p>您著驗證碼是 ：<strong style="color: #ff4e2a;">${ random_code }</strong></p>
                    <p>*** 有效期間24小時 !! ***</p>
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
            },  1000 * 60 * 60 * 24 )
            return random_code
        } catch(error) {
            console.log('This is verify_login error', error)
        }
    },
    logIn: async (_,  { code }, { koa }) => {
        try {
            let find_code = await koa.model('LogInCode').find({ verify_code: code })
            if(find_code.length == 0) return new ForbiddenError('Code Not Found Or Typo')
            await koa.model('LogInCode').deleteOne({ verify_code: find_code[0].verify_code, email: find_code[0].email })
            let user = await koa.model('User').find({ email: find_code[0].email })
            const { accessToken, refreshToken } = helpers.generate_token(user[0])
            return { access_token: accessToken, access_token_expirationDate: new Date().getTime() + 1000 * 60 * 60, refresh_token: refreshToken, refresh_token_expirationDate: new Date().getTime() + 1000 * 60 * 60 * 24 * 14}
        } catch(error) {
            console.log('This is login error', error)
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
                subject: '忘記您作品集的密碼了嗎 ?',
                html: `
                    <p>您好! ${ user[0].username }</p>
                    <p>已為你重設一組密碼：<strong style="color: #ff4e2a;">${ password }</strong></p>
                    <p>*** 請記得登入之後更換密碼 !! ***</p>
                `
            }, (error, info) => {
                if (error) {
                    console.log('This is forget mailer error', error)
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
    },
    set_username: async(_, { name }, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired in set user. Sign in again.')
            await koa.model('User').findByIdAndUpdate(koa.uid, { username: name })
            return 'Your Username Have Been Changed!'
        } catch (error) {
            return console.log('This is set username error', error)
        }
    },
    set_gender: async(_, { gender }, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired in set gender. Sign in again.')
            await koa.model('User').findByIdAndUpdate(koa.uid, { gender: gender })
            return 'Your Gender Have Benn Changed!'
        } catch (error) {
            return console.log('This is set gender error', error)
        }
    },
    set_date: async(_, { date }, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired in set date. Sign in again.')
            await koa.model('User').findByIdAndUpdate(koa.uid, { birthday: date })
            return 'Your Birthday Have Benn Changed!'
        } catch (error) {
            return console.log('This is set date error', error)
        }
    },
    set_password: async(_, { password }, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your session expired in set password. Sign in again.')
            let encrypt = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))
            await koa.model('User').findByIdAndUpdate(koa.uid, { password: encrypt })
            return 'Your Password Have Been Changed!'
        } catch (error) {
            return console.log('This is set password error', error)
        }
    },
    set_privacy: async(_, { privacy_value }, { koa }) => {
        try {
            if(!koa.uid) return new ForbiddenError('Your Session expired in set privacy. Sign in again.')
            let theSharePrivacy = JSON.parse(privacy_value)
            await koa.model('User').updateOne({ privacy: theSharePrivacy.privacy })
            let user = await koa.model('Book').findOne({ id: theSharePrivacy.userId })
            switch (theSharePrivacy.book_share) {
                case false:
                    user.books.forEach(async (element) => await koa.model('Book').updateOne({ "books": { $elemMatch:{ _id: element._id }}}, { $set: { "books.$.share": theSharePrivacy.book_share }}))
                    break
                case true:
                    user.books.forEach(async (element) => await koa.model('Book').updateOne({ "books": { $elemMatch:{ _id: element._id }}}, { $set: { "books.$.share": theSharePrivacy.book_share }}))
                    break
                default:
                    user.books.forEach(async (element, index) => await koa.model('Book').updateOne({ "books": { $elemMatch:{ _id: element._id }}}, { $set: { "books.$.share": theSharePrivacy.book_share[index] }}))
                    break
            }
            return true
        } catch (error) {
            console.log('This is set privacy error', error)
        }
    },
    google_login: async(_, { googleUser }, { koa }) => {
        try {
            if(new Date().getTime() > Number.parseInt(koa.provider_token_expired)) return new ForbiddenError('Your session expired in google login. Sign in again.')
            let user_from_google = decode(googleUser)
            let user = await koa.model('User').find({ email: user_from_google.email })
            if(user.length == 0){
                let userId = uuidv4()
                let create = await koa.model('User').create({ id: userId, email: user_from_google.email, username: user_from_google.family_name + ' ' + user_from_google.given_name, avatar: user_from_google.picture, regsiterwith: user_from_google.iss })
                await koa.model('Book').create({ id: userId, books: [] })
                const { accessToken } = helpers.generate_token(create)
                return { access_token: accessToken, id: create.id, avatar: create.avatar, username: create.username, gender: create.gender, birthday: create.birthday, privacy: create.privacy }
            }
            const { accessToken } = helpers.generate_token(user[0])
            return { access_token: accessToken, id: user[0].id, avatar: user[0].avatar, username: user[0].username, gender: user[0].gender, birthday: user[0].birthday, privacy: user[0].privacy }
        } catch (error) {
            console.log('This is google login error', error)
        }
    },
    facebook_login: async(_, { facebookUser }, { koa }) => {
        try {
            if(new Date().getTime() > Number.parseInt(koa.provider_token_expired)) return new ForbiddenError('Your session expired in facebook login. Sign in again.')
            let user_from_fb = JSON.parse(facebookUser)
            let user = await koa.model('User').find({ email: user_from_fb.email })
            if(user.length == 0){
                let userId = uuidv4()
                let create = await koa.model('User').create({ id: userId, email: user_from_fb.email, username: user_from_fb.first_name + ' ' + user_from_fb.last_name, avatar: user_from_fb.picture.data.url, regsiterwith: 'facebook' })
                await koa.model('Book').create({ id: userId, books: [] })
                const { accessToken } = helpers.generate_token(create)
                return { access_token: accessToken, id: create.id, avatar: create.avatar, username: create.username, gender: create.gender, birthday: create.birthday, privacy: create.privacy }
            }
            const { accessToken } = helpers.generate_token(user[0])
            return { access_token: accessToken, id: user[0].id, avatar: user[0].avatar, username: user[0].username, gender: user[0].gender, birthday: user[0].birthday, privacy: user[0].privacy }
        } catch (error) {
            console.log('This is facebook login error', error)
        }
    }
}