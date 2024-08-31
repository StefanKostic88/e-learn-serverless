import type { AWS } from "@serverless/typescript";
import * as path from "path";

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

import getBucketList from "@functions/getBucketList";
import addUserPhoto from "@functions/addUserPhoto";

const serverlessConfiguration: AWS = {
  service: "import-service",
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
        // Action: "s3:ListBucket",
        Action: "s3:ListBucket",
        Resource:
          "arn:aws:s3:::my-file-import-bucket-s3-bucket-5501154561125-11445554-name",
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource:
          "arn:aws:s3:::my-file-import-bucket-s3-bucket-5501154561125-11445554-name/*",
      },
    ],
  },
  // import the function via paths
  functions: { getBucketList, addUserPhoto },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [],
      target: "node20",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },

  resources: {
    Resources: {
      MyS3Bucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName:
            "my-file-import-bucket-s3-bucket-5501154561125-11445554-name",
          AccessControl: "Private",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ["*"],
                AllowedMethods: ["GET", "PUT", "POST"],
                AllowedHeaders: ["*"],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
