import { TrainingCreationAttributes } from "../models/training.model";
import { DynamoDbTrainingService } from "./dynamoDbTraining.service";
import CustomError from "./customError.service";

class TrainingService {
  public static instance: TrainingService;
  private dynamoDbTrainingService: DynamoDbTrainingService;

  private constructor() {
    this.dynamoDbTrainingService = DynamoDbTrainingService.getInstance();
  }

  public static getInstance() {
    if (!TrainingService.instance) {
      TrainingService.instance = new TrainingService();
    }

    return TrainingService.instance;
  }

  public async createTraining(inputData: TrainingCreationAttributes) {
    try {
      const currentDate = new Date(inputData.startDate);
      const today = new Date();
      // today.setHours(0, 0, 0, 0);

      if (currentDate < today) {
        throw new CustomError("The given date is older than today.", 400);
      }

      await this.dynamoDbTrainingService.createTraining(inputData);
    } catch (error) {
      throw error;
    }
  }
}

export const trainingServiceInstance = TrainingService.getInstance();
