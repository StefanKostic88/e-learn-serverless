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
