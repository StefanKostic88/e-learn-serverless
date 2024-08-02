import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.myAccount`,
  events: [
    {
      http: {
        method: "get",
        path: "myAccount",
        cors: {
          origin: "*",
          headers: ["Content-Type", "Authorization"],
          allowCredentials: false,
        },
        authorizer: {
          arn: "arn:aws:lambda:eu-north-1:975049910354:function:authorization-service-dev-basicAuthorizer",
        },
      },
    },
  ],
};
