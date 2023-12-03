# DevHabit API

## Introduction
DevHabit API is a backend service designed to support the DevHabit application, a tool aimed at helping developers and people learning programming track and build their coding habits. This API manages user accounts, goals, and resources, providing a comprehensive way for users to set and track their development objectives.

## Features
- User authentication and management.
- Goal creation, updating, and tracking.
- Resource management for each goal.

## Technologies
This API is built using:
- Node.js
- Express.js
- MongoDB

## Getting Started

### Prerequisites
- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation
1. Clone the repository:
git clone https://github.com/ehoneahobed/devhabit-api.git

2. Navigate to the project directory:
```cd devhabit-api```

3. Install dependencies:
```npm install```


### Setting Up the Environment
1. Create a `.env` file in the project root.
2. Add the following environment variables:
    -  DB_URI=<your_mongodb_connection_uri>
    - JWT_SECRET=<your_jwt_secret>
    - PORT=<your_port_number>


### Running the Application
Run the application in development mode:
```npm run dev```



