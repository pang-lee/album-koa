const router = require('koa-router')();
const { getUser, addUser } = require('../controller/test');

/**
 * 
 * @api {get} /user/:id Get user info
 * @apiName getUser
 * @apiGroup User
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {Number} id User unique id
 * 
 * @apiSuccess (Status Code 200) {Number} code 0：成功  1：失败
 * @apiSuccess (Status Code 200) {String} url 请求url
 * @apiSuccess (Status Code 200) {String} params 请求参数
 * @apiSuccessExample {json} Success-Response:
 * {"code":0,"data":{"url":"/user/1","query":{},"querystring":"","params":{"id":"1"}}}
 */

router.get('/:id', getUser);

/**
 * 
 * @api {post} /user/add Add new user
 * @apiName addUser
 * @apiGroup User
 * @apiVersion  1.0.0
 * 
 * 
 * @apiParam  {String} name 用户姓名
 * @apiParam  {Number} age 用户年龄
 * @apiParam  {String} city 用户所在城市
 * 
 * @apiSuccess (Status Code 200) {Number} code 0：成功  1：失败
 * @apiSuccess (Status Code 200) {String} name 用户名
 * @apiSuccess (Status Code 200) {Number} age 用户年龄
 * @apiSuccess (Status Code 200) {String} city 用户所在城市
 * @apiSuccessExample {json} Success-Response:
 * {"code":1,"data":{"name":"王侠","age":"28","city":"郑州市"}}
 * 
 */


router.post('/add', addUser);

module.exports = router;
