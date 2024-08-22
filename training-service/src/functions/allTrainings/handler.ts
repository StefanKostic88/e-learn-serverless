import { APIGatewayProxyHandler } from "aws-lambda";

import { trainingServiceInstance } from "../../../../services/training.service";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export const allTrainings: APIGatewayProxyHandler = async () => {
  const headers = headerDataServiceInstance.generateHeaderData();
  try {
    const data = await trainingServiceInstance.getAllTrainings();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Success",
        data,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
