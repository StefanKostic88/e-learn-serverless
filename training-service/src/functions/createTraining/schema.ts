export default {
  type: "object",
  properties: {
    trainer_id: { type: "string" },
    student_id: { type: "string" },
    trainingType: { type: "string" },
    duration: { type: "string" },
    specialization: { type: "string" },
    trainingName: { type: "string" },
    startDate: { type: "string" },
    trainerName: { type: "string" },
  },
  required: [
    "trainer_id",
    "student_id",
    "trainingType",
    "duration",
    "specialization",
    "trainingName",
    "startDate",
    "trainerName",
  ],
} as const;
