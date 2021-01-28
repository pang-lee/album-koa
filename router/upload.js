const router = require('koa-router')()
const multer = require('@koa/multer')
const mime = require('mime-types')
const { storage } = require('../helpers/helper')
const upload = multer({ storage })

router.get('/avatar', async(ctx, next) =>{
    try {
        if(ctx.uid){
            let user = await ctx.model('User').findById(ctx.uid)
            if(user.avatar == '') return next()
            let img = await ctx.gridFS.findOne(user.avatar)
            let mimeType = mime.lookup(img.contentType)
            let avatar = await ctx.gridFS.readFileStream(img._id)
            avatar.on('data', (chunks) => { return chunks })
            ctx.set('content-type', mimeType)
            return ctx.body = avatar
        }
        return next()
    } catch (error) {
        console.log('This is get avatar', error)
        return next()
    }
})

router.post('/avatar', upload.single('avatar'), async(ctx, next) => {
    try {
        if(ctx.uid){
            let user = await ctx.model('User').findById(ctx.uid)
            if(user.avatar !== ''){
                let old = await ctx.gridFS.findOne(user.avatar)
                await ctx.gridFS.delete(old._id)
            }
            await ctx.model('User').findByIdAndUpdate(ctx.uid, { avatar: ctx.request.header.field })
            let img = await ctx.gridFS.findOne(user.avatar)
            let mimeType = mime.lookup(img.contentType)
            let avatar = await ctx.gridFS.readFileStream(img._id)
            avatar.on('data', (chunks) => { return chunks })
            ctx.set('content-type', mimeType)
            return ctx.body = avatar
        }
        return next()
    } catch (error) {
        console.log('This is post avatar error', error)
        return next()
    }
})

// vue-core-image-upload API pass
// router.post('/avatar', upload.single('test'), async(ctx, next) =>{
//     next()
// })


// Upload background API
// router.get('/background', async(ctx, next) =>{
//     try {
//         if(ctx.uid){
//             let user = await ctx.model('User').findById(ctx.uid)
//             if(user.background == '') return next()
//             let img = await ctx.gridFS.findOne(user.background)
//             let mimeType = mime.lookup(img.contentType)
//             let background = await ctx.gridFS.readFileStream(img._id)
//             background.on('data', (chunks) => { return chunks })
//             ctx.set('content-type', mimeType)
//             return ctx.body = background
//         }
//         return next()
//     } catch (error) {
//         console.log('This is get avatar', error)
//         return next()
//     }
// })

// router.post('/background', upload.single('background'), async(ctx, next) => {
//     try {
//         if(ctx.uid){
//             let user = await ctx.model('User').findById(ctx.uid)
//             if(user.background !== ''){
//                 let old = await ctx.gridFS.findOne(user.background)
//                 await ctx.gridFS.delete(old._id)
//             }
//             await ctx.model('User').findByIdAndUpdate(ctx.uid, { background: ctx.request.header.field })
//             let img = await ctx.gridFS.findOne(user.background)
//             let mimeType = mime.lookup(img.contentType)
//             let background = await ctx.gridFS.readFileStream(img._id)
//             background.on('data', (chunks) => { return chunks })
//             ctx.set('content-type', mimeType)
//             return ctx.body = background
//         }
//         return next()
//     } catch (error) {
//         console.log('This is post background error', error)
//         return next()
//     }
// })

module.exports = router