/*
 * @Description: koa.js app
 * @Version: 0.0.1
 * @Company: hNdt
 * @Author: xiaWang1024
 * @Date: 2020-02-21 09:40:43
 * @LastEditTime: 2020-02-21 15:05:17
 */
const Koa = require('koa')
const app = new Koa()
const path = require('path')
var cors = require('koa2-cors')
const mongoose = require('@south-paw/koa-mongoose')
const server = require('./graphql/apollo')

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
    // these are the default middleware options, see https://mongoosejs.com/docs/connections.html#options
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    reconnectTries: null, // Never stop trying to reconnect
    reconnectInterval: null, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  },
  schemas: {
    // schemas recieve the middleware's mongoose instance, see https://mongoosejs.com/docs/schematypes.html
    users: ({ Schema }) =>
      new Schema(
        {
          name: { type: String },
          pets: [Schema.Types.ObjectId],
        },
        { collection: 'users' },
      ),
    pets: ({ Schema }) =>
      new Schema(
        {
          type: { type: String },
          name: { type: String },
        },
        { collection: 'pets' },
      ),
  },
  events: {
    // see https://mongoosejs.com/docs/api.html#connection_Connection-readyState
    error: () => console.error('mongoose: error'),
    connected: () => console.log('mongoose: connected'),
    connecting: () => console.log('mongoose: connecting'),
    disconnecting: () => console.log('mongoose: disconnecting'),
    disconnected: () => console.log('mongoose: disconnected'),
  },
  useDefaultErrorHandler: false, // enable or disable the default error handler
}))

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))

/**
 * post 数据解析
 */
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

/**
 * 加载路由
 */
const router = require('./router/index')
app.use(router.routes(), router.allowedMethods())

/**
 * 挂载静态资源
 */
const compress = require('koa-compress') /**开启gzip */
app.use(compress({threshold:'2kb'}))
const serve = require('koa-static')
app.use(serve(path.join(__dirname, './static')), {  })


app.use(async (ctx, next) => {
  try {
    ctx.body = 'hello from koa app.js middleware'    
  } catch (error) {
    console.log("app.js middleware error", error)
  }
})

app.listen(3001, () => {
  console.log(`koa server is running at http://localhost:3001`)
})