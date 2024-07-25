import * as jwt from "jsonwebtoken";

export class JwtService {
  public static instance: JwtService;
  private secret: string;

  private constructor() {
    this.secret = "super_secret_key";
  }

  public createToken(user: Record<string, any>, expiresIn = "2h") {
    const currentUser = {
      id: (user as { id: string }).id,
      role: (user as { role: string }).role,
    };

    return new Promise((resolve, reject) => {
      jwt.sign(currentUser, this.secret, { expiresIn }, function (err, token) {
        if (err || !token) {
          return reject(new Error(`Error while creating token: ${err}`));
        }

        resolve(token);
      });
    });
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }

    return JwtService.instance;
  }
  public verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (err) {
          return reject(new Error("Error while decoding token"));
        }
        // add type when you refactor
        resolve(decoded as Record<string, any>);
      });
    });
  }
}
