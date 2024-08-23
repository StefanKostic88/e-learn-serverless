import { APIGatewayProxyHandler } from "aws-lambda";
import { userServiceInstance } from "../../../../services/user.service";
import { headerDataServiceInstance } from "../../../../services/headerData.service";
import { catchAsyncProxyHandler } from "../../helpers/catchAsync";

export const allTrainings = catchAsyncProxyHandler(async () => {
  const headers = headerDataServiceInstance.generateHeaderData();
  const trainers = await userServiceInstance.getAllTrainers();

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      message: `Success`,
      data: trainers,
      headers,
    }),
  };
});
// export const allTrainings: APIGatewayProxyHandler = async () => {
//   const headers = headerDataServiceInstance.generateHeaderData();

//   try {
//     const trainers = await userServiceInstance.getAllTrainers();

//     return {
//       statusCode: 201,
//       headers,
//       body: JSON.stringify({
//         message: `Success`,
//         data: trainers,
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
