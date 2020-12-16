define({ "api": [
  {
    "type": "post",
    "url": "/user/add",
    "title": "Add new user",
    "name": "addUser",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>用户姓名</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "age",
            "description": "<p>用户年龄</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>用户所在城市</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Status Code 200": [
          {
            "group": "Status Code 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>0：成功  1：失败</p>"
          },
          {
            "group": "Status Code 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Status Code 200",
            "type": "Number",
            "optional": false,
            "field": "age",
            "description": "<p>用户年龄</p>"
          },
          {
            "group": "Status Code 200",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>用户所在城市</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"code\":1,\"data\":{\"name\":\"王侠\",\"age\":\"28\",\"city\":\"郑州市\"}}",
          "type": "json"
        }
      ]
    },
    "filename": "router/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/user/add"
      }
    ]
  },
  {
    "type": "get",
    "url": "/user/:id",
    "title": "Get user info",
    "name": "getUser",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User unique id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Status Code 200": [
          {
            "group": "Status Code 200",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>0：成功  1：失败</p>"
          },
          {
            "group": "Status Code 200",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>请求url</p>"
          },
          {
            "group": "Status Code 200",
            "type": "String",
            "optional": false,
            "field": "params",
            "description": "<p>请求参数</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"code\":0,\"data\":{\"url\":\"/user/1\",\"query\":{},\"querystring\":\"\",\"params\":{\"id\":\"1\"}}}",
          "type": "json"
        }
      ]
    },
    "filename": "router/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/user/:id"
      }
    ]
  }
] });
