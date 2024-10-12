# Course Selling App

## Description

A course-selling app built with Node.js, Express, and MongoDB.

## Features

- User authentication (login/signup)
- Admin authentication (login/signup)
- Course management (create/delete)
- Purchase courses

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- dotenv
- bcryptjs

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/course-selling-app.git

   ```

2. Navigate to the project directory:

   ```bash
   cd course-app

   ```

3. Install dependencies:

   ```bash
   npm install

   ```

4. Create a .env file and add your MongoDB connection string and JWT secret:

5. Start the server:

   ```bash
   node index.js

   ```

6. Access the api at http://localhost:3000/api:

### API Endpoints

- User Routes

- POST /api/users/login

- POST /api/users/signup

- POST /api/users/purchase

- GET /api/users

- GET /api/users/purchased

- Admin Routes

- POST /api/admins/login

- POST /api/admins/signup

- POST /api/admins/courses

- DELETE /api/admins/courses/:id

- POST /api/admins/courses/:id/content
