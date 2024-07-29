import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { userServiceInstance } from "../../../../services/user.service";
import { LoginData } from "../../models/user.model";

const loginUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };

  try {
    const loginData: LoginData = event.body;
    // "message": "Invalid request body" in case pass and username are not provided

    const token = await userServiceInstance.loginUser(
      loginData.username,
      loginData.password
    );
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token,
        message: "Sucessfully Loged in",
        headers,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      headers,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

export const main = middyfy(loginUser);
