import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { userServiceInstance } from "../../../../services/user.service";

const editProfile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,PATCH",
  };
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
      headers,
      body: JSON.stringify({
        message: message,
        headers,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      headers,
      body: JSON.stringify({
        message: error.message,
        headers,
      }),
    };
  }
};

export const main = middyfy(editProfile);
