import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  StatementEffect,
} from "aws-lambda";

import { jwtServiceInstance } from "../../../../services/jwt.service";

const generatePolicy = (
  principalId: string,
  effect: StatementEffect,
  resource: string
): APIGatewayAuthorizerResult => {
  const response: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        { Action: "execute-api:Invoke", Effect: effect, Resource: resource },
      ],
    },
  };

  return response;
};

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent
) => {
  if (
    !event.authorizationToken ||
    event.authorizationToken.split(" ")[0] !== "Basic"
  ) {
    throw new Error("Unauthorized");
  }

  const token = event.authorizationToken.split(" ")[1];
  const decodedToken = await jwtServiceInstance.verifyToken(token);
  console.log(decodedToken);

  if ((decodedToken as { id: string }).id) {
    return generatePolicy("user", "Allow", event.methodArn);
  } else {
    return generatePolicy("user", "Deny", event.methodArn);
  }
};
