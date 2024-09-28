import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { trainingServiceInstance } from "../../../../services/training.service";
import { userServiceInstance } from "../../../../services/user.service";
import {
  headerDataServiceInstance,
  HeaderDataTypes,
} from "../../../../services/headerData.service";

import { catchAsyncValidatorHandler } from "../../helpers/catchAsync";

const createTraining: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const headers = headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.POST
  );

  const role = event.requestContext.authorizer.role;

  const trainingData = event.body;

  await trainingServiceInstance.createTraining(trainingData);

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      message: `Training created`,
      headers,
      role,
    }),
  };
};

export const main = middyfy(
  catchAsyncValidatorHandler<typeof schema>(createTraining)
);
