import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { userServiceInstance } from "../../../../services/user.service";
import {
  headerDataServiceInstance,
  HeaderDataTypes,
} from "../../../../services/headerData.service";

import { catchAsyncValidatorHandler } from "../../helpers/catchAsync";

const editProfile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const headers = headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.PATCH
  );

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
};

export const main = middyfy(
  catchAsyncValidatorHandler<typeof schema>(editProfile, HeaderDataTypes.PATCH)
);
