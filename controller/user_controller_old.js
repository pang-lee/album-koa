// const { ForbiddenError } = require('apollo-server-koa')
// const UserModel = require('../model/user_model')
// const helpers = require('../helpers/helper')
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')

// const UserController = {
//     getAll: async (_, args) => await UserModel.find({}),
//     getMe: helpers.isAuthenticated(async(_, args, { me }) => {
//         return await UserModel.findById(me.uid._id)
//     }),
//     verify_signup: async(_, { input }) => {
//         try {
//             let user = await UserModel.find({ email: input.email })
//             if(user.length !== 0) return new ForbiddenError('Email Duplicate')
//             return await helpers.mail(input, 'signup')
//         } catch (error) {
//             console.log(error)
//         }
//     },
//     signUp: async (_, { code }) => {
//         try {
//             let verify_info = await helpers.verify(code, 'signup')
//             if(verify_info !== 'Code Not Found Or Typo'){
//                 let create = await UserModel.create({ id: verify_info.id, email: verify_info.email, password: verify_info.password, username: verify_info.username})
//                 let sign = { token: jwt.sign({ uid: `${verify_info.email}` }, process.env.SECRET, { expiresIn: '1d' }) }
//                 return Object.assign(create, sign)
//             } else return new ForbiddenError(verify_info)
//         } catch(e) {
//             console.log(e.message)
//         }
//     },
//     verify_login: async (_, { input }) => {
//         try {
//             let user = await UserModel.find({ email: input.email })
//             if(user.length == 0) return new ForbiddenError('Email Not Found')
//             let passwordCompare = await bcrypt.compare(input.password, user[0].password)
//             if(!passwordCompare) return new ForbiddenError('Password Not Same')
//             return await helpers.mail(user[0], 'login')
//         } catch(e) {
//             console.log(e.message)
//         }
//     },
//     logIn: async (_,  { code }) => {
//         try {
//             let verify_info = await helpers.verify(code, 'login')
//             if(verify_info !== 'Code Not Found Or Typo'){
//                 let user = await UserModel.find({ email: verify_info.email })
//                 let sign = { token: jwt.sign({ uid: user[0] }, process.env.SECRET, { expiresIn: '1d' }) }
//                 return Object.assign(user[0], sign)
//             } else return new ForbiddenError(verify_info)
//         } catch(e) {
//             console.log(e.message)
//         }
//     },
//     forget: async(_, { email }) => {
//         try {
//             let user = await UserModel.find({ email: email })
//             if(user.length == 0) return new ForbiddenError('Email Not Found')
//             let reset = await helpers.mail(user[0], 'forget')
//             let encrypt = await bcrypt.hash(reset, Number(process.env.SALT_ROUNDS))
//             await UserModel.findByIdAndUpdate(user[0]._id, { password: encrypt }, { useFindAndModify: false })
//             return encrypt
//         } catch (error) {
//             console.log(error)
//         }
//     }
// }

// module.exports = UserController