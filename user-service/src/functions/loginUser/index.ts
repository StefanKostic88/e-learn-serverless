import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "login",
        cors: {
          origin: "*",
          headers: ["Content-Type"],
          allowCredentials: false,
        },
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};

// "X-Amz-Date",
// "Authorization",
// "X-Api-Key",
// "X-Amz-Security-Token",
