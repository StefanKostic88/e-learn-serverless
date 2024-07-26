import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "create-training",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
        authorizer: {
          name: "trainingBasicAuthorizer",
          arn: "arn:aws:lambda:eu-north-1:975049910354:function:authorization-service-dev-basicAuthorizer",
        },
      },
    },
  ],
};
