import { userServiceInstance } from "../../../../services/user.service";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

import { catchAsyncProxyHandler } from "../../helpers/catchAsync";

export const allStudents = catchAsyncProxyHandler(async () => {
  const headers = headerDataServiceInstance.generateHeaderData();

  const students = await userServiceInstance.getAllStudents();

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      message: `Success`,
      data: students,
      headers,
    }),
  };
});
