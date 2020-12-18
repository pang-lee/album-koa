/*
 * @Description: router index
 * @Version: 0.0.1
 * @Company: hNdt
 * @Author: xiaWang1024
 * @Date: 2020-02-21 10:36:53
 * @LastEditTime: 2020-02-21 10:40:50
 */

const router = require('koa-router')()
/**
 * 子路由模块
 */
const test = require('./test')
const upload = require('./upload')

router.use('/test', test.routes(), test.allowedMethods())
router.use('/upload', upload.routes(), upload.allowedMethods())

module.exports = router

