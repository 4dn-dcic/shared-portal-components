"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3UploadFile = s3UploadFile;

var _awsSdk = require("aws-sdk");

function s3UploadFile(file, upload_credentials) {
  _awsSdk.config.update({
    accessKeyId: upload_credentials.AccessKeyId,
    secretAccessKey: upload_credentials.SecretAccessKey,
    sessionToken: upload_credentials.SessionToken
  });

  var upload_url = upload_credentials.upload_url;
  var bucket = null;

  if (upload_url.slice(0, 5) === 's3://') {
    upload_url = upload_url.slice(5, upload_url.length);
    bucket = upload_url.split('/')[0];
  }

  if (!bucket) {
    return null;
  }

  var s3 = new _awsSdk.S3();
  return s3.upload({
    Bucket: bucket,
    Key: upload_credentials.key,
    Body: file
  });
}