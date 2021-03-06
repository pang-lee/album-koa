const { sign } = require('jsonwebtoken')
const GridFsStorage = require('multer-gridfs-storage')
const path = require('path')

module.exports = {
    generate: () => {
        let code = ''
        for(let i= 0; i<6; i++){
            code += parseInt(Math.random()*10)
        }
        return code
    },
    forget: () => {
        let random_number = Math.floor(Math.random() * 99999)
        let text = ''
        let possible = "abcdefghijklmnopqrstuvwxyz"

        for (let i = 0; i < 4; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
        return text + random_number
    },
    generate_token: (user) => {
        const accessToken = sign({uid: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1hrs' })
        const refreshToken = sign({ uid: user._id, count: user.count }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '14d' })
        return { accessToken, refreshToken }
    },
    storage: new GridFsStorage({
        url: `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DB}`,
        options: { useNewUrlParser: true, useUnifiedTopology: true },
        file: async (req, file) => {
            try {
                const crypto = await GridFsStorage.generateBytes()
                const filename = file.fieldname + '_' + crypto.filename + Date.now() + path.extname(file.originalname)
                req.headers.field = filename
                return {
                    filename: filename,
                    bucketName: 'Uploads'
                }
            } catch (error) {
                console.log('helper upload error', error)
                return new Error('Upload Failed With Some Error')
            }
        }
    }),
    readableStream: (readable) => {
        return new Promise((resolve, reject) => {
            let buffs = []
            readable.on('data', (chunks) => {
                buffs.push(chunks)
            })
            readable.on('end', () => {
                let fbuf = Buffer.concat(buffs)
                resolve(fbuf.toString('base64'))
            })
            readable.on('error', (error) => {
                reject(error)
            })
        })
    }
}