import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { userServiceInstance } from "../../../../services/user.service";

const changePassword: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const userId = event.requestContext.authorizer.id;

    const message = await userServiceInstance.updateUserPassword(
      userId,
      event.body
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

export const main = middyfy(changePassword);
