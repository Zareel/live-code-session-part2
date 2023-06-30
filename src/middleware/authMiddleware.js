import User from "../models/user_schema.js";
import JWT from "jsonwebtoken";
import asyncHandler from "../service/asyncHandler.js";
import config from "../config/index.js";
import customError from "../config/index.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;
  //checking whether the req.headers has authorization if yes does it starts with Bearer
  if (
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bears"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new customError("Not autherized to access this resource, 401");
  }
  try {
    const decodedJWTPayload = JWT.verify(token, config.JWT_SECRET);
    req.user = await User.findById(decodedJWTPayload._id, "name email role");
    next();
  } catch (error) {
    throw new customError("Not autherized to access this resource, 401");
  }
});

export const authorize = (...requiredRoles) =>
  asyncHandler(async (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
      throw new customError("You are not authorized to access this resource ");
    }
    next();
  });
