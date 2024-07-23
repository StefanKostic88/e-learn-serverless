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
  // const userId = (context as unknown as APIGatewayAuthorizerResultContext).id;
  console.log(context);
  console.log(event);
  const xxx = event.requestContext.authorizer;
  console.log(xxx);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Working",
      reqContext: xxx,
      event: event,
      context: context,
    }),
  };
};
