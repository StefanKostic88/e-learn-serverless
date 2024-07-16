export default {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    role: { type: "string" },
    specialization: { type: "string" },
    adress: { type: "string" },
    dateOfBirth: { type: "string" },
  },
  required: ["firstName", "lastName", "email"],
} as const;
