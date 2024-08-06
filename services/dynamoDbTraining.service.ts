import {
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { TrainingCreationAttributes } from "../models/training.model";
import { v4 } from "uuid";
import { unmarshall } from "@aws-sdk/util-dynamodb";

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
      trainerName: { S: data.trainerName },
      studentName: { S: data.studentName },

      startDate: { S: new Date(data.startDate).toISOString() },
      duration: { S: data.duration },
      ...(data.specialization && {
        specialization: { S: data.specialization },
      }),

      ...(data.description && {
        description: { S: data.description },
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

  public async getAllTrainings() {
    try {
      const trainingItems = await this.dbClient.send(
        new ScanCommand({
          TableName: this.tableArn,
        })
      );

      const allTrainings = trainingItems.Items?.map((item) => unmarshall(item));

      return allTrainings;
    } catch (error) {
      throw error;
    }
  }

  public async myTrainingsAsStudent(userId: string) {
    try {
      const scanCommand = this.generateScanComand(userId, "student_id");

      const myTrainingsItems = await this.dbClient.send(
        new ScanCommand(scanCommand)
      );

      const myTrainings = myTrainingsItems.Items?.map((item) =>
        unmarshall(item)
      );
      return myTrainings;
    } catch (error) {
      throw error;
    }
  }

  public async myTrainingsAsTrainer(userId: string) {
    try {
      const scanCommand = this.generateScanComand(userId, "trainer_id");

      const myTrainingsItems = await this.dbClient.send(
        new ScanCommand(scanCommand)
      );

      const myTrainings = myTrainingsItems.Items?.map((item) =>
        unmarshall(item)
      );
      return myTrainings;
    } catch (error) {
      throw error;
    }
  }

  private generateScanComand(userId: string, propName: string) {
    const filterExpression = `${propName} = :${propName}`;
    const expressionAttributeValue = `:${propName}`;

    return {
      TableName: this.tableArn,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: {
        [expressionAttributeValue]: { S: userId },
      },
    };
  }
}

// {
//   TableName: this.tableArn,
//   FilterExpression: "student_id = :student_id",
//   ExpressionAttributeValues: {
//     ":student_id": { S: userId },
//   },
// }
