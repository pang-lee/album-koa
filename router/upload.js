const router = require('koa-router')()

router.get('/', async(ctx, next) =>{
    ctx.body = 'hello from upload'
})

router.post('/', async(ctx, next) =>{
    ctx.body = 'success post image'
    let postdata = "";
    ctx.req.addListener('data', (data) => {
        console.log(data)
        postdata += data
    })
})

module.exports = router