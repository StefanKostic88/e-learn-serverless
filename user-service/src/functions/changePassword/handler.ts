import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { userServiceInstance } from "../../../../services/user.service";
import {
  headerDataServiceInstance,
  HeaderDataTypes,
} from "../../../../services/headerData.service";

const changePassword: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const headers = headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.POST
  );

  try {
    const userId = event.requestContext.authorizer.id;

    const message = await userServiceInstance.updateUserPassword(
      userId,
      event.body
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message,
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

export const main = middyfy(changePassword);

// const headers = {
//   "Access-Control-Allow-Headers": "Content-Type",
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "OPTIONS,POST",
// };
