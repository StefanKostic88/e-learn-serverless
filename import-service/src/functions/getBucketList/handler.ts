import { S3 } from "aws-sdk";

import { APIGatewayProxyHandler } from "aws-lambda";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export const getBucketList: APIGatewayProxyHandler = async (event) => {
  const headers = headerDataServiceInstance.generateHeaderData();
  try {
    const imageName = event?.queryStringParameters?.imageName;
    const extension = event?.queryStringParameters?.fileType;

    const s3 = new S3({ region: "eu-north-1" });
    const bucketName =
      "my-file-import-bucket-s3-bucket-5501154561125-11445554-name";

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
