import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.myTrainings`,
  events: [
    {
      http: {
        method: "get",
        path: "my-trainings",
        cors: {
          origin: "*",
          headers: ["Content-Type", "Authorization"],
          allowCredentials: false,
        },
        authorizer: {
          name: "trainingBasicAuthorizer",
          arn: "arn:aws:lambda:eu-north-1:975049910354:function:authorization-service-dev-basicAuthorizer",
        },
      },
    },
  ],
};
