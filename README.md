# 🏋️ FitTrack - MERN Fitness Tracker

A premium, full-stack fitness tracking application built with MongoDB, Express, React, and Node.js. Featuring a modern dark-mode UI with glassmorphism aesthetics.

## 🚀 Features
- **Modern Dashboard**: Track total calories, duration, and workout counts.
- **Workout Logging**: Add, View, and Delete your workout sessions.
- **Secure Auth**: JWT-based registered and login.
- **Premium UI**: Crafted with plain CSS (No UI libraries) for maximum performance and unique design.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Check the `.env` file (one has been created for you):
   - `MONGO_URI`: Update this if your MongoDB is on a different port or using Atlas.
   - `JWT_SECRET`: Change this to a secure random string.
4. Start the server:
   ```bash
   npm start
   ```
   *Note: You may need to add `"start": "node server.js"` to your `package.json` if it's missing.*

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: login and get JWT token

### Workouts
- `GET /api/workouts`: Get all workouts for the logged-in user
- `POST /api/workouts`: Create a new workout
- `PUT /api/workouts/:id`: Update a workout
- `DELETE /api/workouts/:id`: Delete a workout

---

## 🎨 Design System
- **Font**: Outfit (via Google Fonts)
- **Colors**: Cyber Cyan (#00f2fe), Neon Blue (#4facfe), Dark Slate (#0f172a)
- **Components**: Functional React components with unique scoped CSS files.
