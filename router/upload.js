const router = require('koa-router')()

router.get('/', async(ctx, next) =>{
    console.log('trigger', ctx.uid)
    if(ctx.uid){
        try {
            console.log('exec here')
            const user = await ctx.model('User').findById(ctx.uid)
            console.log('this is find user', user)
            return user.avatar
        } catch (error) {
            console.log("get img error", error)
        }
    }
    return null
})

router.post('/', async(ctx, next) =>{
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
    return null
})

module.exports = router