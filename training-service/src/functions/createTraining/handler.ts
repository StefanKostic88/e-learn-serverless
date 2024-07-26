import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { trainingServiceInstance } from "../../../../services/training.service";

const createTraining: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  // STEPS
  // STEP 1
  // IF any of the props is missing we get invalid request body

  // STEP2
  // check user role
  // if user is trainer assign user id to trainier_id

  // if user is student assign user id to student_id

  // specialization and trainingType are dictioneries

  // check if date string is valid date format

  // if all steps are ok create training in training table

  const userId = event.requestContext.authorizer.id;
  const role = event.requestContext.authorizer.role;
  const trainingData = event.body;
  await trainingServiceInstance.createTraining(trainingData);

  try {
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: `Training created`,
        data: event.body,
        dataTwo: {
          userId,
          role,
        },
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
