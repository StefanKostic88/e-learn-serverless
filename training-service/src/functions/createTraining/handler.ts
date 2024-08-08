import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { trainingServiceInstance } from "../../../../services/training.service";
import { userServiceInstance } from "../../../../services/user.service";

const createTraining: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  // const userId = event.requestContext.authorizer.id;

  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };

  const role = event.requestContext.authorizer.role;

  try {
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

export const main = middyfy(createTraining);
