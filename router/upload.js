const router = require('koa-router')()
const GridFsStorage = require('multer-gridfs-storage')
const multer = require('@koa/multer')
const mime = require('mime-types')
const path = require('path')

const storage = new GridFsStorage({
    url: `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DB}`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: async (req, file) => {
        try {
            const crypto = await GridFsStorage.generateBytes()
            const filename = crypto.filename + Date.now() + path.extname(file.originalname)
            req.headers.field = file.fieldname + '_' + filename
            return {
                filename: filename,
                bucketName: 'Uploads'
            }
        } catch (error) {
            console.log('helper upload error', error)
            return new Error('Upload Failed With Some Error')
        }
    }
})

const upload = multer({ storage })

router.get('/avatar', async(ctx, next) =>{
    try {
        if(ctx.uid){
            let user = await ctx.model('User').findById(ctx.uid)
            let img = await ctx.gridFS.findOne(user.avatar)
            let mimeType = mime.lookup(img.contentType)
            let avatar = await ctx.gridFS.readFileStream(img._id)
            avatar.on('data', (chunks) => { return chunks })
            ctx.set('content-type', mimeType)
            ctx.body = avatar
            next()
        }

    } catch (error) {
        console.log('This is get avatar', error)
        next()
    }
    // const item = await ctx.gridFS.readFileStream("5ff9c32e8eb1ab10f4388964")
    // item.on('data', (chunks) => { return chunks })
    // const type = await ctx.gridFS.findById("5ff9c32e8eb1ab10f4388964")
    // let mimeType = mime.lookup(type.contentType)
    // ctx.set('content-type', mimeType)
    // ctx.body = item
    // next()
})

router.post('/avatar', upload.single('avatar'), async(ctx, next) => {
    try {
        let user = await ctx.model('User').findByIdAndUpdate(ctx.uid, { avatar: ctx.request.header.field })
        let img = await ctx.gridFS.findOne(user.avatar)
        let mimeType = mime.lookup(img.contentType)
        let avatar = await ctx.gridFS.readFileStream(img._id)
        avatar.on('data', (chunks) => { return chunks })
        ctx.set('content-type', mimeType)
        ctx.body = avatar
    } catch (error) {
        console.log('This is post avatar error', error)
        next()
    }
})

// vue-core-image-upload API pass
// router.post('/avatar', upload.single('test'), async(ctx, next) =>{
//     next()
// })

module.exports = router