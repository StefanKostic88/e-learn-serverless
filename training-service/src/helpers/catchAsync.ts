import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context,
} from "aws-lambda";
import {
  headerDataServiceInstance,
  HeaderDataTypes,
} from "../../../services/headerData.service";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";

const headerData = {
  [HeaderDataTypes.GET]: headerDataServiceInstance.generateHeaderData(),
  [HeaderDataTypes.POST]: headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.POST
  ),
  [HeaderDataTypes.PATCH]: headerDataServiceInstance.generateHeaderData(
    HeaderDataTypes.PATCH
  ),
};

export const catchAsyncProxyHandler = (
  fn: APIGatewayProxyHandler,
  method: HeaderDataTypes = HeaderDataTypes.GET
) => {
  return async (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback<APIGatewayProxyResult>
  ) => {
    try {
      return await fn(event, context, callback);
    } catch (error) {
      let headers = headerData[method];

      return {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify({
          message: error.message,
          headers,
        }),
      };
    }
  };
};

export const catchAsyncValidatorHandler = <T>(
  fn: ValidatedEventAPIGatewayProxyEvent<T>,
  method: HeaderDataTypes = HeaderDataTypes.POST
) => {
  return async (event, context, callback) => {
    try {
      return await fn(event, context, callback);
    } catch (error) {
      let headers = headerData[method];

      return {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify({
          message: error.message,
          headers,
        }),
      };
    }
  };
};
