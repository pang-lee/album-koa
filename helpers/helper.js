module.exports = {
    generate: () => {
        let code = ''
        for(let i= 0;i<6;i++){
            code += parseInt(Math.random()*10)
        }
        return code
    },
    forget: () => {
        let random_number = Math.floor(Math.random()*99999)
        let text = ''
        let possible = "abcdefghijklmnopqrstuvwxyz"

        for (let i = 0; i < 4; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
        return text + random_number
    }
}