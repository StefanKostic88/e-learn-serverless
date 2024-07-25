export default {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    username: { type: "string" },
    adress: { type: "string" },
    dateOfBirth: { type: "string" },
    specialization: { type: "string" },
  },
} as const;
