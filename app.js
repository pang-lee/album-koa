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

app.use(jwt({ secret: process.env.KOASECRET }).unless({ path: [/^\/graphql/, /^\/upload/] }))

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(mongoose({
  host: 'localhost',
  port: '27017',
  user: '',
  pass: '',
  db: 'koa',
  mongoOptions: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
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
  
  let accessToken
  let refreshToken
  
  let accessCookie = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('album_access_token='))
  if(accessCookie) accessToken = accessCookie.split('=')[1]
  
  let refreshCookie = ctx.req.headers.cookie.split(';').find((c) => c.trim().startsWith('album_refresh_token='))
  refreshToken = refreshCookie.split('=')[1]

  if(!accessToken && !refreshToken) return next()

  if(accessToken){
    try {
      const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      ctx.uid = data.uid
      return next()
    } catch (error) {}
  }

  if (!refreshToken) return next()
    
  if(refreshToken){
    try {
      let data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    
      const user = await ctx.model('User').findById(data.uid)

      if (!user || user.count !== data.count) {
        return next()
      }
      
      ctx.uid = user._id
      return next()
    } catch {
      return next()
    }
  }

  next()
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