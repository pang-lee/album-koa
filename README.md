# album_koa

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

#Remember to npm install and modify the node_modules @south-paw/koa-mongoose/src/index.js
#add the below line to the script
#const { MongoGridFS } = require('mongo-gridfs')
#ctx.gridFS = new MongoGridFS(connection.db, "Uploads")
```
