# AlgoVision Backend API

AlgoVision backend foundation and authentication system built with Node.js, Express, MongoDB, and JWT.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB instance

### 2. Installation
Navigate to the `backend` folder and install dependencies:

```bash
cd backend
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

`.env` configuration example:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=Cluster-1
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. Running the Server

#### Development Mode (with Nodemon hot-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

---

## 📂 Architecture & Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js           # Database connection logic
│   │   └── env.js          # Validated environment configuration
│   ├── controllers/
│   │   └── auth.controller.js # Auth request handlers
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT cookie verification
│   │   ├── error.middleware.js# Global error handling
│   │   ├── notFound.middleware.js # 404 handler
│   │   └── validate.middleware.js # express-validator rules
│   ├── models/
│   │   └── User.js         # Mongoose User schema & password hashing
│   ├── routes/
│   │   ├── auth.routes.js  # /api/auth sub-router
│   │   └── index.js        # Main API router (/api)
│   ├── services/
│   │   └── auth.service.js # Authentication business logic
│   ├── utils/
│   │   ├── apiResponse.js  # Standardized API response format
│   │   └── generateToken.js# JWT & HTTP-only cookie generator
│   ├── app.js              # Express app configuration & middleware
│   └── server.js           # HTTP server startup & graceful shutdown
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 📡 API Reference

### 1. Health Check
Checks if the AlgoVision API server is active and healthy.

- **URL:** `GET /api/health`
- **Auth Required:** No
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "AlgoVision API is running"
}
```

---

### 2. User Registration
Registers a new user and sets an HTTP-only authentication cookie.

- **URL:** `POST /api/auth/register`
- **Auth Required:** No
- **Request Body:**
```json
{
  "name": "Aniket",
  "email": "aniket@example.com",
  "password": "Password123"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "660c1d2e...",
      "name": "Aniket",
      "email": "aniket@example.com",
      "avatar": null,
      "isVerified": false,
      "createdAt": "2026-10-01T10:00:00.000Z",
      "updatedAt": "2026-10-01T10:00:00.000Z"
    }
  }
}
```

---

### 3. User Login
Authenticates an existing user and sets an HTTP-only cookie (`token`).

- **URL:** `POST /api/auth/login`
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "aniket@example.com",
  "password": "Password123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "660c1d2e...",
      "name": "Aniket",
      "email": "aniket@example.com",
      "avatar": null,
      "isVerified": false,
      "createdAt": "2026-10-01T10:00:00.000Z",
      "updatedAt": "2026-10-01T10:00:00.000Z"
    }
  }
}
```

---

### 4. Get Current User Profile
Fetches details of the currently authenticated user session.

- **URL:** `GET /api/auth/me`
- **Auth Required:** Yes (via HTTP-only cookie or `Authorization: Bearer <token>`)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "user": {
      "id": "660c1d2e...",
      "name": "Aniket",
      "email": "aniket@example.com",
      "avatar": null,
      "isVerified": false,
      "createdAt": "2026-10-01T10:00:00.000Z",
      "updatedAt": "2026-10-01T10:00:00.000Z"
    }
  }
}
```

---

### 5. User Logout
Clears the authentication cookie (`token`).

- **URL:** `POST /api/auth/logout`
- **Auth Required:** No
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
