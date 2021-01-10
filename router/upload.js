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
            const filename = crypto.filename + path.extname(file.originalname)
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

router.get('/', async(ctx, next) =>{
    const item = await ctx.gridFS.readFileStream("5ff9c32e8eb1ab10f4388964")
    item.on('data', (chunks) => { return chunks })
    const type = await ctx.gridFS.findById("5ff9c32e8eb1ab10f4388964")
    let mimeType = mime.lookup(type.contentType)
    ctx.set('content-type', mimeType)
    ctx.body = item
    next()
})

router.post('/avatar', upload.single('test'), async(ctx, next) =>{
    next()
})

module.exports = router