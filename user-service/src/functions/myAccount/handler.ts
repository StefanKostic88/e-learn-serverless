import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  Context,
} from "aws-lambda";

export const myAccount: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  const userId = (context as unknown as APIGatewayAuthorizerResultContext).id;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Working",
      userId: context,
    }),
  };
};
