import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.getBucketList`,
  events: [
    {
      http: {
        method: "get",
        path: "get-image",
      },
    },
  ],
};
