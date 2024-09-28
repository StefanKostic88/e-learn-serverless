import schema from "./schema";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { userServiceInstance } from "../../../../services/user.service";
import { LoginData } from "../../models/user.model";
import {
  headerDataServiceInstance,
  HeaderDataTypes,
} from "../../../../services/headerData.service";

import { catchAsyncValidatorHandler } from "../../helpers/catchAsync";

const loginUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const headers = headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.POST
  );

  const loginData: LoginData = event.body;

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
};

export const main = middyfy(
  catchAsyncValidatorHandler<typeof schema>(loginUser)
);
