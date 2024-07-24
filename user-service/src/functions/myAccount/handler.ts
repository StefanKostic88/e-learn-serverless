import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from "aws-lambda";

import { DynamoDbService } from "../../../../services/dynamoDb.service";

const instanceOfDb = DynamoDbService.getInstance();

export const myAccount: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  // const userId = (context as unknown as APIGatewayAuthorizerResultContext).id;

  const userId = event.requestContext.authorizer.id;

  const data = await instanceOfDb.getUserById(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
};
