import type { AWS } from "@serverless/typescript";
import * as path from "path";

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

import createTraining from "@functions/createTraining";
import allTrainings from "@functions/allTrainings";
import myTrainings from "@functions/myTrainings";

const serverlessConfiguration: AWS = {
  service: "training-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "eu-north-1",
    profile: process.env.PROFILE,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      restApiId: "lryie611ua",
      restApiRootResourceId: "mobsudvxtg",
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "lambda:InvokeFunction",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
        ],
        Resource: [process.env.TRAINING_TABLE_ARN],
      },
    ],
  },
  // import the function via paths
  functions: { createTraining, allTrainings, myTrainings },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node20",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
