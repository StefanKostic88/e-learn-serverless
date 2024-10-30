# E Learn Backend

e-learn-backend is a backend service for the ELearnApp, built using AWS services including API Gateway, Lambda, and DynamoDB. This monorepo consists of four distinct services: Authorization, Import, Training, and User Service. The project is developed using **Node.js 20** with **TypeScript** and utilizes the **Serverless Framework** for deploying and managing serverless applications.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Services](#services)
  - [Authorization Service](#authorization-service)
  - [Import Service](#import-service)
  - [Training Service](#training-service)
  - [User Service](#user-service)
- [API Endpoints](#api-endpoints)

## Features

- Utilizes AWS API Gateway for handling API requests.
- Implements Lambda functions for serverless architecture.
- Uses DynamoDB for storing user and training data.
- Supports JWT for secure user authentication and authorization.
- Developed with **Node.js 20** and **TypeScript** for type safety and modern JavaScript features.

## Architecture

The backend architecture consists of several AWS components working together to provide a robust and scalable solution for the E-Learning platform.

- **API Gateway**: Manages incoming requests and routes them to the appropriate Lambda functions.
- **Lambda**: Executes the backend logic for each service in a serverless manner.
- **DynamoDB**: Provides a NoSQL database for storing user profiles and training data.

## Services

### Authorization Service

The Authorization Service utilizes Lambda Authorizer in conjunction with JWT (JSON Web Tokens) to secure API endpoints. It verifies user identities and grants access to the respective resources.

### Import Service

The Import Service is responsible for uploading user profile photos. It handles file uploads and stores the images securely in AWS S3.

### Training Service

The Training Service manages the creation and updating of training sessions for students and trainers. It allows for efficient management of training data and schedules.

### User Service

The User Service handles all user-related tasks, including:

- Creating and updating student and trainer profiles.
- Establishing relationships between users (students and trainers).
- Managing user authentication and authorization.

## API Endpoints

```json
{
  "login": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/login"
  },
  "registerUser": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/users"
  },
  "myAccount": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/myAccount"
  },
  "logout": {
    "apiEndpoint": "http://localhost:8000/api/logout"
  },
  "changePassword": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/change-password"
  },
  "editUser": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/edit"
  },
  "myTrainingForTrainers": {
    "apiEndpoint": "http://localhost:8000/api/trainings/my-trainings-trainer"
  },
  "myUsers": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/my-users"
  },
  "allTrainers": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/trainers"
  },
  "uploadPhoto": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/import-photo"
  },
  "myTrainings": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/my-trainings"
  },
  "addMyUsers": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/add-my-users"
  },
  "createTraining": {
    "apiEndpoint": "https://lryie611ua.execute-api.eu-north-1.amazonaws.com/dev/create-training"
  }
}
```
