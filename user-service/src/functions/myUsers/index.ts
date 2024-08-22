import { handlerPath } from "@libs/handler-resolver";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export default {
  handler: `${handlerPath(__dirname)}/handler.myUsers`,
  events: [
    {
      http: {
        method: "get",
        path: "my-users",
        cors: headerDataServiceInstance.generateCors(),
        authorizer: {
          arn: "arn:aws:lambda:eu-north-1:975049910354:function:authorization-service-dev-basicAuthorizer",
        },
      },
    },
  ],
};
