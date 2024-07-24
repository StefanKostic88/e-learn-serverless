export default {
  type: "object",
  properties: {
    currentPassword: { type: "string" },
    newPassword: { type: "string" },
    confirmPassword: { type: "string" },
  },
  required: ["currentPassword", "newPassword", "confirmPassword"],
} as const;
