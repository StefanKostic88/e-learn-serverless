import * as jwt from "jsonwebtoken";

class JwtService {
  public static instance: JwtService;
  private secret: string;

  private constructor() {
    this.secret = "super_secret_key";
  }

  public createToken(user: object, expiresIn = "2h") {
    const currentUser = {
      id: (user as { id: string }).id,
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
          console.log(err);
          return reject(err.message);
          return reject(new Error("Error while decoding token"));
        }
        // add type when you refactor
        resolve(decoded as object);
      });
    });
  }
}

export const jwtServiceInstance = JwtService.getInstance();
