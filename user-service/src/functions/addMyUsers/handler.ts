import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { userServiceInstance } from "../../../../services/user.service";
import {
  headerDataServiceInstance,
  HeaderDataTypes,
} from "../../../../services/headerData.service";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { catchAsyncValidatorHandler } from "../../helpers/catchAsync";

const addMyUsers: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const headers = headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.POST
  );

  const userId = event.requestContext.authorizer.id;
  const usersToBeAdded = event.body.myUsers;

  await userServiceInstance.addToMyUsers(userId, usersToBeAdded);

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      message: `User created`,
    }),
  };
};

export const main = middyfy(
  catchAsyncValidatorHandler<typeof schema>(addMyUsers)
);

// const addMyUsers: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
//   event
// ) => {
//   const headers = headerDataServiceInstance.generateHeaderData(
//     HeaderDataTypes.POST
//   );

//   try {
//     const userId = event.requestContext.authorizer.id;
//     const usersToBeAdded = event.body.myUsers;

//     await userServiceInstance.addToMyUsers(userId, usersToBeAdded);

//     return {
//       statusCode: 201,
//       headers,
//       body: JSON.stringify({
//         message: `User created`,
//       }),
//     };
//   } catch (error) {
//     return {
//       statusCode: error.statusCode,
//       headers,
//       body: JSON.stringify({
//         message: error.message,
//         headers,
//       }),
//     };
//   }
// };

// export const main = middyfy(addMyUsers);
