import mongoose, { mongo } from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt, { hash } from "bcryptjs";
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

// encrypt the password before saving: Hooks

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods = {
  //compare password
  // since we need to access the property, we have to refer this so we cannot use arrow function
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },
  //generate JWT token
  //what if the password is now matched, we have to give him a token 'hey now you can roam arout the appication'

  JWTtoken: function () {
    JWT.sign({ _id: this._id, role: this.role }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRY,
    });
  },
  //generate forgot password
  // cretate a function, generate long string using crypto module and store it into a variable
  generateForgotPasswordToken: function () {
    const cryptoToken = crypto.randomBytes(20).toString("hex");

    // optional: encrypting the cryptoToken
    this.forgotPasswordToken = crypto
      .createHash("Sha256")
      .update(cryptoToken)
      .digest("hex");

    //time for cryptoToken to expire
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    return cryptoToken;
  },
};

export default mongoose.model("User", userSchema);
