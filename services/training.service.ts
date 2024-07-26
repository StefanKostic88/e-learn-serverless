import { TrainingCreationAttributes, Training } from "../models/training.model";

class TrainingService {
  public static instance: TrainingService;

  private constructor() {}

  public static getInstance() {
    if (!TrainingService.instance) {
      TrainingService.instance = new TrainingService();
    }

    return TrainingService.instance;
  }

  public async createTraining(inputData: TrainingCreationAttributes) {
    console.log(inputData);
  }
}

export const trainingServiceInstance = TrainingService.getInstance();
