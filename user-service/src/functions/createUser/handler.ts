import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import { userServiceInstance } from "../../../../services/user.service";

import schema from "./schema";
import { RegisterUser } from "../../models/user.model";

import {
  headerDataServiceInstance,
  HeaderDataTypes,
} from "../../../../services/headerData.service";

import { catchAsyncValidatorHandler } from "../../helpers/catchAsync";

const createUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const headers = headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.POST
  );

  let registerUser: RegisterUser = event.body;

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
};

export const main = middyfy(
  catchAsyncValidatorHandler<typeof schema>(createUser)
);
