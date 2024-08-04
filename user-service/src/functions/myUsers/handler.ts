import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { userServiceInstance } from "../../../../services/user.service";

export const myUsers: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
  };
  try {
    const userId = event.requestContext.authorizer.id;

    const myUsers = await userServiceInstance.getMyUsers(userId);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: `Success`,
        data: myUsers,
        headers,
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
