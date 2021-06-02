const { readableStream } = require('../helpers/helper')

module.exports ={
    async getAvatar(ctx, next){
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
    },
    async postAvatar(ctx, next){
        try {
            if(ctx.uid){
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
    },
    async getBookImg(ctx, next){
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
            return next()
        }
    },
    async postBookImg(ctx, next){
        try {
            if(ctx.uid) return ctx.body = ctx.request.header.field
            return next()
        } catch (error) { 
            console.log('This is post bookImg Upload error', error)
            return next()
        }
    }
}