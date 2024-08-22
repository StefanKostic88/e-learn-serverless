import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { trainingServiceInstance } from "../../../../services/training.service";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export const myTrainings: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const headers = headerDataServiceInstance.generateHeaderData();
  try {
    const userId = event.requestContext.authorizer.id;
    const role = event.requestContext.authorizer.role;
    const params = event.queryStringParameters as {
      name: string;
      specialization: string;
      createdBefore?: string;
      createdAfter?: string;
    };

    const data = await trainingServiceInstance.getMyTrainings(
      userId,
      role,
      params
    );
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Success",
        data,
        headers,
        params,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      headers,
      body: JSON.stringify({
        message: error.message,
        headers,
      }),
    };
  }
};
