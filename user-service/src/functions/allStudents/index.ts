import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.allStudents`,
  events: [
    {
      http: {
        method: "get",
        path: "students",
        cors: {
          origin: "*",
          headers: ["Content-Type", "Authorization"],
          allowCredentials: false,
        },
      },
    },
  ],
};
