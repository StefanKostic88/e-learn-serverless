import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import { userServiceInstance } from "../../services/user.service";

import schema from "./schema";
import { RegisterUser } from "../../models/user.model";

const createUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    let registerUser: RegisterUser = event.body;
    // In case firstName, lastName or email are missing we get {"message": "Invalid request body"}

    await userServiceInstance.checkIfUserExists(registerUser);
    await userServiceInstance.createUser(registerUser);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `User created`,
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

export const main = middyfy(createUser);
