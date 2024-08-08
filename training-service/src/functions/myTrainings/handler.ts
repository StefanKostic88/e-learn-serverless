import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { trainingServiceInstance } from "../../../../services/training.service";

export const myTrainings: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
  };
  try {
    const userId = event.requestContext.authorizer.id;
    const role = event.requestContext.authorizer.role;
    const params = event.queryStringParameters as {
      name: string;
      specialization: string;
      createdBefore?: string;
      createdAfter?: string;
    };

    // const userId = "8bec805c-14fb-4e42-8c4f-336642fa596c"; //student
    // const userId = "cccdef55-3904-46f1-92fa-27ebf8a4c1c2"; //trainer
    // const role = "student";
    // const role = "trainer";
    // const name = "Stefan";

    // ovde si stao

    // const expressionAttributeNames = Object.keys(params).reduce((acc, attr) => {
    //   acc[`#${attr}`] = attr;
    //   return acc;
    // }, {} as { [key: string]: string });
    // console.log(expressionAttributeNames);

    const data = await trainingServiceInstance.getMyTrainings(
      userId,
      role,
      params
    );
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Success",
        data,
        headers,
        params,
      }),
    };
  } catch (error) {
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
