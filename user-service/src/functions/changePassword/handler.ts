import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

const changePassword: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { newPassword, confirmPassword, currentPassword } = event.body;
    console.log(newPassword, confirmPassword, currentPassword);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Change Password`,
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
