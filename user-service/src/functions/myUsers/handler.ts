import { APIGatewayProxyEvent } from "aws-lambda";
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
