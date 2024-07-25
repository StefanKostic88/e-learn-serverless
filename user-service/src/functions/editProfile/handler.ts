import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

const editProfile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Edit profile",
        data: event.body,
        userId: event.requestContext.authorizer.id,
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
