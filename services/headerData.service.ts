export enum HeaderDataTypes {
  POST = "POST",
  GET = "GET",
  PATCH = "PATCH",
}

class HeaderDataService {
  public static instance: HeaderDataService;

  private constructor() {}

  public static getInstance() {
    if (!HeaderDataService.instance) {
      HeaderDataService.instance = new HeaderDataService();
    }

    return HeaderDataService.instance;
  }

  public generateHeaderData(method: HeaderDataTypes = HeaderDataTypes.GET) {
    return {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": `OPTIONS,${method}`,
    };
  }

  public generateCors() {
    return {
      origin: "*",
      headers: ["Content-Type", "Authorization"],
      allowCredentials: false,
    };
  }
}

export const headerDataServiceInstance = HeaderDataService.getInstance();
