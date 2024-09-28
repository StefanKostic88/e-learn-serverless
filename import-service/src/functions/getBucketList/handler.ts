import { S3 } from "aws-sdk";

import { APIGatewayProxyHandler } from "aws-lambda";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

import * as dotenv from "dotenv";
dotenv.config({ path: "../../../../.env" });

export const getBucketList: APIGatewayProxyHandler = async (event) => {
  const headers = headerDataServiceInstance.generateHeaderData();
  try {
    const imageName = event?.queryStringParameters?.imageName;
    const extension = event?.queryStringParameters?.fileType;

    const s3 = new S3({ region: "eu-north-1" });
    const bucketName = process.env.IMPORT_FILE_BUCKET;

    const params = {
      Bucket: bucketName,
      Key: `static-files/${imageName}.${extension}`,
      Expires: 20,
    };

    const url = s3.getSignedUrl("getObject", params);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: url,
        headers,
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Error",
        headers,
      }),
    };
  }
};
