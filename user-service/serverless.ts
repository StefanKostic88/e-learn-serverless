import type { AWS } from "@serverless/typescript";
import * as path from "path";

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

import createUser from "@functions/createUser";
import loginUser from "@functions/loginUser";
import myAccount from "@functions/myAccount";
import changePassword from "@functions/changePassword";
import editProfile from "@functions/editProfile";
import allTrainers from "@functions/allTrainers";
import allStudents from "@functions/allStudents";

const serverlessConfiguration: AWS = {
  service: "user-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "eu-north-1",
    profile: process.env.PROFILE,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
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
        Resource: [process.env.USER_TABLE_ARN],
      },
    ],
  },
  // import the function via paths
  functions: {
    createUser,
    loginUser,
    myAccount,
    changePassword,
    editProfile,
    allTrainers,
    allStudents,
  },

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
