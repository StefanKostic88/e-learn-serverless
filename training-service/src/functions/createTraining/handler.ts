import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { trainingServiceInstance } from "../../../../services/training.service";

const createTraining: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  // const userId = event.requestContext.authorizer.id;
  // const role = event.requestContext.authorizer.role;

  try {
    const trainingData = event.body;

    await trainingServiceInstance.createTraining(trainingData);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `Training created`,
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

export const main = middyfy(createTraining);
