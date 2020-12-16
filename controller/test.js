/*
 * @Description:api controller
 * @Version: 0.0.1
 * @Company: hNdt
 * @Author: xiaWang1024
 * @Date: 2020-02-21 14:08:48
 * @LastEditTime: 2020-02-21 14:21:41
 */
module.exports = {
    async getUser(ctx, next) {
        let code = 0
        let { url, query, querystring,params } = ctx
        if(!url){
            code = 1
        }
        ctx.body = {
            code:code,
            data:{url, query, querystring,params}
        }
    },
    async addUser(ctx,next){
        /**
         * ctx.request.body 
         * post 请求参数
         */
        let code = 0
        let {name} = ctx.request.body
        if(!name) {
            code = 1
        }
        ctx.body = {
            code,
            data:ctx.request.body
        }
    }
}
