import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "users",
        cors: {
          origin: "*",
          headers: ["Content-Type", "Authorization"],
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
