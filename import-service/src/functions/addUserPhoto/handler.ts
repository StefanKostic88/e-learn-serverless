import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";

import * as dotenv from "dotenv";
dotenv.config({ path: "../../../../.env" });

import { headerDataServiceInstance } from "../../../../services/headerData.service";

export const addUserPhoto: APIGatewayProxyHandler = async (event) => {
  const headers = headerDataServiceInstance.generateHeaderData();

  const extension = event?.queryStringParameters?.fileType.split("/")[1];
  const photoName = event?.queryStringParameters?.photoName;

  const s3 = new S3({ region: "eu-north-1", signatureVersion: "v4" });

  const signedUrlExpires = 60 * 5;

  const params = {
    Bucket: process.env.IMPORT_FILE_BUCKET,
    Key: `user-profile-images/${photoName}.${extension}`,
    Expires: signedUrlExpires,
  };

  const signedUrl = s3.getSignedUrl("putObject", params);

  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data: signedUrl, key: params.Key, headers }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error uploading file", headers }),
    };
  }
};
