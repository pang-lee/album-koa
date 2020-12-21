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

app.use(jwt({ secret: process.env.KOASECRET }).unless({ path: [/^\/graphql/] }))

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