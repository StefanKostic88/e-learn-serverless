import { handlerPath } from "@libs/handler-resolver";
import { headerDataServiceInstance } from "../../../../services/headerData.service";

export default {
  handler: `${handlerPath(__dirname)}/handler.allTrainings`,
  events: [
    {
      http: {
        method: "get",
        path: "trainers",
        cors: headerDataServiceInstance.generateCors(),
      },
    },
  ],
};
