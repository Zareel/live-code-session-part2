import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../service/customError.js";
import User from "../models/user_schema.js";

//HTTP Only cookies
export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};
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
