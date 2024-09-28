import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { userServiceInstance } from "../../../../services/user.service";
import {
  headerDataServiceInstance,
  HeaderDataTypes,
} from "../../../../services/headerData.service";

import { catchAsyncValidatorHandler } from "../../helpers/catchAsync";

const changePassword: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const headers = headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.POST
  );

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
};

export const main = middyfy(
  catchAsyncValidatorHandler<typeof schema>(changePassword)
);
