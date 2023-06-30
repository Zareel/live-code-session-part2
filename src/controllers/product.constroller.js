import product from "../models/product_schema.js";
import formidable from "formidable";
import { s3FileUpload, s3DeleteFile } from "../service/imageUpload.js";
import mongoose, { Mongoose } from "mongoose";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../service/customError.js";
import config from "../config/index.js";

/******************************************
 * @ADD_PRODUCT
 * @ROUTE https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriprion Uses AWS S3 Bucket for image upload
 * @return Product Object
 */

export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({ multiples: true, keepExtensions: true });
  form.parse(req, async (error, fields, files) => {
    if (error) {
      throw new CustomError(error.message || "Something went wrong", 500);
    }
    // create productId
    let productId = new Mongoose.Types.ObjectId().toHexString();
    console.log(fields, files);
  });
});
