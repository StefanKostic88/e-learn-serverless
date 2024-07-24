import * as generatePassword from "generate-password";
import { v4 } from "uuid";

export class GeneratorService {
  public static instance: GeneratorService;

  private constructor() {}

  public static getInstance() {
    if (!GeneratorService.instance) {
      GeneratorService.instance = new GeneratorService();
    }

    return GeneratorService.instance;
  }

  public generatePassword(): string {
    return generatePassword.generate({
      length: 8,
      numbers: true,
      symbols: false,
      uppercase: true,
      lowercase: true,
      excludeSimilarCharacters: false,
    });
  }

  public generateUserName(input: string = "AZ"): {
    username: string;
    userId: string;
  } {
    const userId = v4();
    const slicedName = input.slice(0, 1) + input[input.length - 1];
    const username = slicedName + "_" + userId.split("-")[0].slice(0, 4);

    return { username, userId };
  }
}
