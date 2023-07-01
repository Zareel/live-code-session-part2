import Product from "../models/product_schema.js";
import formidable from "formidable";
import { s3FileUpload, s3DeleteFile } from "../service/imageUpload.js";
import mongoose, { Mongoose } from "mongoose";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../service/customError.js";
import config from "../config/index.js";
import fs from "fs";

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

    if (
      !fields.name ||
      !fields.price ||
      !fields.description ||
      !fields.collectionId
    ) {
      throw new CustomError("Please fill all the fields", 500);
    }
    let imgArrayResp = Promise.all(
      Object.keys(files).map(async (file, index) => {
        let element = file[fileKey];
        console.log(element);
        const data = fs.readFileSync(element.filepath);

        const upload = await s3FileUpload({
          bucketName: config.S3_BUCKET_NAME,
          key: `products/${productId}/photo_${index + 1}.png`,
          body: data,
          contentType: element.mimetype,
        });
        //productId = 123abc456
        //1:products/123abc456/photo_1.png
        //2:products/123abc456/photo_2.png
        console.log(upload);
        return {
          secure_url: upload.Locatin,
        };
      })
    );

    let imgArray = await imgArrayResp;

    const product = product.create({
      _id: productId,
      photos: imgArray,
      ...fields,
    });
    if (!product) {
      throw new CustomError("Product failed to be created in DB", 400);
    }
    res.status(200).json({
      success: true,
      product,
    });
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (!products) {
    throw new CustomError("No products found", 404);
  }
  res.status(200).json({
    success: true,
    products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("No product found", 404);
  }
  res.status(200).json({
    success: true,
    product,
  });
});

export const getProductByCollectionId = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;
  const products = await Product.find({ collectionId });

  if (!products) {
    throw new CustomError("No Products found", 404);
  }
  res.status(200).json({
    success: true,
    products,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById({ productId });

  if (!product) {
    throw new CustomError("No product Found", 404);
  }
  // resolve promise
  //loop through photos array => delete each photo
  //key: product._id
  const deletePhotos = Promise.all(
    product.photos.map(async (element, index) => {
      await s3DeleteFile({
        bucketName: config.S3_BUCKET_NAME,
        key: `products/${product._id.string()}/photo_${index + 1}.png`,
      });
    })
  );

  await deletePhotos();
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product has been deleted successfully",
  });
});
