import {
  APIGatewayAuthorizerResult,
  APIGatewayAuthorizerResultContext,
  APIGatewayTokenAuthorizerEvent,
  StatementEffect,
} from "aws-lambda";

import CustomError from "../../../../services/customError.service";
import { userServiceInstance } from "../../../../services/user.service";

const generatePolicy = (
  principalId: string,
  effect: StatementEffect,
  resource: string,
  context?: APIGatewayAuthorizerResultContext
): APIGatewayAuthorizerResult => {
  const response: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: [
            "arn:aws:execute-api:eu-north-1:975049910354:lryie611ua/*/GET/myAccount",
            "arn:aws:execute-api:eu-north-1:975049910354:lryie611ua/*/PATCH/change-password",
            "arn:aws:execute-api:eu-north-1:975049910354:lryie611ua/*/PATCH/edit",
            "arn:aws:execute-api:eu-north-1:975049910354:lryie611ua/*/POST/create-training",
            "arn:aws:execute-api:eu-north-1:975049910354:lryie611ua/*/GET/my-trainings",
            "arn:aws:execute-api:eu-north-1:975049910354:lryie611ua/*/GET/my-users",
            "arn:aws:execute-api:eu-north-1:975049910354:lryie611ua/*/POST/add-my-users",
          ],
        },
      ],
    },
    context,
  };

  return response;
};

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent
) => {
  if (
    !event.authorizationToken ||
    event.authorizationToken.split(" ")[0] !== "Bearer"
  ) {
    throw new CustomError("Unauthorized", 401);
  }

  const token = event.authorizationToken.split(" ")[1];

  try {
    const decodedToken = (await userServiceInstance.verifyUser(token)) as {
      id: string;
      role: string;
    };

    if (decodedToken.id) {
      const context: APIGatewayAuthorizerResultContext = {
        id: (decodedToken as { id: string }).id,
        role: (decodedToken as { role: string }).role,
      };

      console.log(event.methodArn);

      return generatePolicy("user", "Allow", event.methodArn, context);
    } else {
      return generatePolicy("user", "Deny", event.methodArn);
    }
  } catch (error) {
    throw new CustomError("Unauthorized", 401);
  }
};
