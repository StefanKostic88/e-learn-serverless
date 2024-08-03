import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.allTrainings`,
  events: [
    {
      http: {
        method: "get",
        path: "trainers",
        cors: {
          origin: "*",
          headers: ["Content-Type", "Authorization"],
          allowCredentials: false,
        },
      },
    },
  ],
};
