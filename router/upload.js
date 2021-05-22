const router = require('koa-router')()
const multer = require('@koa/multer')
const mime = require('mime-types')
const { storage, readableStream } = require('../helpers/helper')
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

router.get('/bookImg', async(ctx, next) => {
    try {
        // if(ctx.uid){
            let img_data = JSON.parse(ctx.request.query.ImgArray)

            // let img_data = [{
            //     id: 1,
            //     pages0: 'bookImg_3548c4171a74f133b8353fbdf14470741620623286594.jpg',
            //     pages1: 'bookImg_992d076037148eb7ee55164226c3c8941620312349378.jpg'
            // }]
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
        // }
        // return next()
    } catch (error) {
        console.log('This is get bookImg error', error)
    }
})

// vue-core-image-upload API pass
router.post('/bookImg', upload.single('bookImg'), async(ctx, next) =>{
    try {
        if(ctx.uid) return ctx.body = ctx.request.header.field
        return next()
    } catch (error) {
        console.log('This is post bookImg Upload error', error)
    }
    next()
})


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