import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../service/customError.js";
import User from "../models/user_schema.js";

//HTTP Only cookies
export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/******************************************
 * @SIGNUP
 * @ROUTE http:/localhost:3000/api/auth/sighup
 * @DISCRIPTION User signup Controller for creating new user
 * @RETURNS User Object
 ******************************************/

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
  user.password = undefined;

  // store this token in user's cookie
  res.cookie("token", token, cookieOptions);

  // sending back response to the user
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //validation
  if (!email || !password) {
    throw new CustomError("Please fill all the details", 400);
  }
  // find if the user is existing in the db
  const user = User.findOne({ email }).select("+ password"); // password was selected false in the user schema. Here we are making the select: true

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }
  // if the user exists, compare password
  const isPasswordMatched = await user.comparePassword(password);
  // Based on whether password was matched or not we are going to generate a toke for the user
  if (isPasswordMatched) {
    const token = user.getJWTtoken();
    // now since this user object is holding the password also let's go ahead and do the safety
    user.password = undefined;
    //set up the cookies
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }
  //if the password doesn't match
  throw new CustomError("Password is incorrect", 400);
});
