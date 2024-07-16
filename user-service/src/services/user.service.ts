import * as bcrypt from "bcryptjs";
import * as generatePassword from "generate-password";
import CustomError from "./customError.service";
import { RegisterUser, CurrentUser } from "../models/user.model";

import { v4 } from "uuid";

import { DynamoDbService } from "./dynamoDb.service";
import * as jwt from "jsonwebtoken";
import { jwtServiceInstance } from "../../../services/jwt.service";

const encryptPassword = async (password: string) => {
  const hashedPass = await bcrypt.hash(password, 10);
  return hashedPass;
};

const comparePasswords = async (
  candidatePass: string,
  encodedPass: string
): Promise<boolean> => {
  return await bcrypt.compare(candidatePass, encodedPass);
};

const generatePassowrdFunc = () => {
  return generatePassword.generate({
    length: 8,
    numbers: true,
    symbols: false,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: false,
  });
};

const generateUserName = (input: string = "AZ") => {
  const slicedName = input.slice(0, 1) + input[input.length - 1];
  return slicedName + "_" + v4().split("-")[0].slice(0, 4);
};

const createToken = (user: Record<string, any>, expiresIn = "2h") => {
  const logedInUser = {
    user_id: user.id,
    username: user.username,
    firstName: user.firstName,
    role: user.role,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(
      logedInUser,
      "super_secret_key",
      { expiresIn },
      (err: any, token: string) => {
        if (err || !token) {
          return reject(new Error("adasasd"));
        }

        resolve(token);
      }
    );
  });
};

class UserService {
  public static instance: UserService;
  dynamoDbService: DynamoDbService;

  private constructor() {
    this.dynamoDbService = DynamoDbService.getInstance();
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
    const password = generatePassowrdFunc();
    const username = generateUserName(registerUser.firstName);
    const passwordEncrypted = await encryptPassword(password);

    const finalUserData: CurrentUser = {
      id: v4(),
      firstName: registerUser.firstName,
      lastName: registerUser.lastName,
      email: registerUser.email,
      role: registerUser.role,
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
      // find user by username

      const user = await this.dynamoDbService.findUserByUserName(username);
      const candidatePassword = user.password;

      const isCorrect = await comparePasswords(password, candidatePassword);

      if (!isCorrect) {
        throw new CustomError("Password is incorrect", 401);
      }

      // const token = await createToken(user);
      // console.log(token);

      const token = await jwtServiceInstance.createToken(user);
      console.log(token);

      return token;
    } catch (error) {
      throw error;
    }
  }
}

export const userServiceInstance = UserService.getInstance();
