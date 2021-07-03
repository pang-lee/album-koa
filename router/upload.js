const router = require('koa-router')()
const multer = require('@koa/multer')
const { storage, readableStream } = require('../helpers/helper')
const upload = multer({ storage, limits: { fileSize: 4 * 1024 * 1024 }})

router.get('/avatar', async(ctx, next) =>{
    try {
        if(ctx.uid){
            let user = await ctx.model('User').findById(ctx.uid)
            if(user.avatar == '') return next()
            let img = await ctx.gridFS.findOne(user.avatar)
            let avatar = await ctx.gridFS.readFileStream(img._id)
            let stream = await readableStream(avatar)
            return ctx.body = stream
        }
        return next()
    } catch (error) {
        console.log('This is get avatar', error)
        return next()
    }
})

router.post('/avatar', async(ctx, next) => {
    try {
        if(ctx.uid){
            let img_error = await upload.single('avatar')(ctx, next).catch(err => err)
            if(img_error) return ctx.body = img_error.message
            let user = await ctx.model('User').findById(ctx.uid)
            if(user.avatar !== ''){
                let old = await ctx.gridFS.findOne(user.avatar)
                await ctx.gridFS.delete(old._id)
            }
            await ctx.model('User').findByIdAndUpdate(ctx.uid, { avatar: ctx.request.header.field })
            let img = await ctx.gridFS.findOne(user.avatar)
            let avatar = await ctx.gridFS.readFileStream(img._id)
            let stream = await readableStream(avatar)
            return ctx.body = stream
        }
        return next()
    } catch (error) {
        console.log('This is post avatar error', error)
        return next()
    }
})

router.get('/bookImg', async(ctx, next) => {
    try {
        if(ctx.uid){
            let img_data = JSON.parse(ctx.request.query.ImgArray)
            let img_result = []
            for(let i = 0; i < img_data.length; i++){
                let obj = { id: img_data[i].id }
                for(let j in img_data[i]){
                    if(j !== 'id'){
                        let img = await ctx.gridFS.findOne({ filename: img_data[i][j] })
                        let bookimg = await ctx.gridFS.readFileStream(img._id)
                        let stream = await readableStream(bookimg)
                        obj[j] = stream
                    }
                }
                img_result.push(obj)
            }
            return ctx.body = img_result            
        }
        return next()
    } catch (error) {
        console.log('This is get bookImg error', error)
    }
})

router.post('/bookImg', async(ctx, next) =>{
    try {
        if(ctx.uid) {
            let img_error = await upload.single('bookImg')(ctx, next).catch(err => err)
            if(img_error) return ctx.body = img_error.message
            return ctx.body = ctx.request.header.field
        }
        return next()
    } catch (error) { 
        console.log('This is post bookImg Upload error', error)
        return next()
    }
})

module.exports = router