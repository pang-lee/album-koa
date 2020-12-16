const router = require('koa-router')()

router.get('/', async(ctx, next) =>{
    ctx.body = 'hello from upload'
})

router.post('/', async(ctx, next) =>{
    try {
        ctx.body = 'success post image'
        let postdata = ''
        ctx.req.addListener('data', (data) => {
            postdata += data
            console.log(typeof postdata)
        })        
    } catch (error) {
        console.log("This is post photo error", error)
    }

})

module.exports = router