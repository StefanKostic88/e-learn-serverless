import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

import { userServiceInstance } from "../../../../services/user.service";

export const myAccount: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const userId = event.requestContext.authorizer.id;

  const data = await userServiceInstance.getUserById(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
};
