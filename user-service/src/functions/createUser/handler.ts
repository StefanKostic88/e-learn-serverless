import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import { userServiceInstance } from "../../../../services/user.service";

import schema from "./schema";
import { RegisterUser } from "../../models/user.model";

const createUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };

  try {
    let registerUser: RegisterUser = event.body;
    // In case firstName, lastName or email are missing we get {"message": "Invalid request body"}

    await userServiceInstance.checkIfUserExists(registerUser);
    const data = await userServiceInstance.createUser(registerUser);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: `User created`,
        data,
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

export const main = middyfy(createUser);
