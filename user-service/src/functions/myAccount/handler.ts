import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

export const myAccount: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Working",
    }),
  };
};
