import { APIGatewayProxyHandler } from "aws-lambda";

import { trainingServiceInstance } from "../../../../services/training.service";

export const allTrainings: APIGatewayProxyHandler = async () => {
  try {
    const data = await trainingServiceInstance.getAllTrainings();

    return {
      statusCode: 200,
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
