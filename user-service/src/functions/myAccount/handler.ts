import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

import { userServiceInstance } from "../../../../services/user.service";

export const myAccount: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
  };

  const userId = event.requestContext.authorizer.id;

  const data = await userServiceInstance.getUserById(userId);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      data,
      headers,
    }),
  };
};
