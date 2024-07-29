import { APIGatewayProxyHandler } from "aws-lambda";

import { trainingServiceInstance } from "../../../../services/training.service";

export const allTrainings: APIGatewayProxyHandler = async () => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };
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
