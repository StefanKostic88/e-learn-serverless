export default {
  type: "object",
  properties: {
    myUsers: { type: "array", items: { type: "string" } },
  },
  required: ["myUsers"],
} as const;
