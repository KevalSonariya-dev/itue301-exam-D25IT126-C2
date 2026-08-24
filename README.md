# Employee Leave Management System (ITUE301 - Set C)

A full-stack Employee Leave Management portal built using React (Frontend), Express.js (Backend), and MongoDB with Mongoose.

---

## 🛠️ Tech Stack
- **Frontend**: React, React Router, Vite, Context API
- **Backend**: Node.js, Express.js, JWT, Bcryptjs
- **Database**: MongoDB / MongoDB Atlas with Mongoose schemas

---

## 🚀 Setup & Run Instructions

### 1. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env` (refer to `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=itue301_exam_secret_key_2026
   ```
4. Start the backend server:
   ```bash
   npm start
   # or
   node server.js
   ```
   *The backend runs on `http://localhost:5000`.*

---

### 2. Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173`.*

---

## 📡 REST API Endpoints (`/api/v1/`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate employee & issue JWT token | Public |
| `GET` | `/api/v1/leave-types` | Get all available leave types | Public |
| `POST` | `/api/v1/leaves` | Apply for leave (validates balance & deducts) | Protected (`authGuard`) |
| `GET` | `/api/v1/leaves/my` | Retrieve logged-in employee's leave requests | Protected (`authGuard`) |
| `PATCH` | `/api/v1/leaves/:id/status` | Approve or reject leave request | Protected (`authGuard`) |

---

## 🛡️ Custom Middleware
- **`requestLogger`**: Globally logs `[METHOD] [PATH] [TIMESTAMP]` for every request.
- **`authGuard`**: Validates the Bearer token in the `Authorization` header and returns `401 Unauthorized` if missing/invalid.
- **`errorHandler`**: Catches all unhandled exceptions and returns structured JSON responses.
