const router = require('koa-router')()

router.get('/', async(ctx, next) =>{
    if(ctx.uid) {
        try {
            const user = await ctx.model('User').findById(ctx.uid)
            return ctx.body = user.avatar
        } catch (error) {
            console.log("get img error", error)
        }
    }
    next()
})

router.post('/avatar', async(ctx, next) =>{
    if(ctx.uid) {
        try {
            await ctx.req.addListener('data', async (data) => {
                return await ctx.model('User').findByIdAndUpdate(ctx.uid, { avatar: data }, { useFindAndModify: false })
            })
            return ctx.body = 'success post image'
        } catch (error) {
            console.log('upload error', error)
        }
    }
    next()
})

module.exports = router