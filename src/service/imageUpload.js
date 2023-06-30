import S3 from "../config/s3.config.js";

export const s3FileUpload = async ({ bucketName, key, body, contentType }) => {
  return await S3.upload({
    Bucket: bucketName,
    Key: key,
    Body: body,
    CongtentType: contentType,
  }).promise();
};

export const s3DeleteFile = async ({ bucketName, key }) => {
  return await S3.deleteObject({
    Bucket: bucketName,
    Key: key,
  }).promise();
};
