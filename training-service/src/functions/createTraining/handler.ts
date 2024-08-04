import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { trainingServiceInstance } from "../../../../services/training.service";
import { userServiceInstance } from "../../../../services/user.service";

const createTraining: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  // const userId = event.requestContext.authorizer.id;
  const role = event.requestContext.authorizer.role;

  try {
    const trainingData = event.body;

    await userServiceInstance.addToMyUsers(trainingData, role);
    await trainingServiceInstance.createTraining(trainingData);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `Training created`,
        role,
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
