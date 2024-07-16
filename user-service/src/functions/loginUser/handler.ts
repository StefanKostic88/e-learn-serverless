import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { userServiceInstance } from "../../services/user.service";
import { LoginData } from "../../models/user.model";

const loginUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const loginData: LoginData = event.body;
    // "message": "Invalid request body" in case pass and username are not provided

    const token = await userServiceInstance.loginUser(
      loginData.username,
      loginData.password
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        message: "Sucessfully Loged in",
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

export const main = middyfy(loginUser);
