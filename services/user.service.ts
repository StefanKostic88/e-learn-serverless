// import * as bcrypt from "bcryptjs";
import CustomError from "./customError.service";
import {
  RegisterUser,
  CurrentUser,
} from "../user-service/src/models/user.model";

import { DynamoDbService } from "./dynamoDb.service";
import { JwtService } from "./jwt.service";
import { GeneratorService } from "./generator.service";
import { BcryptService } from "./bcrypt.service";

class UserService {
  public static instance: UserService;
  dynamoDbService: DynamoDbService;
  generatorService: GeneratorService;
  bcryptService: BcryptService;
  jwtService: JwtService;

  private constructor() {
    this.dynamoDbService = DynamoDbService.getInstance();
    this.generatorService = GeneratorService.getInstance();
    this.bcryptService = BcryptService.getInstance();
    this.jwtService = JwtService.getInstance();
  }

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  public async checkIfUserExists(registerUser: RegisterUser) {
    const { email } = registerUser;

    const user = await this.dynamoDbService.checkIfUserEmailExists(email);

    if (user) {
      throw new CustomError(`User with ${email} allready exists`, 409);
    }
  }

  public async createUser(registerUser: RegisterUser) {
    try {
      if (!registerUser.role) {
        registerUser = { ...registerUser, role: "student" };
      }

      if (registerUser.role === "trainer" && !registerUser.specialization) {
        throw new CustomError("Specialization required", 400);
      }

      const userData = await this.generateUserData(registerUser);
      const userRecord = await this.dynamoDbService.createUserInTable(userData);
      return userRecord;
    } catch (error) {
      throw error;
    }
  }

  private async generateUserData(registerUser: RegisterUser) {
    const password = this.generatorService.generatePassword();

    const { username, userId } = this.generatorService.generateUserName(
      registerUser.firstName
    );
    const passwordEncrypted = await this.bcryptService.encryptPassword(
      password
    );

    const finalUserData: CurrentUser = {
      id: userId,
      firstName: registerUser.firstName,
      lastName: registerUser.lastName,
      email: registerUser.email,
      role: registerUser.role ? registerUser.role : "student",
      password: passwordEncrypted,
      dateOfBirth: registerUser.dateOfBirth,
      address: registerUser.address,
      specialization:
        registerUser.role === "trainer"
          ? registerUser.specialization
          : undefined,
      username,
      img: undefined,
      isActive: true,
    };

    return finalUserData;
  }

  public async loginUser(username: string, password: string) {
    try {
      const user = await this.dynamoDbService.findUserByUserName(username);
      const candidatePassword = user?.password;

      const isCorrect = await this.bcryptService.comparePasswords(
        password,
        candidatePassword
      );

      if (!isCorrect) {
        throw new CustomError("Password is incorrect", 401);
      }

      const token = user && (await this.jwtService.createToken(user));

      return token;
    } catch (error) {
      throw error;
    }
  }

  public async verifyUser(token: string) {
    return await this.jwtService.verifyToken(token);
  }

  public async getUserById(id: string) {
    return await this.dynamoDbService.getUserById(id);
  }

  public async updateUserPassword(
    userId: string,
    data: {
      newPassword: string;
      confirmPassword: string;
      currentPassword: string;
    }
  ) {
    try {
      const currentUser = await this.getUserById(userId);
      const currentUserPassword = currentUser.password;

      const passwordMatch = await this.bcryptService.comparePasswords(
        data.currentPassword,
        currentUserPassword
      );

      if (!passwordMatch) {
        throw new CustomError("Password does not match", 401);
      }

      if (data.newPassword !== data.confirmPassword) {
        throw new CustomError(
          "New password and confirm password does not match",
          401
        );
      }

      const newPasswordEncrypted = await this.bcryptService.encryptPassword(
        data.newPassword
      );

      await this.dynamoDbService.updateUserPassword(
        currentUser.id,
        newPasswordEncrypted
      );

      return "Password successfully updated.";
    } catch (error) {
      throw error;
    }
  }
}

export const userServiceInstance = UserService.getInstance();
