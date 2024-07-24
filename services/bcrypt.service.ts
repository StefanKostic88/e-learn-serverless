import * as bcrypt from "bcryptjs";

export class BcryptService {
  public static instance: BcryptService;

  private constructor() {}

  public static getInstance() {
    if (!BcryptService.instance) {
      BcryptService.instance = new BcryptService();
    }

    return BcryptService.instance;
  }

  public async encryptPassword(password: string): Promise<string> {
    const hashedPass = await bcrypt.hash(password, 10);
    return hashedPass;
  }
  public async comparePasswords(
    candidatePass: string,
    encodedPass: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePass, encodedPass);
  }
}
