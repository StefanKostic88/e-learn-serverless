import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "patch",
        path: "change-password",
        cors: headerDataServiceInstance.generateCors(),
        request: {
          schemas: {
            "application/json": schema,
          },
        },
        authorizer: {
          arn: "arn:aws:lambda:eu-north-1:975049910354:function:authorization-service-dev-basicAuthorizer",
        },
      },
    },
  ],
};

// {
//   origin: "*",
//   headers: ["Content-Type", "Authorization"],
//   allowCredentials: false,
// },
