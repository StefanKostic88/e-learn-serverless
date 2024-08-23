import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

import { userServiceInstance } from "../../../../services/user.service";

import { headerDataServiceInstance } from "../../../../services/headerData.service";
import { catchAsyncProxyHandler } from "../../helpers/catchAsync";

export const myAccount = catchAsyncProxyHandler(
  async (event: APIGatewayProxyEvent) => {
    const headers = headerDataServiceInstance.generateHeaderData();

    const userId = event.requestContext.authorizer.id;

    const data = await userServiceInstance.getUserById(userId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data,
        headers,
      }),
    };
  }
);

// export const myAccount: APIGatewayProxyHandler = async (
//   event: APIGatewayProxyEvent
// ) => {
//   const headers = headerDataServiceInstance.generateHeaderData();

//   const userId = event.requestContext.authorizer.id;

//   const data = await userServiceInstance.getUserById(userId);

//   return {
//     statusCode: 200,
//     headers,
//     body: JSON.stringify({
//       data,
//       headers,
//     }),
//   };
// };
