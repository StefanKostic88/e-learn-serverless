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

import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

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
        TableName: process.env.USER_TABLE_ARN,
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
        TableName: process.env.USER_TABLE_ARN,
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
        TableName: process.env.USER_TABLE_ARN,
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
    const userItem = await this.dbClient.send(
      new GetItemCommand({
        TableName: process.env.USER_TABLE_ARN,
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
          TableName: process.env.USER_TABLE_ARN,
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
          TableName: process.env.USER_TABLE_ARN,
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

  public async getUsersByRole(role: "student" | "trainer") {
    try {
      const usersItems = await this.dbClient.send(
        new ScanCommand({
          TableName: process.env.USER_TABLE_ARN,
          FilterExpression: "#r = :role",
          ExpressionAttributeNames: {
            "#r": "role",
          },
          ExpressionAttributeValues: {
            ":role": { S: role },
          },
        })
      );

      const users = usersItems.Items?.map((item) => unmarshall(item));
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async addUserToArray(userId: string, addedUsers: string[]) {
    try {
      const currentUser = await this.getUserById(userId);

      addedUsers.forEach(async (addedUserId) => {
        const currentlyAddedUser = await this.getUserById(addedUserId);
        if (!currentlyAddedUser) {
          throw new CustomError("Candidate user does not exist", 400);
        }
        let myCurrentlyAddedUsersArray = currentlyAddedUser.myUsers || [];
        myCurrentlyAddedUsersArray.push(userId);
        myCurrentlyAddedUsersArray = Array.from(
          new Set(myCurrentlyAddedUsersArray)
        );

        await this.dbClient.send(
          new UpdateItemCommand(
            this.generateMyUsersUpdateCommand(
              addedUserId,
              myCurrentlyAddedUsersArray
            )
          )
        );
      });

      let myUsersArray = currentUser.myUsers || [];
      myUsersArray.push(...addedUsers);
      myUsersArray = Array.from(new Set(myUsersArray));

      await this.dbClient.send(
        new UpdateItemCommand(
          this.generateMyUsersUpdateCommand(userId, myUsersArray)
        )
      );
    } catch (error) {
      throw error;
    }
  }

  public generateMyUsersUpdateCommand(
    currentUserId: string,
    myUsersArray: string[]
  ) {
    const updateComand = {
      TableName: process.env.USER_TABLE_ARN,
      Key: {
        id: { S: currentUserId },
      },
      UpdateExpression: "set #myUsers = :myUsers",
      ExpressionAttributeNames: {
        "#myUsers": "myUsers",
      },
      ExpressionAttributeValues: {
        ":myUsers": { L: myUsersArray.map((myUserId) => ({ S: myUserId })) },
      },
    };

    return updateComand;
  }

  public async getMyUsers(userId: string) {
    try {
      const currentUser = await this.getUserById(userId);
      const myUsersArray = currentUser.myUsers || [];
      const myUsers = await Promise.all(
        myUsersArray.map(async (addedUserId) => {
          const newData = await this.getUserById(addedUserId);
          return newData;
        })
      );
      return myUsers;
    } catch (error) {
      throw error;
    }
  }
}
