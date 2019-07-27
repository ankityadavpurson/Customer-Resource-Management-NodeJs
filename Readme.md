# Customer Resource Management NodeJs

## Customer Resource Management NodeJs api for CRM using

1. Node.js
2. Express
3. MongoDB

## Install

```bash
# with npm

npm install

npm install dotenv --save-dev

```

## Usage

Add the following code the `server.js` file.

```javascript
require('dotenv').config()
```

Create a `.env` file in the root directory of project. Add
environment variables specified below.

## .ENV contains following

### `Required in production`
MONGO_PASS= `mongodb-password`<br>
CRYPTO_PASSWORD=`crypto-password`<br>
CRYPTO_SALT=`salt-used-in-cyrpto`<br>
JWT_SECRETKEY=`jwt-secret-key`<br>
NODEMAILER_EMAILID=`your-mail-id`<br>
NODEMAILER_PASSWORD=`your-mail-password`<br>

### `Opttional, only required in devlopment`
PORT=3000<br>
DEV=1

## Mongo DB 

Replace the `MONGO_URL` with 'mongodb://localhost:27017'

```javascript
const MONGO_URL = 'mongodb://localhost:27017';
```

The given url in the code of MongoDB Atlas cloud database.<br>
Follow the link create an Atlas Account- <br>

* [MongoDBAtlas][] - Getting Started with MongoDB Atlas

## 

[MongoDBAtlas]: https://docs.atlas.mongodb.com/getting-started/

