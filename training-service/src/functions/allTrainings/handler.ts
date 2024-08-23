import { APIGatewayProxyHandler } from "aws-lambda";

import { trainingServiceInstance } from "../../../../services/training.service";
import { headerDataServiceInstance } from "../../../../services/headerData.service";
import { catchAsyncProxyHandler } from "../../helpers/catchAsync";

export const allTrainings = catchAsyncProxyHandler(async () => {
  const headers = headerDataServiceInstance.generateHeaderData();
  const data = await trainingServiceInstance.getAllTrainings();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: "Success",
      data,
    }),
  };
});

// export const allTrainings: APIGatewayProxyHandler = async () => {
//   const headers = headerDataServiceInstance.generateHeaderData();
//   try {
//     const data = await trainingServiceInstance.getAllTrainings();

//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({
//         message: "Success",
//         data,
//       }),
//     };
//   } catch (error) {
//     return {
//       statusCode: error.statusCode,
//       body: JSON.stringify({
//         message: error.message,
//       }),
//     };
//   }
// };
