import {
  APIGatewayAuthorizerResult,
  APIGatewayAuthorizerResultContext,
  APIGatewayTokenAuthorizerEvent,
  StatementEffect,
} from "aws-lambda";

import CustomError from "../../../../services/customError.service";
import { userServiceInstance } from "../../../../services/user.service";

import * as dotenv from "dotenv";

dotenv.config({ path: "../../../../.env" });

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
            process.env.MY_ACCOUNT_ARN,
            process.env.CHANGE_PASS_ARN,
            process.env.EDIT_PROFILE_ARN,
            process.env.CREATE_TRAINING_ARN,
            process.env.MY_TRAININGS_ARN,
            process.env.MY_USERS_ARN,
            process.env.ADD_MY_USER_ARN,
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
