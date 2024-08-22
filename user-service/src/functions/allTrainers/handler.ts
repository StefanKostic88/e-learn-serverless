import { APIGatewayProxyHandler } from "aws-lambda";
import { userServiceInstance } from "../../../../services/user.service";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export const allTrainings: APIGatewayProxyHandler = async () => {
  const headers = headerDataServiceInstance.generateHeaderData();

  try {
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

// const headers = {
//   "Access-Control-Allow-Headers": "Content-Type",
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "OPTIONS,GET",
// };
