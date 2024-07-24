import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

import { middyfy } from "@libs/lambda";

import schema from "./schema";

import { userServiceInstance } from "../../../../services/user.service";
import { BcryptService } from "../../../../services/bcrypt.service";

const xInstance = BcryptService.getInstance();

const changePassword: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const userId = event.requestContext.authorizer.id;
    const currentUser = await userServiceInstance.getUserById(userId);
    const currentUserPassword = currentUser.password;

    const { newPassword, confirmPassword, currentPassword } = event.body;

    const match = await xInstance.comparePasswords(
      currentPassword,
      currentUserPassword
    );

    if (!match) {
      throw new Error("NOT MATCH WITH USER PASSWORD");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("NOT MATCH");
    }

    // encript new password
    const newEnc = await xInstance.encryptPassword(newPassword);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Change Password`,
        newPassword,
        confirmPassword,
        currentPassword,
        currentUserPassword,
        newEnc,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

export const main = middyfy(changePassword);
