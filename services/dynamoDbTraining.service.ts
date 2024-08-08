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
      endDate: { S: new Date(data.endDate).toISOString() },
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

  public async myTrainingsAsStudent(
    userId: string,
    params: {
      name: string;
      specialization: string;
      createdBefore?: string;
      createdAfter?: string;
    }
  ) {
    try {
      const scanCommand = this.generateScanComand(
        userId,
        "student_id",
        params,
        "trainerName"
      );

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

  public async myTrainingsAsTrainer(
    userId: string,
    params: {
      name?: string;
      specialization?: string;
      createdBefore?: string;
      createdAfter?: string;
    }
  ) {
    try {
      const scanCommand = this.generateScanComand(
        userId,
        "trainer_id",
        params,
        "studentName"
      );

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

  private generateScanComand(
    userId: string,
    propName: string,
    params: {
      name?: string;
      specialization?: string;
      createdBefore?: string;
      createdAfter?: string;
    },
    searchedName: string
  ) {
    console.log(params);
    let filterExpression = `#${propName} = :${propName}`;
    let expressionAttributeValues: { [key: string]: any } = {
      [`:${propName}`]: { S: userId },
    };
    let expressionAttributeNames: { [key: string]: string } = {
      [`#${propName}`]: propName,
    };

    if (params?.name) {
      filterExpression += ` and #${searchedName} = :${searchedName}`;
      expressionAttributeValues[`:${searchedName}`] = { S: params.name };
    }

    if (params?.specialization) {
      filterExpression += " and #specialization = :specialization";
      expressionAttributeValues[":specialization"] = {
        S: params.specialization,
      };
    }

    if (params?.name) {
      expressionAttributeNames[`#${searchedName}`] = `${searchedName}`;
    }

    if (params?.specialization) {
      expressionAttributeNames["#specialization"] = "specialization";
    }

    if (params?.createdBefore && params?.createdAfter) {
      filterExpression +=
        " and #startDate BETWEEN :createdBefore AND :createdAfter";
      // expressionAttributeValues[":startDate"] = params.startDate;
      // expressionAttributeValues[":endDate"] = params.endDate;
      expressionAttributeValues = {
        ...expressionAttributeValues,
        ":createdBefore": { S: params.createdBefore.toString() },
        ":createdAfter": { S: params.createdAfter.toString() },
      };

      expressionAttributeNames = {
        ...expressionAttributeNames,
        "#startDate": "startDate",
      };
      // expressionAttributeNames["#created_at"] = "created_at";
    }

    console.log({
      TableName: this.tableArn,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    return {
      TableName: this.tableArn,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };
  }
}
