import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { userServiceInstance } from "../../../../services/user.service";
import { headerDataServiceInstance } from "../../../../services/headerData.service";
import { catchAsyncProxyHandler } from "../../helpers/catchAsync";

export const myUsers = catchAsyncProxyHandler(
  async (event: APIGatewayProxyEvent) => {
    const headers = headerDataServiceInstance.generateHeaderData();
    const userId = event.requestContext.authorizer.id;
    const myUsers = await userServiceInstance.getMyUsers(userId);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: `Success`,
        data: myUsers,
        headers,
      }),
    };
  }
);

// export const myUsers: APIGatewayProxyHandler = async (
//   event: APIGatewayProxyEvent
// ) => {
//   const headers = headerDataServiceInstance.generateHeaderData();
//   try {
//     const userId = event.requestContext.authorizer.id;

//     const myUsers = await userServiceInstance.getMyUsers(userId);

//     return {
//       statusCode: 201,
//       headers,
//       body: JSON.stringify({
//         message: `Success`,
//         data: myUsers,
//         headers,
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
