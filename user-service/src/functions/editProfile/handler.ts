import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { userServiceInstance } from "../../../../services/user.service";

const editProfile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const userId = event.requestContext.authorizer.id;
    const role = event.requestContext.authorizer.role;

    userServiceInstance.checkAllProps(Object.keys(event.body));

    const message = await userServiceInstance.updateUserData(
      userId,
      event.body,
      role
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: message,
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

export const main = middyfy(editProfile);
