import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "users",
        cors: headerDataServiceInstance.generateCors(),
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
