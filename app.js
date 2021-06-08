require('dotenv').config()
const Koa = require('koa')
const app = new Koa()
const path = require('path')
const cors = require('koa2-cors')
const mongoose = require('@south-paw/koa-mongoose')
const { ApolloServer } = require('apollo-server-koa')
const jwt = require('koa-jwt')
const { typeDefs, resolvers } = require('./graphql/index')
const schema = require('./model/schema')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const { verify } = require('jsonwebtoken')
const override = require('koa-override')

app.use(jwt({ secret: process.env.KOASECRET }).unless({ path: [/^\/graphql/, /^\/upload/] }))

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(mongoose({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: '',
  pass: '',
  db: process.env.DB,
  mongoOptions: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    reconnectTries: null,
    reconnectInterval: null,
    poolSize: 10,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  },
  schemas: schema,
  events: {
    error: () => console.error('mongoose: error'),
    connected: () => console.log('mongoose: connected'),
    connecting: () => console.log('mongoose: connecting'),
    disconnecting: () => console.log('mongoose: disconnecting'),
    disconnected: () => console.log('mongoose: disconnected'),
  },
  useDefaultErrorHandler: false
}))

app.use(async(ctx, next) => {
  if (!ctx.req.headers.cookie) return next()

  let accessToken = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('album_access_token=')).split('=')[1]
  let refreshToken = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('album_refresh_token=')).split('=')[1]
  let accessExpired = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('album_access_token_expirationDate=')).split('=')[1]
  let refreshExpired = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('album_refresh_token_expirationDate=')).split('=')[1]
  let provider = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('Idp='))

  if(!provider){
    if(!accessToken && !refreshToken) return next()

    if(new Date().getTime() < Number.parseInt(accessExpired) && accessToken){
      try {
        let data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        ctx.uid = data.uid
        return next()
      } catch {
        return next()
      }
    } else if(new Date().getTime() > Number.parseInt(accessExpired) && new Date().getTime() < Number.parseInt(refreshExpired)){
      try {
        let data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        let user = await ctx.model('User').findById(data.uid)

        if (!user || user.count !== data.count) {
          return next()
        }

        ctx.uid = user._id
        return next()
      } catch {
        return next()
      }
    }
  }



  if(provider){
    try {
      let expired_cookies
      
      if(provider == 'google') expired_cookies = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('google_expirationDate='))
  
      if(provider == 'facebook') expired_cookies = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('facebook_expirationDate='))
      
      ctx.provider_token_expired = expired_cookies.split('=')[1]

      let { uid } = verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      
      ctx.uid = uid

      return next()
    } catch {
      return next()
    }

  }

  return next()
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ ctx }) => ({
    koa: ctx,
    mailer: nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.USERMAIL,
        pass: process.env.USERPASS
      }
    }))
  })
})

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())
app.use(override())

const router = require('./router/index')
app.use(router.routes(), router.allowedMethods())

const compress = require('koa-compress')
app.use(compress({ threshold:'2kb' }))
const serve = require('koa-static')
app.use(serve(path.join(__dirname, './public')), {  })

app.use(async (ctx, next) => {
  try {
    ctx.body = 'This is koa app.js middleware'
    await next()
  } catch (error) {
    console.log("app.js middleware error", error)
  }
})

app.listen(3001, () => {
  console.log(`koa server is running at http://localhost:3001`)
})