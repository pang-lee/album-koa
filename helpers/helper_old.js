// const { ForbiddenError } = require('apollo-server-koa')
// const nodemailer = require('nodemailer')
// const smtpTransport = require('nodemailer-smtp-transport')
// const { v4: uuidv4 } = require('uuid')
// const bcrypt = require('bcrypt')
// const LogInCodeModel = require('../model/logincode_model')
// const SignUpCodeModel = require('../model/signupcode_model')

// module.exports = {
//     isAuthenticated: resolverFunction => (parent, args, context) => {
//         if (!context.me) return new ForbiddenError('Not logged in.')
//         return resolverFunction.apply(null, [parent, args, context])
//     },
//     mail: async (user, status) => {
//         const transporter = nodemailer.createTransport(smtpTransport({
//             service: 'gmail',
//             host: 'smtp.gmail.com',
//             auth: {
//                  user: process.env.USERMAIL,
//                  pass: process.env.USERPASS
//             }
//         }))

//         const generate_code = async () => {
//             try {
//                 let random_code = ''
//                 for(let i= 0;i<6;i++){
//                     random_code += parseInt(Math.random()*10)
//                 }

//                  if(status == 'signup'){
//                     let encrypt = await bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS))
//                     await SignUpCodeModel.create({ verify_code: random_code, id: uuidv4(), email: user.email, password: encrypt, username: user.username })
//                     setTimeout(async ()=>{
//                         await SignUpCodeModel.deleteOne({ verify_code: random_code })
//                     }, 1000*60*2)
//                 } else if(status == 'login'){
//                     await LogInCodeModel.create({ verify_code: random_code, email: user.email })
//                     setTimeout(async ()=>{
//                         await LogInCodeModel.deleteOne({ verify_code: random_code })
//                     }, 1000*60*2)
//                 }

//                  return random_code
//             } catch (error) {
//                 console.log(error)
//             }
//         }

//         const generate_password = async () => {
//             try {
//                 let random_number = Math.floor(Math.random()*99999)
//                 let text = ''
//                 let possible = "abcdefghijklmnopqrstuvwxyz"
                
//                 for (let i = 0; i < 4; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
//                 console.log("This is the password", text + random_number)
//                 return text + random_number

//             } catch (error) {
//                 console.log(error)
//             }
//         }

//         if(status == 'forget'){
//             let password = await generate_password()

//             transporter.sendMail({
//                 from: 'leepang8834@gmail.com.tw',
//                 to: user.email,
//                 subject: 'Forget Your Password?',
//                 html: `
//                     <p>Hello! ${user.username}</p>
//                     <p>Your Reset Password Code Is：<strong style="color: #ff4e2a;">${password}</strong></p>
//                     <p>*** PLEASE REMEMBER TO CHANGE YOUR PASSWORD AFTER YOU LOGIN !! ***</p>
//                 `
//             }, (error, info) => {
//                 if (error) {
//                     console.log(error)
//                     transporter.close()
//                 } else {     
//                     console.log('Email sent: ' + info.response)
//                 }
//             })

//             return password
//         } else {
//             let code = await generate_code()

//             transporter.sendMail({
//                 from: 'leepang8834@gmail.com.tw',
//                 to: user.email,
//                 subject: 'Verify Your Identity',
//                 html: `
//                     <p>Hello! ${user.username}</p>
//                     <p>Your Verification Code Is：<strong style="color: #ff4e2a;">${code}</strong></p>
//                     <p>*** IT ONLY WORK WITHIN 2 MINUTES !! ***</p>
//                 `
//             }, (error, info) => {
//                 if (error) {
//                     console.log(error)
//                     transporter.close()
//                 } else {     
//                     console.log('Email sent: ' + info.response)
//                 }
//             })

//             return code
//         }

//     },
//     verify: async (code, status) => {
//         try {
//             let find_code
//             if(status == 'login') {
//                 find_code = await LogInCodeModel.find({ verify_code: code })
//                 if(find_code.length == 0) return 'Code Not Found Or Typo'
//                 await LogInCodeModel.deleteOne({ verify_code: find_code[0].verify_code, email: find_code[0].email })
//             }
//             else if(status == 'signup') {
//                 find_code = await SignUpCodeModel.find({ verify_code: code })
//                 if(find_code.length == 0) return 'Code Not Found Or Typo'
//                 await SignUpCodeModel.deleteOne({ verify_code: find_code[0].verify_code, id: find_code[0].id, email: find_code[0].email, password: find_code[0].password, username: find_code[0].username })
//             }
//             return find_code[0]
//         } catch (error) {
//             console.log(error)
//         }
//     }
// }