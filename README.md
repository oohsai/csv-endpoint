<h3 align="center">Assignment</h3>

## 📝 Table of Contents

- [Usage](#usage)
- [Problem Statement](#problem_statement)
- [Approach](#approach)
- [Idea / Solution](#idea)
- [Dependencies / Limitations](#limitations)
- [Future Scope](#future_scope)
- [Technology Stack](#tech_stack)

## 🎈 Usage <a name="usage"></a>

Upon running `npm start`, the server is running and listens on localhost:3000. Queries can be made using either the card_id or user_mobile parameters.

To search using the card_id: `http://localhost:3000/get_card_status?card_id=ZYW7631`

To search using the mobile number: `http://localhost:3000/get_card_status?user_mobile=534534534`

## 🧐 Problem Statement <a name = "problem_statement"></a>

The challenge is to process data provided by various companies in separate CSV files. This data is fragmented, and comprehensive information about a user's card is not readily available. To support customer service agents and for internal tracking purposes, an endpoint /get_card_status needs to be created. This endpoint should accept either the user’s phone number or the card ID and return the status of the card.

## ⛏️ Approach <a name = "approach"></a>

- **PostgreSQL** - Database: Utilized for data storage as per the requirement to implement a persistent database.
- **Express** - Server Framework: Chosen for its flexibility, modularity, and support for middlewares. Its active community, extensive documentation, and supports majorly every service.
- **Node.js** - Server Environment: Selected for its efficient request handling, enabling the use of JavaScript/TypeScript for both frontend and backend development. Node.js boasts a vast ecosystem of open-source libraries and packages, making it highly scalable.
- **Prisma** - Database Toolkit: Employed for its support of multiple database services, connection pooling capabilities, and auto-generated CRUD operations. Prisma also facilitates real-time data synchronization.

## ⛓️ Dependencies / Limitations <a name = "limitations"></a>

The project relies on dependencies such as Express, CSV, Moment, and pg.

## 🚀 Future Scope <a name = "future_scope"></a>

- **Security Enhancements**: Implementation of role-based access control, regular auditing and patching of dependencies, and utilization of encryption techniques to safeguard sensitive data.
- **Automated CSV Upload**: Instead of manual CSV file loading, an endpoint could be developed to enable file uploads, automatically updating the database.

## 🐳 Dockerfile Execution <a name="dockerfile_execution"></a>

To run the application using Docker, follow these steps:

1. Build the Docker image using the provided Dockerfile:

   ```bash
   docker-compose build

   ```

2. Run the docker image
   ```bash
   docker-compose up
   ```
