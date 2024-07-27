import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { TrainingCreationAttributes } from "../models/training.model";
import { v4 } from "uuid";

export class DynamoDbTrainingService {
  public static instance: DynamoDbTrainingService;
  private dbClient: DynamoDBClient;
  private tableArn = "arn:aws:dynamodb:eu-north-1:975049910354:table/Trainings";

  private constructor() {
    this.dbClient = new DynamoDBClient();
  }

  public static getInstance() {
    if (!DynamoDbTrainingService.instance) {
      DynamoDbTrainingService.instance = new DynamoDbTrainingService();
    }
    return DynamoDbTrainingService.instance;
  }

  public async createTraining(data: TrainingCreationAttributes) {
    const trainingId = v4();
    const trainingItem = {
      id: { S: trainingId },
      trainer_id: { S: data.trainer_id },
      student_id: { S: data.student_id },
      trainingType: { S: data.trainingType },
      trainingName: { S: data.trainingName },
      startDate: { S: new Date(data.startDate).toISOString() },
      duration: { S: data.duration },
      ...(data.specialization && {
        specialization: { S: data.specialization },
      }),
    };

    await this.dbClient.send(
      new PutItemCommand({
        TableName: this.tableArn,
        Item: trainingItem,
      })
    );

    try {
    } catch (error) {
      throw error;
    }
  }
}
