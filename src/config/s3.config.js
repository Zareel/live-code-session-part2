import aws from "aws-sdk";
import config from "./index.js";

const s3 = new aws.S3({
  accessKeyId: config.S3_ACCESS_KEY,
  secretAccessKye: config.S3_SECRET_ACCESS_KEY,
  region: config.S3_REGION,
});
