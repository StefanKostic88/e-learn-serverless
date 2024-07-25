import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { CurrentUser } from "../user-service/src/models/user.model";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import CustomError from "./customError.service";

export class DynamoDbService {
  public static instance: DynamoDbService;
  dbClient: DynamoDBClient;

  private constructor() {
    this.dbClient = new DynamoDBClient();
  }

  public static getInstance() {
    if (!DynamoDbService.instance) {
      DynamoDbService.instance = new DynamoDbService();
    }
    return DynamoDbService.instance;
  }

  public async createUserInTable(user: CurrentUser) {
    try {
      const userItem = {
        id: { S: user.id },
        firstName: { S: user.firstName },
        lastName: { S: user.lastName },
        username: { S: user.username },
        password: { S: user.password },
        email: { S: user.email },
        ...(user.dateOfBirth && { dateOfBirth: { S: user.dateOfBirth } }),
        ...(user.address && { address: { S: user.address } }),
        ...(user.specialization && {
          specialization: { S: user.specialization },
        }),
        ...(user.img && { img: { S: user.img } }),
        role: { S: user.role },
        isActive: { BOOL: user.isActive },
      };

      const putCommand = {
        TableName: "arn:aws:dynamodb:eu-north-1:975049910354:table/Users",
        Item: userItem,
      };

      const userRecord = await this.dbClient.send(
        new PutItemCommand(putCommand)
      );

      return userRecord;
    } catch (error) {
      throw error;
    }
  }

  public async checkIfUserEmailExists(email: string) {
    try {
      const scanCommand = {
        TableName: "arn:aws:dynamodb:eu-north-1:975049910354:table/Users",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": { S: email },
        },
      };
      const scannedUsers = await this.dbClient.send(
        new ScanCommand(scanCommand)
      );
      const user = scannedUsers.Items?.[0];
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findUserByUserName(username: string) {
    try {
      const scanCommand = {
        TableName: "arn:aws:dynamodb:eu-north-1:975049910354:table/Users",
        FilterExpression: "username = :username",
        ExpressionAttributeValues: {
          ":username": { S: username },
        },
      };

      const userItem = await this.dbClient.send(new ScanCommand(scanCommand));
      if (userItem.Items?.length === 0) {
        throw new CustomError(
          `No user with selected username: ${username} found`,
          400
        );
      }
      const user = userItem.Items?.[0] && unmarshall(userItem.Items[0]);
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async getUserById(userId: string) {
    console.log(userId);

    const userItem = await this.dbClient.send(
      new GetItemCommand({
        TableName: "arn:aws:dynamodb:eu-north-1:975049910354:table/Users",
        Key: {
          id: { S: userId },
        },
      })
    );

    if (!userItem.Item) {
      throw new CustomError(`No user with id: ${userId} found`, 404);
    }

    const user = unmarshall(userItem.Item) as CurrentUser;

    return user;
  }

  public async updateUserPassword(userId: string, newPassword: string) {
    try {
      await this.dbClient.send(
        new UpdateItemCommand({
          TableName: "arn:aws:dynamodb:eu-north-1:975049910354:table/Users",
          Key: {
            id: { S: userId },
          },
          UpdateExpression: "set #password = :password",
          ExpressionAttributeNames: {
            "#password": "password",
          },
          ExpressionAttributeValues: {
            ":password": { S: newPassword },
          },
        })
      );
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(userId: string, userData: Record<string, any>) {
    try {
      const updatedExpresion =
        "set " +
        Object.keys(userData)
          .map((attr) => `#${attr} = :${attr}`)
          .join(", ");

      const expressionAttributeNames = Object.keys(userData).reduce(
        (acc, attr) => {
          acc[`#${attr}`] = attr;
          return acc;
        },
        {} as { [key: string]: string }
      );

      const expressionAttributeValues = Object.keys(userData).reduce(
        (acc, attr) => {
          acc[`:${attr}`] = { S: userData[attr] };
          return acc;
        },
        {} as { [key: string]: any }
      );

      await this.dbClient.send(
        new UpdateItemCommand({
          TableName: "arn:aws:dynamodb:eu-north-1:975049910354:table/Users",
          Key: {
            id: { S: userId },
          },
          UpdateExpression: updatedExpresion,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
        })
      );
    } catch (error) {
      throw error;
    }
  }
}
