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

## Create models

- category
- product
- user
- discount

### timestamps =>

- mongoose schemas support a timestamps option.
- if you set `timestamps: true`, Mongoose will add two properties of type `Date` to your schema

1. createdAt: A date representing when this document is created
2. updatedAt: A date representing when this document is updated

## collection schema

### create `model` folder and `collection.schema.js` file

- `collection.schema.js` 👇

```js
import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a collection name"],
      maxLength: [120, "Collection name cannot exceed 120 chars"],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);

// "Collection will be converted in to all lowercase and to plural in the database"
```

## product schema

```js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Name is required"],
      trim: true,
      maxLength: [120, "Product name must not exceed 120 chars"],
    },
    price: {
      type: Number,
      required: ["true", "please provide a product price"],
      maxLength: [5, "product name should not be max than 120 chars"],
    },
    description: {
      type: String,
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    collectionId: {
      ref: "Collection",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
```

## coupon schema

```js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please provide a coupon code"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    active: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
```

## order schema

```js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          count: Number,
          price: Number,
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coupon: {
      type: String,
      TransactionId: String,
      status: {
        type: String,
        enum: ["OREDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "Ordered",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
```

## user schema

```js
import mongoose, { mongo } from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import JWT from "jsonwebtoken";
import config from "../config/index.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Name is required"],
      maxLength: [50, "Name must be less than 50 chars"],
    },
    email: {
      type: String,
      required: ["true", "Email is required"],
    },
    password: {
      type: String,
      required: ["true", "password is required"],
      minLength: [8, "password must contain atleast 8 chars"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.User,
    },

    // forgot password fucnctionality
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

// encrypt the password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10);
  next();
});

//compare password
userSchema.method = {
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  // generate jwt token
  getJWTtoken: function () {
    JWT.sign({ _id: this._id, role: this._role }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRY,
    });
  },

  //generate forgot password token
  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");

    // just to encrypt the token encrypted by crypto
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    // time for token to expire
    this.forgotPasswordExpiry = date.now() + 20 * 60 * 1000;
    return forgotToken;
  },
};

export default mongoose.model("User", userSchema);
```

# async handler

## create folder `servise` inside `src` and file `asyncHandler.js` in service folder

`service/asyncHandler.js` 👇

```js
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export default asyncHandler;

// from the function `fn` the values req, res and next will be extracted
// next is a middleware flag
// middleware - software that is stopping you in between. it acts as a bridge between an operating system or database and applications
// req is coming fron the frontend
// res is something that is server is sending to the frontend
```

# Controllers

### Every single method to be async-await and try-catch. How about if we create an higher order function, abstract the functionality and put it seperately and use in every methods

- higher order function => a function that returns a function or take other functions as arguments

## custom error handler

- [docs](https://nodejs.org/docs/latest-v20.x/api/errors.html#errormessage)

- `service/customError.js` 👇

```js
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export default CustomError;
```

## signup controller

- `controllers/auth.controller.js` 👇

```js
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../service/customError.js";
import User from "../models/user_schema.js";

//signup a new user
export const signup = asyncHandler(async (req, res) => {
  // get data from the user
  const { name, email, password } = req.body;
  //validate
  if (!name || !email || !password) {
    throw new CustomError("Please add all fields", 400);
    // default => throw new Error("Require all fields")
  }
  // create new entry in the database or lets add this data in the databse

  //check if the user already exist
  const existingUser = await User.findOne({ email });
  // if user doesn't exists, thow an error
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }
  // creating new user
  const user = await User.create({
    name,
    email,
    password,
  });
  const token = user.getJWTtoken();
  //safety
  user.password = undefined; // incase if you want to send the user a welcome message or somethind, other wise ignore. just to show the case by case situation
  /*
    the variable user is now having all the `User info` including password.
  on request for the User info, the password will not come to me because of the `select:false` operation
  but then, we know that select: false operation actually respects the flag when ther is a select operation something like find by id etc. since this was a creation the select flag will not be respected. so manually went and say that user.password is undefined
  now the password is flushed out from the variable user
  */
  //* sending back response to the user
  res.status(200).json({
    success: true,
    token,
    user, // incase if you want to send the user a welcome message or somethind, other wise ignore. just to show the case by case situation
  });
});
```

## install and import `cors` and `cookie-parsor` in `app.js`

- [npm i cors](https://www.npmjs.com/package/cors)
  -CORS (cross origin resource sharing) is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

- [npm i cookie-parser](https://www.npmjs.com/package/cookie-parser)

- `app.js`

```js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//the instruction is whenever there is a request that comes up front frontend, make sure you are accepting the json data and the urlencoded data from it. But some response will go from server to user also. By installing the cookie parser,  the server can now access the user cookie

export default app;
```

### store this token in user's cookie

- `auth.controller.js`

```js
//HTTP Only cookies
export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};
// store this token in user's cookie
res.cookie("token", token, cookieOptions);
// now the user can see the token but cannot manipulate it
```

- There are client side cookies and server side cookies
- HTTP Only cookies cannot be accessed by the client. If the HTTP Only flag is not set or the cookie is set in clien side, the cookies can be accessed by the client and server side as well
