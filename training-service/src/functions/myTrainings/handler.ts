import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { trainingServiceInstance } from "../../../../services/training.service";

export const myTrainings: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  try {
    const userId = event.requestContext.authorizer.id;
    const role = event.requestContext.authorizer.role;

    const data = await trainingServiceInstance.getMyTrainings(userId, role);
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
