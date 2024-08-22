import { handlerPath } from "@libs/handler-resolver";
import { headerDataServiceInstance } from "../../../../services/headerData.service";
export default {
  handler: `${handlerPath(__dirname)}/handler.allStudents`,
  events: [
    {
      http: {
        method: "get",
        path: "students",
        cors: headerDataServiceInstance.generateCors(),
      },
    },
  ],
};
