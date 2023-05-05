# live-code-session
A discussion over creating a backend for e-comm app

# Connecting to database

### setting up work space

github => code => create codespace

### create a new container configration

open command palet => type codespace => choose dev container configration (first option) => choose create a new configration => type nodejs => choose Nodejs and Mongo DB devcontainers (third option) (
`this will install nodejs and mongodb along with it`) => choose the default version (first option) => ok

- click on rebuild

### initialize node application

- npm init

- index.js file in the root folder

- create src folder
- create app.js file inside src

### in the package.json file

"type": "module", => Allow us to write module based code
"main": "index.js",
"scripts": {
"start": "node index.js",
"dev": "nodemon index.js"
}

### install below packages

- npm i express mongoose dotenv
- npm i -D node mon

=====================================================

## Create an express app

- app.js

```js
import express from "express";
const app = express();
export default app;
```

- index.js

## database connection

[database connection Link](https://mongoosejs.com/docs/connections.html)

[express events Link](http://expressjs.com/en/4x/api.html)

[express event on Link](http://expressjs.com/en/5x/api.html#app.onmount)

```js
import mongoose from "mongoose";
import app from "./app.js";
//mongoose is a simple client or a middle client which hepls us to talk our application to mongodb

//To handle initial connection errors, you should use try/catch with async/await.

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ecomm");
    console.log("DB CONNECTED!");

    // below  code let express talk to database
    // there can be error that express might throw in that case fire a call back
    app.on("error", (err) => {
      console.error("Error: ", err);
      throw err;
    });
    // the above code should always be above app.listen

    const onListening = () => {};

    app.listen(5000, onListening);
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
})();

```

## Create .env.example

create .env file in the root folder

```js
PORT = 5000
MONGODB_URL=mongodb://loacalhost:27017/ecomm
```

## create config folder in src

[dotenv doc](https://www.npmjs.com/package/dotenv)

- create index.js file inside config folder

- ./src/config/index.js

```js
import dotenv from "dotenv"
// initialize dotconfig
dotenv.config()

const config = {
    //either use the port from process.env, if you don't have this, then user PORT 5000
    PORT:process.env.PORT || 5000
    // use MONGODB_URL from process .env, if it is not available then use the variable from index.js file
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/ecomm"
}

export default config

```

=> Go to index.js and import this config
// since config is an object we can access the mongodb url from it (line # 6)
// access config in line # 12 and 14 instead of port

- index.js

```js
import mongoose from "mongoose";
import app from "./src/app.js";
import config from "./src/config/index.js";

(async () => {
  try {
    await mongoose.connect(config.MONGDB_URL);
    console.log("DB CONNECTED!");

    app.on("error", (err) => {
      console.error("Error: ", err);
      throw err;
    });

    const onListening = () => {
      console.log(`Listening on PORT ${config.port}`);
    };

    app.listen(config.PORT, onListening);
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
})();

```

## 1 hr