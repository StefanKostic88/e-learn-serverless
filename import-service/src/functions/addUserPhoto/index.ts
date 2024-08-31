import { handlerPath } from "@libs/handler-resolver";
// import schema from "./schema";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export default {
  handler: `${handlerPath(__dirname)}/handler.addUserPhoto`,
  events: [
    {
      http: {
        method: "get",
        path: "import-photo",
        cors: headerDataServiceInstance.generateCors(),
        // request: {
        //   schemas: {
        //     "application/json": schema,
        //   },
        // },
      },
    },
  ],
};
