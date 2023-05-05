import mongoose, { mongo } from "mongoose";
import AuthRoles from "../utils/authRoles"
import bcrypt from "bcryptjs"
import crypto from crypto
import JWT from "jsonwebtoken"
import config from "../config/index.js";


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: ["true", "Name is required"],
        maxLength: [50, "Name must be less than 50 chars"]
    },
    email:{
        type: String,
        required: ["true", "Email is required"],  

    },
    password:{
        type: String,
        required: ["true", "password is required"],
        minLength:[8, "password must contain atleast 8 chars"],
        select: false
    },
    role:{
        type: String,
        enum:Object.values(AuthRoles),
        default:AuthRoles.User
    },

    // forgot password fucnctionality
        forgotPasswordToken: String,
        forgotPasswordExpiry:Date,
   
}, {timestamps:true})

// encrypt the password before saving 

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next()
    bcrypt.hash(this.password,10)
    next()
})

  //compare password
userSchema.method = {
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    },

    // generate jwt token
    getJWTtoken: function(){
        JWT.sign({_id: this._id, role: this._role}, config.JWT_SECRET, {expiresIn:config.JWT_EXPIRY})
    },

    //generate forgot password token
    generateForgotPasswordToken : function(){
        const forgotToken = crypto.randomBytes(20).toString("hex")

        // just to encrypt the token encrypted by crypto
        this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex")

        // time for token to expire
        this.forgotPasswordExpiry = date.now() + 20 * 60 * 1000
        return forgotToken
    }
}

export default mongoose.model("User", userSchema)

