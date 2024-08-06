export interface TrainingCreationAttributes {
  trainer_id: string;
  student_id: string;
  trainingType: string;
  duration: string;
  specialization?: string;
  trainingName: string;
  startDate: string;
  trainerName: string;
  studentName: string;
  description?: string;
}

type TrainingWithoutStartDate = Omit<TrainingCreationAttributes, "startDate">;

export interface Training extends TrainingWithoutStartDate {
  startDate: Date;
}
